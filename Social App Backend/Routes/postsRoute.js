const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postsController");
const upload = require("../Middleware/upload");
const authMiddleware = require("../Middleware/auth");

postRouter.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);
postRouter.get("/", postController.getPosts);
postRouter.delete("/:id", authMiddleware, postController.deletePost);
postRouter.patch(
  "/:id/reaction",
  authMiddleware,
  postController.reactionCounter
);
postRouter.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  postController.editPost
);

module.exports = postRouter;
