const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];
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
  next();
};
