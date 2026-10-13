const jwt = require('jsonwebtoken');

// Protect middleware - verifies JWT token from Authorization header
const protect = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated. Authorization header missing.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Not authenticated. Invalid authorization header format.' });
  }

  const token = parts[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Token verification failed.' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  req.userId = decodedToken.userId;
  req.userRole = decodedToken.role;
  req.userEmail = decodedToken.email;
  next();
};

// Authorize middleware - checks if user has one of the allowed roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Forbidden: Access denied. Role '${req.userRole || 'guest'}' is not authorized to access this route.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
