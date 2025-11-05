const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    sourceLinks: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contribution", contributionSchema);
