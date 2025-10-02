// botRoutes.js
const express = require("express");
const router = express.Router();
const { health, scrape, query } = require("../controllers/botController");

// public health check
router.get("/health", health);

// admin/manual scrape (protect this route in prod!)
router.post("/scrape", scrape);

// user query endpoint
router.post("/query", query);

module.exports = router;
