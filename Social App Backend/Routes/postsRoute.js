const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postsController");

postRouter.post("/", postController.createPost);
postRouter.post("/", postController.getPosts);
postRouter.post("/:id", postController.deletePost);
module.exports = postRouter;

