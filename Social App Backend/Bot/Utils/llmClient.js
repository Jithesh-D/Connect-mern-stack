const { GoogleGenerativeAI } = require("@google/generative-ai");

class LLMClient {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", // Using the latest flash model
      generationConfig: {
        temperature: 0.2, // Lower temperature for more factual responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048, // Increased for more detailed responses
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });
  }

  async generateResponse(userQuery, relevantContent) {
    try {
      const prompt = this.buildPrompt(userQuery, relevantContent);

      console.log("Sending request to Gemini API...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      console.log("Successfully received response from Gemini");
      return response.text();
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      // Provide fallback response if API fails
      if (relevantContent.length > 0) {
        return this.generateFallbackResponse(userQuery, relevantContent);
      }

      throw new Error("Failed to generate response from AI service");
    }
  }

  buildPrompt(userQuery, relevantContent) {
    let context = "LIVE SCRAPED INFORMATION FROM RV UNIVERSITY WEBSITES:\n\n";

    relevantContent.forEach((content, index) => {
      context += `=== SOURCE ${index + 1}: ${content.source} ===\n`;
      if (content.isBackupData) {
        context += `NOTE: This is backup data (website might be temporarily unavailable)\n`;
      }
      context += `URL: ${content.url}\n`;
      context += `CONTENT:\n${content.content}\n\n`;
      context += "---\n\n";
    });

    return `You are an expert RV University assistant. Your role is to provide accurate, helpful information about RV University based ONLY on the scraped content provided.

CRITICAL INSTRUCTIONS:
1. Answer the user's question using ONLY the information from the scraped content above
2. Be concise, professional, and factual
3. If information comes from question papers, mention "According to the question papers portal..."
4. If information comes from the main website, mention "According to RV University's website..."
5. If the scraped content doesn't contain the answer, say: "I couldn't find specific information about this in the current RV University resources. Please visit https://rvu.edu.in for the most up-to-date information."
6. NEVER make up or assume information not present in the scraped content
7. Keep responses focused and under 300 words
8. If multiple sources have relevant information, synthesize them clearly

USER'S QUESTION: "${userQuery}"

SCRAPED CONTEXT:
${context}

YOUR RESPONSE (based only on the scraped content above):`;
  }

  generateFallbackResponse(userQuery, relevantContent) {
    // Simple keyword-based fallback when API fails
    const query = userQuery.toLowerCase();

    if (query.includes("course") || query.includes("program")) {
      return "Based on RV University information, the university offers programs in Computer Science, Business Administration, Law, and Liberal Arts. For detailed course information, please visit https://rvu.edu.in";
    } else if (
      query.includes("question") ||
      query.includes("paper") ||
      query.includes("exam")
    ) {
      return "Question papers are available through the Univault portal. You can find previous year papers for various semesters and subjects there.";
    } else if (
      query.includes("contact") ||
      query.includes("address") ||
      query.includes("email")
    ) {
      return "RV University is located at #5, 8th Mile, Mysore Road, Bengaluru - 560059. Contact: +91-80-6819-9100, admissions@rvu.edu.in";
    } else if (query.includes("placement") || query.includes("job")) {
      return "RV University has a dedicated placement cell with connections to various companies. For current placement statistics and opportunities, please check the official website.";
    } else {
      return "I apologize, but I'm currently having trouble accessing the detailed information. Please visit https://rvu.edu.in for the most accurate and up-to-date information about RV University.";
    }
  }
}

module.exports = new LLMClient();
