// Run this script with: node scripts/backfillAuthors.js
// It will try to backfill posts that lack an author using post.authorName

const mongoose = require("mongoose");
const Post = require("../Model/postModel");
const User = require("../Model/userModel");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-media";

async function backfill() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const posts = await Post.find({
      $or: [{ author: { $exists: false } }, { author: null }],
    });
    console.log(`Found ${posts.length} posts without author`);

    for (const post of posts) {
      if (post.authorName) {
        // Try to find user by exact username
        let user = await User.findOne({ username: post.authorName });
        if (!user) {
          // Try by email local part (before @)
          const local = post.authorName.split("@")[0];
          user = await User.findOne({
            email: new RegExp(`^${local}(@|$)`, "i"),
          });
        }

        if (user) {
          post.author = user._id;
          await post.save();
          console.log(`Assigned author ${user.username} to post ${post._id}`);
        } else {
          console.log(
            `No matching user for post ${post._id} (authorName=${post.authorName})`
          );
        }
      } else {
        console.log(`Post ${post._id} has no authorName to match`);
      }
    }

    console.log("Backfill complete");
    process.exit(0);
  } catch (err) {
    console.error("Backfill error", err);
    process.exit(1);
  }
}

backfill();
