// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (roles = []) {
  return (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = decoded.user;

      // If roles are specified, check if the user has the required role
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};
