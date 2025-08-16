const Post = require("../Model/postModel");

exports.createPost = async (req, res) => {
  const { title, body, tags, reactions } = req.body;
  const post = new Post({
    title,
    body,
    tags,
    reactions: 0,
  });
  await post.save();
  res.status(201).json(post);
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
  const { id } = req.params;
  const { title, body, tags } = req.body;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.title = title;
  post.body = body;
  post.tags = tags;

  await post.save();
  res.status(200).json(post);
};
