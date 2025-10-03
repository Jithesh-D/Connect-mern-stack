const scraperService = require("./scraperService");
const llmClient = require("../utils/llmClient");

class IndexService {
  constructor() {
    this.scrapedData = [];
    this.lastScrapeTime = null;
    this.scrapeInterval = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  async ensureScrapedData(forceRefresh = false) {
    const now = Date.now();

    if (
      forceRefresh ||
      !this.lastScrapeTime ||
      now - this.lastScrapeTime > this.scrapeInterval ||
      this.scrapedData.length === 0
    ) {
      console.log("Fetching fresh data from websites...");
      this.scrapedData = await scraperService.getScrapedData(forceRefresh);
      this.lastScrapeTime = now;
    }
  }

  async processUserQuery(userQuery) {
    try {
      await this.ensureScrapedData();

      const relevantContent = this.extractRelevantContent(userQuery);

      if (relevantContent.length === 0) {
        return "I apologize, but I couldn't find relevant information about your query in the RV University resources. Please try rephrasing your question or contact the university administration for more specific information.";
      }

      const response = await llmClient.generateResponse(
        userQuery,
        relevantContent
      );
      return response;
    } catch (error) {
      console.error("Error processing user query:", error);
      return "I'm experiencing technical difficulties while processing your request. Please try again in a few moments.";
    }
  }

  extractRelevantContent(query) {
    const queryLower = query.toLowerCase();
    const relevant = [];

    this.scrapedData.forEach((data) => {
      const contentLower = data.content.toLowerCase();
      const relevanceScore = this.calculateRelevance(queryLower, contentLower);

      if (relevanceScore > 0) {
        relevant.push({
          source:
            data.type === "question-papers"
              ? "Univault Question Papers Portal"
              : "RV University Website",
          content: data.content.substring(0, 3000), // Limit content for API
          url: data.url,
          relevance: relevanceScore,
          isBackupData: data.isBackupData || false,
        });
      }
    });

    // Sort by relevance score
    return relevant.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }

  calculateRelevance(query, content) {
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);
    let score = 0;

    // Define keyword categories with weights
    const keywordWeights = {
      // Course-related
      course: 3,
      program: 3,
      degree: 2,
      "b.tech": 4,
      bba: 4,
      llb: 4,
      mba: 4,
      computer: 3,
      engineering: 3,
      business: 3,
      law: 3,
      science: 2,

      // Question paper related
      question: 4,
      paper: 4,
      exam: 3,
      previous: 3,
      year: 2,
      semester: 3,
      subject: 3,
      midterm: 3,
      final: 2,
      assessment: 2,

      // University info
      admission: 3,
      fee: 2,
      scholarship: 3,
      faculty: 3,
      professor: 2,
      campus: 2,
      hostel: 2,
      library: 2,
      placement: 4,
      recruitment: 3,

      // Contact info
      contact: 2,
      email: 2,
      phone: 2,
      address: 2,
      location: 2,
    };

    queryWords.forEach((word) => {
      if (content.includes(word)) {
        score += keywordWeights[word] || 1;
      }

      // Bonus for exact matches in important contexts
      if (word.length > 4) {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = content.match(regex);
        if (matches) {
          score += matches.length * 0.5;
        }
      }
    });

    return score;
  }

  // Method to force refresh the scraped data
  async refreshData() {
    await this.ensureScrapedData(true);
    return this.scrapedData;
  }

  // Get scraping status
  getScrapingStatus() {
    return {
      lastScraped: this.lastScrapeTime,
      dataSources: this.scrapedData.map((data) => ({
        source:
          data.type === "question-papers" ? "Univault Portal" : "RV University",
        url: data.url,
        isBackupData: data.isBackupData || false,
        contentLength: data.content.length,
      })),
    };
  }
}

module.exports = new IndexService();
