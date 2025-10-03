const express = require("express");
const router = express.Router();

// Simple test endpoint - no complex parameters
router.get("/", (req, res) => {
  res.json({
    message: "Test route is working!",
    timestamp: new Date().toISOString(),
  });
});

// Add a simple health check for this route
router.get("/health", (req, res) => {
  res.json({
    status: "Test route is healthy",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
