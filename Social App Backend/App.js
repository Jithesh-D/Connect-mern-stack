const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRouter = require("./Routes/postsRoute");
const authRouter = require("./Routes/authRoute");
const eventRouter = require("./Routes/eventRoute");
const errorController = require("./controllers/errorController");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");

const mongo_path =
  "mongodb+srv://root:root@myproject.pmimgo1.mongodb.net/SocialApp?retryWrites=true&w=majority&appName=Myproject";

const store = new MongoDBStore({
  uri: mongo_path,
  collection: "sessions",
});

const PORT = 3001;

app.use(
  session({
    secret: "CampusConnect",
    resave: false,
    saveUninitialized: true,
    store: store,
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
app.use(errorController.handleError);

mongoose
  .connect(mongo_path)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
