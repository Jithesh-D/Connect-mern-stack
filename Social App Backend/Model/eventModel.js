const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    registrationLink: String,
    whatsappLink: String,
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
