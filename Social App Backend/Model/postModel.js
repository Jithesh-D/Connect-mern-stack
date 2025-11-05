const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: [String], required: true },
    category: { type: String, enum: ["general", "clubs"], default: "general" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    reactions: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
