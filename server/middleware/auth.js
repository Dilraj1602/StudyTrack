const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // decoded.id is now user._id
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}; 