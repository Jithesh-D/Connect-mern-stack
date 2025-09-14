const fetch = require("node-fetch");
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

/**
 * Checks text for toxicity using Google Perspective API
 * @param {string} text - The text to check for toxicity
 * @returns {Promise<number>} - Toxicity score between 0 and 1
 */
async function checkToxicity(text) {
  try {
    // Skip empty text
    if (!text || !text.trim()) {
      return 0;
    }

    // Create a new GoogleAuth instance with the service account credentials
    const auth = new GoogleAuth({
      keyFile: path.join(__dirname, '..', 'comments.json'),
      scopes: ['https://www.googleapis.com/auth/userinfo.email']
    });

    // Get the access token
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const response = await fetch(
      'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.token}`
        },
        body: JSON.stringify({
          comment: { text },
          languages: ["en"],
          requestedAttributes: { TOXICITY: {} },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // log actual error message returned by Google
      throw new Error(
        `Perspective API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(data)}`
      );
    }

    return data.attributeScores.TOXICITY.summaryScore.value;
  } catch (error) {
    console.error("Error checking toxicity:", error);
    throw error;
  }
}

/**
 * Checks multiple text fields for toxicity
 * @param {Object} fields - Object containing text fields to check
 * @returns {Promise<Object>} - Object with toxicity scores for each field
 */
async function checkMultipleTexts(fields) {
  try {
    const results = await Promise.all(
      Object.entries(fields).map(async ([key, text]) => {
        const score = await checkToxicity(text);
        return [key, score];
      })
    );

    return Object.fromEntries(results);
  } catch (error) {
    console.error("Error checking multiple texts for toxicity:", error);
    throw error;
  }
}

module.exports = { checkToxicity, checkMultipleTexts };
