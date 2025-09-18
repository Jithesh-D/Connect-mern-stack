const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/api/gemini", async (req, res) => {
  try {
    const { htmlContent, userQuery, apiKey, model } = req.body;

    if (!apiKey || !model) {
      return res.status(400).json({ error: "Missing Gemini API key or model" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `User Query: ${userQuery}\n\nData: ${htmlContent}` },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      summarizedText:
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary returned",
    });
  } catch (error) {
    console.error("Gemini route error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
