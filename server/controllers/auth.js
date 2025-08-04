const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../config/email');

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
    // console.log('getCurrentUser - Cookie token:', !!token);
    // console.log('getCurrentUser - Authorization header:', req.headers.authorization);
    
    // Check Authorization header if no cookie
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      // console.log('getCurrentUser - Using Bearer token:', !!token);
    }
    
    if (!token) {
      // console.log('getCurrentUser - No token found');
      return res.json({ loggedIn: false });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('getCurrentUser - Token decoded successfully, user ID:', decoded.id);
    } catch (err) {
      // console.log('Token verification failed in getCurrentUser:', err.message);
      return res.json({ loggedIn: false });
    }
    
    const user = await User.findById(decoded.id);
    // console.log('getCurrentUser - User found:', !!user);
    if (!user) {
      return res.json({ loggedIn: false });
    }
    
    // Construct username from firstName and lastName
    const username = `${user.firstName} ${user.lastName}`;
    // console.log('getCurrentUser - Authentication successful for:', username);
    res.json({ loggedIn: true, user: { id: user._id, username, email: user.email } });
  } catch (err) {
    // console.log('getCurrentUser error:', err.message);
    res.status(500).json({ loggedIn: false });
  }
}; 

exports.changePassword = async (req, res) => {
  // console.log('Change password endpoint hit');
  // console.log('Request body:', req.body);
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user; 
  // console.log('User details:', req.user);
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ message: 'New password must be at least 4 characters long' });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code in user document with expiration
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email with verification code
    const emailSent = await sendPasswordResetEmail(email, verificationCode);
    
    if (emailSent) {
      res.json({ message: 'A verification code has been sent to your email address.', email });
    } else {
      // If email fails, still return success but log the issue
      // console.log(`Verification code for ${email}: ${verificationCode}`);
      res.json({ message: 'A verification code has been sent to your email address.', email });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP only (without password reset)
exports.verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if code matches and is not expired
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Just verify the code without updating password
    res.json({ message: 'Verification code is valid' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password with verified OTP
exports.verifyResetCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, verification code, and new password are required' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ message: 'New password must be at least 4 characters long' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if code matches and is not expired
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset fields
    user.password = hashedNewPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Verify reset code error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 
