exports.createPost = async (req, res) => {
  const { userId, title, body, tags, reactions } = req.body;
  const post = new Post({
    userId,
    title,
    body,
    tags,
    reactions,
  });
  await post.save();
  res.status(201).json(post);
};
