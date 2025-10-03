require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Minimal server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Simple chatbot endpoint
app.post("/api/bot/ask", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  res.json({
    success: true,
    response: `I received: "${message}". Chatbot service is working!`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Minimal server running at http://localhost:${PORT}`);
  console.log(`🔍 Test health: http://localhost:${PORT}/api/health`);
});
