// llmClient.js
/**
 * Placeholder LLM client. You asked for Gemini specifically.
 * Replace `callGeminiAPI` implementation with the exact Gemini API call.
 *
 * For now this function shows how you'd structure prompts and handle results.
 */

async function callGeminiAPI(systemPrompt, userPrompt) {
  // --- IMPORTANT ---
  // Replace the code below with the real Gemini API request (SDK or HTTP).
  // e.g. fetch('https://api.gemini.google/v1/whatever', {method:'POST', headers:{Authorization:...}, body:...})
  //
  // For now, this is a stub that throws to remind you to add the real call.
  throw new Error(
    "callGeminiAPI is a placeholder — replace with Gemini API implementation."
  );
}

/**
 * High-level helper: create a helpful prompt combining context + user query
 * contextDocs: array of text snippets (from DB)
 */
async function generateAnswerWithLLM(userQuery, contextDocs = []) {
  const systemPrompt = `You are RVU-Bot, an assistant specialized in finding and summarizing college related information (question papers, syllabi, contacts). Answer concisely, cite the source URL when available. If you are unsure, say you are unsure and offer to fetch more pages.`;
  // Build a context block for the LLM (trim if long)
  const context = contextDocs
    .map((d, i) => `Source ${i + 1}: ${d.sourceUrl}\n${d.snippet}`)
    .join("\n\n-----\n\n");
  const userPrompt = `Context:\n${
    context || "No context."
  }\n\nUser question:\n${userQuery}\n\nPlease provide a concise answer and mention which source(s) you used.`;
  // call Gemini (replace with actual call)
  const llmResponse = await callGeminiAPI(systemPrompt, userPrompt);
  return llmResponse; // expected plain text reply
}

module.exports = { generateAnswerWithLLM, callGeminiAPI };
