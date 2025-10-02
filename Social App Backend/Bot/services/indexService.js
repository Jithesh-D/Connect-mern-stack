// indexService.js
const ScrapedDoc = require("../Models/ScrapedDoc");

/**
 * Search local index with text search
 * query: user input string
 * returns top N documents with snippet
 */
async function searchLocalIndex(query, limit = 5) {
  if (!query || query.trim().length === 0) return [];
  // use Mongo text search
  const docs = await ScrapedDoc.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .lean();
  return docs.map((d) => ({
    id: d._id,
    sourceUrl: d.sourceUrl,
    title: d.title,
    snippet: (d.text || "").slice(0, 800),
  }));
}

module.exports = { searchLocalIndex };
