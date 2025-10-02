require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRouter = require("./Routes/postsRoute");
const authRouter = require("./Routes/authRoute");
const eventRouter = require("./Routes/eventRoute");
const commentRouter = require("./Routes/commentRoute"); // ADD THIS LINE
const errorController = require("./controllers/errorController");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
// const fetchRoutes = require("./Routes/chatroute");
const geminiRoutes = require("./Routes/gemini");

// Use environment variables for sensitive data
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-media";
const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || "CampusConnect";

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

// Configure session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Changed to false for better security
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      sameSite: "lax",
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/comments", commentRouter); // ADD THIS LINE

// app.use("/", fetchRoutes);
app.use("/", geminiRoutes);
app.use(errorController.handleError);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log("Connected to MongoDB Atlas");

    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if cannot connect to database
  }
}

// Handle MongoDB connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Handle application shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB connection closure:", err);
    process.exit(1);
  }
});

// Initialize connection
connectToMongoDB();
