const mongoose = require("mongoose");

const gangSchema = new mongoose.Schema(
  {
    gangId: { type: String, required: true, unique: true },
    gangName: { type: String, required: true },
    description: { type: String, default: "" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gang", gangSchema);
