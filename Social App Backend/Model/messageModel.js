const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    gangId: { type: String, required: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
