const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postsController");

postRouter.post("/", postController.createPost);
module.exports = postRouter;
