const express = require("express");
const geminiRouter = express.Router();
const { handleChat } = require("../controllers/botController");

// Correct relative path
geminiRouter.post("/ask", handleChat);

module.exports = geminiRouter;
