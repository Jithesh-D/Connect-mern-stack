require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

console.log("🔍 Starting diagnostic server...");

// Test 1: Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Diagnostic server running", test: "Basic route OK" });
});

console.log("✅ Test 1: Basic route registered");

// Test 2: Try loading posts route
try {
  const postRouter = require("./Routes/postsRoute");
  app.use("/api/posts", postRouter);
  console.log("✅ Posts route loaded successfully");
} catch (error) {
  console.log("❌ Posts route FAILED:", error.message);
}

// Test 3: Try loading auth route
try {
  const authRouter = require("./Routes/authRoute");
  app.use("/api/auth", authRouter);
  console.log("✅ Auth route loaded successfully");
} catch (error) {
  console.log("❌ Auth route FAILED:", error.message);
}

// Test 4: Try loading events route
try {
  const eventRouter = require("./Routes/eventRoute");
  app.use("/api/events", eventRouter);
  console.log("✅ Events route loaded successfully");
} catch (error) {
  console.log("❌ Events route FAILED:", error.message);
}

// Test 5: Try loading comments route
try {
  const commentRouter = require("./Routes/commentRoute");
  app.use("/api/comments", commentRouter);
  console.log("✅ Comments route loaded successfully");
} catch (error) {
  console.log("❌ Comments route FAILED:", error.message);
}

// Test 6: Try loading bot routes
try {
  const botRoutes = require("./Bot/routes/botRoute");
  app.use("/api/bot", botRoutes);
  console.log("✅ Bot routes loaded successfully");
} catch (error) {
  console.log("❌ Bot routes FAILED:", error.message);
}

// Test 7: Try loading test routes
try {
  const testRoute = require("./Bot/routes/testroute");
  app.use("/api/test", testRoute);
  console.log("✅ Test routes loaded successfully");
} catch (error) {
  console.log("❌ Test routes FAILED:", error.message);
}

// Test 8: Try loading gemini routes
try {
  const geminiRoutes = require("./Bot/routes/gemini");
  app.use("/api/gemini", geminiRoutes);
  console.log("✅ Gemini routes loaded successfully");
} catch (error) {
  console.log("❌ Gemini routes FAILED:", error.message);
}

app.listen(PORT, () => {
  console.log(`\n🎯 Diagnostic server running on http://localhost:${PORT}`);
  console.log("📋 Check which route caused the crash above ^");
});
