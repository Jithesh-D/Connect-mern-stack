// botController.js
const { scrapeAndSave, batchScrape } = require("../services/scraperService");
const { searchLocalIndex } = require("../services/indexService");
const { generateAnswerWithLLM } = require("../Utils/llmClient");

async function health(req, res) {
  return res.json({ ok: true, service: "rvu-bot" });
}

/**
 * POST /api/bot/scrape
 * Body: { urls: [ ... ] }
 * Manual trigger to scrape important pages (admin-only ideally)
 */
async function scrape(req, res) {
  const urls = Array.isArray(req.body.urls) ? req.body.urls : [];
  try {
    const results = await batchScrape(urls);
    return res.json({ ok: true, results });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

/**
 * POST /api/bot/query
 * Body: { question: "..." }
 * Searches local DB; if insufficient results, calls LLM (Gemini)
 */
async function query(req, res) {
  const question = req.body.question;
  if (!question || question.trim().length === 0)
    return res.status(400).json({ error: "question required" });

  try {
    // 1) search local index
    const hits = await searchLocalIndex(question, 5);
    // 2) if good hits, we still pass them as context to the LLM for a concise answer
    const answer = await generateAnswerWithLLM(question, hits);
    return res.json({ ok: true, answer, hits });
  } catch (err) {
    console.error("RVU-Bot query error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { health, scrape, query };
