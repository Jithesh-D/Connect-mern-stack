const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    contributionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contribution",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure one user can only express interest once per contribution
interestSchema.index({ contributionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Interest", interestSchema);