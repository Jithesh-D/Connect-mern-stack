require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
let io; // will be initialized after DB connects
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Use environment variables
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-media";
const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || "CampusConnect";
console.log("🔑 Session config:", {
  secure: true,
  sameSite: "none",
  domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined
});

// Configure MongoDB session store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  connectionOptions: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
});

// Handle store errors
store.on("error", function (error) {
  console.error("Session store error:", error);
});

// Create uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

// ==================== MIDDLEWARE SETUP ====================

app.use(
  cors({
    origin: "https://rvu-connects.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(uploadsDir));

// Session middleware (CRITICAL FOR AUTH)
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: true, // HTTPS required
      sameSite: "none", // Cross-domain cookies
      httpOnly: true,
    },
  })
);

// ==================== HEALTH ENDPOINT ====================

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server running!",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    session: req.sessionID ? "Active" : "No session",
    timestamp: new Date().toISOString(),
  });
});

// ==================== LOAD ROUTES ====================

console.log("🔍 Loading routes...");

// Load authentication routes FIRST (important for session)
try {
  const authRouter = require("./Routes/authRoute");
  app.use("/api/auth", authRouter);
  console.log("✅ Auth routes loaded");
} catch (error) {
  console.log("❌ Auth routes failed:", error.message);
}

// Load other routes
try {
  const postRouter = require("./Routes/postsRoute");
  app.use("/api/posts", postRouter);
  console.log("✅ Posts routes loaded");
} catch (error) {
  console.log("❌ Posts routes failed:", error.message);
}

try {
  const eventRouter = require("./Routes/eventRoute");
  app.use("/api/events", eventRouter);
  console.log("✅ Events routes loaded");
} catch (error) {
  console.log("❌ Events routes failed:", error.message);
}

try {
  const eventAuthRouter = require("./Routes/eventAuthRoute");
  app.use("/api/event-auth", eventAuthRouter);
  console.log("✅ Event auth routes loaded");
} catch (error) {
  console.log("❌ Event auth routes failed:", error.message);
}

try {
  const commentRouter = require("./Routes/commentRoute");
  app.use("/api/comments", commentRouter);
  console.log("✅ Comments routes loaded");
} catch (error) {
  console.log("❌ Comments routes failed:", error.message);
}

try {
  const botRoute = require("./Bot/routes/botRoute");
  app.use("/api/bot", botRoute);
  console.log("✅ Bot routes loaded");
} catch (error) {
  console.log("❌ Bot routes failed:", error.message);
}

try {
  const testRoute = require("./Bot/routes/testroute");
  app.use("/api/test", testRoute);
  console.log("✅ Test routes loaded");
} catch (error) {
  console.log("❌ Test routes failed:", error.message);
}

try {
  const geminiRoutes = require("./Bot/routes/gemini");
  app.use("/api/gemini", geminiRoutes);
  console.log("✅ Gemini routes loaded");
} catch (error) {
  console.log("❌ Gemini routes failed:", error.message);
}

// Mount newly added gang/posts/messages routes
try {
  const gangsRoute = require("./Routes/gangsRoute");
  app.use("/api/gangs", gangsRoute);
  console.log("✅ Gangs routes loaded");
} catch (err) {
  console.log("❌ Gangs routes failed:", err.message);
}

try {
  const gangPosts = require("./Routes/gangPostsRoute");
  app.use("/api/posts", gangPosts);
  console.log("✅ Gang posts routes loaded");
} catch (err) {
  console.log("❌ Gang posts routes failed:", err.message);
}

try {
  const contribution = require("./Routes/collabRoutes");
  app.use("/api/contributions", contribution);
  console.log("✅ Contributions routes loaded");
} catch (err) {
  console.log("❌ Contributions routes failed:", err.message);
}

try {
  const messagesRoute = require("./Routes/messagesRoute");
  app.use("/api/messages", messagesRoute);
  console.log("✅ Messages routes loaded");
} catch (err) {
  console.log("❌ Messages routes failed:", err.message);
}

// ==================== TEST AUTH ENDPOINTS ====================

// Test session endpoint
app.get("/api/test-session", (req, res) => {
  console.log("🔍 Session Debug:", {
    sessionId: req.sessionID,
    hasUser: !!req.session.user,
    cookies: req.headers.cookie,
  });
  res.json({
    sessionId: req.sessionID,
    sessionData: req.session,
    cookies: req.headers.cookie,
  });
});

// Test signup endpoint
app.post("/api/test-signup", (req, res) => {
  const { email, password, name } = req.body;

  // Simple validation
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: "Email, password, and name are required",
    });
  }

  res.json({
    success: true,
    message: "Signup test successful",
    user: { email, name },
    sessionId: req.sessionID,
  });
});

// ==================== ROOT ENDPOINT ====================

app.get("/", (req, res) => {
  res.json({
    message: "Social Media API Server",
    endpoints: {
      health: "GET /api/health",
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
      },
      posts: "GET /api/posts",
      events: "GET /api/events",
      comments: "GET /api/comments",
      bot: "POST /api/bot/ask",
    },
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    availableEndpoints: [
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/posts",
      "POST /api/bot/ask",
      "GET /api/health",
    ],
  });
});

// Basic error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected to MongoDB");

    // initialize socket.io server
    const { Server } = require("socket.io");
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("joinGang", (gangId) => {
        socket.join(gangId);
      });

      socket.on("leaveGang", (gangId) => {
        socket.leave(gangId);
      });

      socket.on("newMessage", (msg) => {
        if (msg && msg.gangId) {
          io.to(msg.gangId).emit("message", msg);
        }
      });

      socket.on("newPost", (post) => {
        if (post && post.gangId) {
          io.to(post.gangId).emit("post", post);
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`\n🚀 SERVER RUNNING ON http://localhost:${PORT}`);
      console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth: POST http://localhost:${PORT}/api/auth/signup`);
      console.log(`🤖 Chatbot: POST http://localhost:${PORT}/api/bot/ask`);
      console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
      console.log(`\n🎯 All routes loaded successfully!`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// MongoDB event handlers
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("📤 MongoDB disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
});

// Start the server
startServer();

// Export the express app for testing
module.exports = { app, server, getIo: () => io };
