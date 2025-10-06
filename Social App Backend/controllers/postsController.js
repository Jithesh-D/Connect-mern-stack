const Post = require("../Model/postModel");
const { checkToxicity } = require("../utils/toxicityChecker");

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

    // Check toxicity in both title and body
    try {
      const [titleToxicity, bodyToxicity] = await Promise.all([
        checkToxicity(title),
        checkToxicity(body),
      ]);

      if (titleToxicity > 0.7 || bodyToxicity > 0.7) {
        return res.status(400).json({
          message: "Post contains toxic content",
          titleToxicity,
          bodyToxicity,
        });
      }
    } catch (toxicityError) {
      console.error("Error checking toxicity:", toxicityError);
      return res.status(500).json({
        message: "Error checking content toxicity",
        error: toxicityError.message,
      });
    }

    const post = new Post({
      title,
      body,
      tags: tags || [],
      reactions: 0,
      image,
      author: req.session?.user?.id || undefined,
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
  // Populate author username and profileImage when returning posts
  const posts = await Post.find().populate("author", "username profileImage");
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
  const userId = req.user._id; // Assuming user info is attached by auth middleware

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userHasLiked = post.likedBy.includes(userId);

  if (userHasLiked) {
    // Unlike: Remove user from likedBy and decrease reactions
    post.likedBy = post.likedBy.filter((id) => !id.equals(userId));
    post.reactions -= 1;
  } else {
    // Like: Add user to likedBy and increase reactions
    post.likedBy.push(userId);
    post.reactions += 1;
  }

  await post.save();
  res.status(200).json({
    reactions: post.reactions,
    hasLiked: !userHasLiked,
  });
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

// Assign an author to a post (admin or authorized user can call this)
exports.assignAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.author = userId;
    await post.save();

    await post.populate("author", "username profileImage");

    res.status(200).json(post);
  } catch (error) {
    console.error("Error assigning author:", error);
    res
      .status(500)
      .json({ message: "Error assigning author", error: error.message });
  }
};
