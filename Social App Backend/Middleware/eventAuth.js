const jwt = require('jsonwebtoken');

const eventAuthMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    if (decoded.role !== 'event_creator') {
      return res.status(403).json({ error: "Access denied. Not authorized to create events." });
    }

    req.eventCreator = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = eventAuthMiddleware;