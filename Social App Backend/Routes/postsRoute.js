const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postsController");

postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getPosts);
postRouter.delete("/:id", postController.deletePost);
postRouter.patch("/:id/reaction", postController.reactionCounter);
postRouter.patch("/:id", postController.editPost);

module.exports = postRouter;
