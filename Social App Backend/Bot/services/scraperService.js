// scraperService.js
const axios = require("axios");
const cheerio = require("cheerio");
const ScrapedDoc = require("../Models/ScrapedDoc");

async function fetchHtml(url) {
  const resp = await axios.get(url, {
    // set user-agent, timeout and optional proxy if needed
    headers: { "User-Agent": "RVU-Bot-Scraper/1.0 (+your-email@example.com)" },
    timeout: 15000,
  });
  return resp.data;
}

/**
 * Minimal HTML -> text extractor. Tweak selectors for target sites.
 */
function htmlToPlainText(html) {
  const $ = cheerio.load(html);
  // remove scripts/styles
  $("script, style, noscript, iframe, nav").remove();
  // extract heading + paragraphs
  const title =
    $("head > title").text().trim() || $("h1").first().text().trim();
  let text = "";
  $("h1, h2, h3, p, li, td").each((i, el) => {
    const s = $(el).text().replace(/\s+/g, " ").trim();
    if (s && s.length > 20) text += s + "\n";
  });
  // fallback: body text
  if (!text) text = $("body").text().replace(/\s+/g, " ").trim();
  return { title, text: text.slice(0, 50000) }; // limit size
}

/**
 * Scrape a URL, save (upsert) into DB by sourceUrl
 * Returns the DB doc
 */
async function scrapeAndSave(url) {
  const html = await fetchHtml(url);
  const { title, text } = htmlToPlainText(html);
  const doc = await ScrapedDoc.findOneAndUpdate(
    { sourceUrl: url },
    { $set: { title, text, scrapedAt: new Date() } },
    { upsert: true, new: true }
  );
  return doc;
}

/**
 * Example: batch scrape an array of URLs
 */
async function batchScrape(urls = []) {
  const results = [];
  for (const url of urls) {
    try {
      const res = await scrapeAndSave(url);
      results.push({ url, ok: true, id: res._id });
    } catch (err) {
      results.push({ url, ok: false, error: err.message });
    }
  }
  return results;
}

module.exports = { scrapeAndSave, batchScrape };
