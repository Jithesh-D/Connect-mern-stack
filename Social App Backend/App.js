const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRouter = require("./Routes/postsRoute");
const errorController = require("./controllers/errorController");
const cors = require("cors");

const PORT = 3001;

const mongo_path =
  "mongodb+srv://root:root@myproject.pmimgo1.mongodb.net/SocialApp?retryWrites=true&w=majority&appName=Myproject";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/posts", postRouter);
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
