const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: String,
            required: true },
  title: { type: String,
            required: true },
  body: { type: String,
            required: true },
  tags: { type: [String],
            required: true },
  reactions: { type: Number,
             required: true },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
