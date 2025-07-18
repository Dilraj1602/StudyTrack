const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const token = jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const user = await User.create({ username, email, password: hash, token });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, username: user.username, email: user.email } });
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
    const token = jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    user.token = token;
    await user.save();
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.json({ loggedIn: false });
    }
    const user = await User.findOne({ email: decoded.id });
    if (!user || user.token !== token) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ loggedIn: false });
  }
}; 