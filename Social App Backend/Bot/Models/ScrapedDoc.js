// ScrapedDoc.js
const mongoose = require("mongoose");

const ScrapedDocSchema = new mongoose.Schema({
  sourceUrl: { type: String, required: true, index: true },
  title: String,
  text: String,
  scrapedAt: { type: Date, default: Date.now },
  meta: mongoose.Schema.Types.Mixed, // store any extra fields: tags, section, etc.
});

// text index for fast full-text search
ScrapedDocSchema.index({ title: "text", text: "text" });

module.exports = mongoose.model("ScrapedDoc", ScrapedDocSchema);
