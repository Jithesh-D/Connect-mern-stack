import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
