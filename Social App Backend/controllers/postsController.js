const Post = require("../Model/postModel");

exports.createPost = async (req, res) => {
  const { title, body, tags, reactions } = req.body;
  const post = new Post({
    title,
    body,
    tags,
    reactions,
  });
  await post.save();
  res.status(201).json(post);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.status(204).send();
};
