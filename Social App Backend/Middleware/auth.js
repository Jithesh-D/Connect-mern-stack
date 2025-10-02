const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized - Please login first" });
  }

  // Make sure user object has the expected structure
  req.user = req.session.user;

  next();
};

module.exports = authMiddleware;
