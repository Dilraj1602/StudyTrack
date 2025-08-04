const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // console.log('Auth middleware hit for:', req.path);
  let token = req.cookies.token;
  // Check Authorization header if no cookie
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log('Token found:', !!token);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; 
    // console.log('User ID set:', req.user);
    next();
  } catch (err) {
    // console.log('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
}; 