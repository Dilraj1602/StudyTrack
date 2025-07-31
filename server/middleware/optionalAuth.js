const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
  } catch (err) {
    req.user = null; 
  }
  next();
}; 