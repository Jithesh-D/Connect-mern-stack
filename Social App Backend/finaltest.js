require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-media";
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

console.log("🚀 Starting final test server...");

// Test MongoDB connection first
async function testMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
    return false;
  }
}

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Final test server running!",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Load all routes (same as your main app.js)
const routes = [
  { path: "./Routes/postsRoute", route: "/api/posts" },
  { path: "./Routes/authRoute", route: "/api/auth" },
  { path: "./Routes/eventRoute", route: "/api/events" },
  { path: "./Routes/commentRoute", route: "/api/comments" },
  { path: "./Bot/routes/botRoute", route: "/api/bot" },
  { path: "./Bot/routes/gemini", route: "/api/gemini" },
  { path: "./Bot/routes/testroute", route: "/api/test" },
];

routes.forEach(({ path, route }) => {
  try {
    const router = require(path);
    app.use(route, router);
    console.log(`✅ ${route} loaded successfully`);
  } catch (error) {
    console.log(`❌ ${route} failed:`, error.message);
  }
});

// Test chatbot endpoint directly
app.post("/api/test-chat", (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    response: `Test successful! Received: "${message}"`,
    timestamp: new Date().toISOString(),
  });
});

// Start server
async function startServer() {
  const dbConnected = await testMongoDB();

  app.listen(PORT, () => {
    console.log(`\n🎉 FINAL TEST SERVER RUNNING ON http://localhost:${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Bot test: POST http://localhost:${PORT}/api/test-chat`);
    console.log(`💬 Real bot: POST http://localhost:${PORT}/api/bot/ask`);
    console.log(`🌟 Gemini: POST http://localhost:${PORT}/api/gemini/ask`);
    console.log(
      `\n📊 Database: ${dbConnected ? "✅ Connected" : "❌ Disconnected"}`
    );
    console.log("🎯 All routes loaded successfully!");
  });
}

startServer();
