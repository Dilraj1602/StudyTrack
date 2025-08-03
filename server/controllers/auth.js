const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Registration failed' }); 
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      firstName, 
      lastName, 
      email, 
      password: hash 
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const username = `${user.firstName} ${user.lastName}`;
    const cookieOptions = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
    res.cookie('token', token, cookieOptions);
    res.json({ user: { id: user._id, username, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Construct username for response
    const username = `${user.firstName} ${user.lastName}`;
    const cookieOptions = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
    res.cookie('token', token, cookieOptions);
    res.json({ user: { id: user._id, username, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  };
  res.clearCookie('token', cookieOptions);
  res.json({ message: 'Logged out' });
};

exports.getCurrentUser = async (req, res) => {
  try {
    let token = req.cookies.token;
    console.log('getCurrentUser - Cookie token:', !!token);
    console.log('getCurrentUser - Authorization header:', req.headers.authorization);
    
    // Check Authorization header if no cookie
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('getCurrentUser - Using Bearer token:', !!token);
    }
    
    if (!token) {
      console.log('getCurrentUser - No token found');
      return res.json({ loggedIn: false });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('getCurrentUser - Token decoded successfully, user ID:', decoded.id);
    } catch (err) {
      console.log('Token verification failed in getCurrentUser:', err.message);
      return res.json({ loggedIn: false });
    }
    
    const user = await User.findById(decoded.id);
    console.log('getCurrentUser - User found:', !!user);
    if (!user) {
      return res.json({ loggedIn: false });
    }
    
    // Construct username from firstName and lastName
    const username = `${user.firstName} ${user.lastName}`;
    console.log('getCurrentUser - Authentication successful for:', username);
    res.json({ loggedIn: true, user: { id: user._id, username, email: user.email } });
  } catch (err) {
    console.log('getCurrentUser error:', err.message);
    res.status(500).json({ loggedIn: false });
  }
}; 
