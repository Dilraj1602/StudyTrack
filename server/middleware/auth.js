const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.cookies.token;
  // Check Authorization header if no cookie
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // decoded.id is now user._id
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}; 