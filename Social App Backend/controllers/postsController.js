const Post = require("../Model/postModel");

exports.createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    let image = null;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const post = new Post({
      title,
      body,
      tags: tags || [],
      reactions: 0,
      image,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

exports.reactionCounter = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.reactions += 1;
  await post.save();
  res.status(200).json({ reactions: post.reactions });
};

exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    let tags = [];

    // Parse tags if they exist
    if (req.body.tags) {
      try {
        // Handle both array format and JSON string format
        tags = Array.isArray(req.body["tags[]"])
          ? req.body["tags[]"]
          : JSON.parse(req.body.tags);
      } catch (e) {
        console.error("Error parsing tags:", e);
      }
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update post fields
    post.title = title;
    post.body = body;
    post.tags = tags;

    // Handle image update if there's a new image
    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
};
