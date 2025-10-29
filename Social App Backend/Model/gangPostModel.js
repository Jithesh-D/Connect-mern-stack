const mongoose = require("mongoose");

const gangPostSchema = new mongoose.Schema(
  {
    gangId: { type: String, required: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, default: "" },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GangPost", gangPostSchema);
