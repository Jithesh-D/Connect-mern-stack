const express = require("express");
const router = express.Router();
const botController = require("../controllers/botController");

// Chat endpoint
router.post("/ask", botController.handleChat);

// Scraping status endpoint
router.get("/scraping-status", botController.getScrapingStatus);

// Refresh data endpoint
router.post("/refresh-data", botController.refreshData);

module.exports = router;
