const axios = require("axios");
const cheerio = require("cheerio");

class ScraperService {
  constructor() {
    this.collegeWebsites = [
      {
        name: "RV University Main Website",
        url: "https://rvu.edu.in",
        type: "college-info",
      },
      {
        name: "RV University Question Papers Portal",
        url: "https://univault-portal.vercel.app",
        type: "question-papers",
      },
    ];
    this.scrapedData = [];
  }

  async scrapeRVUMainWebsite() {
    try {
      console.log("🔍 Scraping RV University main website...");
      const response = await axios.get("https://rvu.edu.in", {
        timeout: 20000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
      });

      const $ = cheerio.load(response.data);

      // Remove unwanted elements more aggressively
      $(
        "script, style, nav, footer, header, iframe, img, svg, meta, link"
      ).remove();

      let content = "RV UNIVERSITY - OFFICIAL WEBSITE INFORMATION\n\n";

      // Extract page title
      const pageTitle = $("title").text() || "RV University";
      content += `PAGE TITLE: ${pageTitle}\n\n`;

      // Extract meta description
      const metaDescription =
        $('meta[name="description"]').attr("content") || "";
      if (metaDescription) {
        content += `DESCRIPTION: ${metaDescription}\n\n`;
      }

      // Extract all meaningful text content
      const textElements = $("body").find(
        "h1, h2, h3, h4, h5, h6, p, li, div, span, a"
      );

      textElements.each((i, elem) => {
        const text = $(elem).text().trim();
        // Only include meaningful text (not too short, not too long, not just numbers)
        if (text.length > 10 && text.length < 500 && !/^\d+$/.test(text)) {
          // Check if it's likely meaningful content (contains words)
          const wordCount = text.split(/\s+/).length;
          if (wordCount > 2) {
            content += `${text}\n`;
          }
        }
      });

      // Limit content length and clean up
      content = content.substring(0, 6000).replace(/\n\s*\n/g, "\n\n");

      console.log("✅ Successfully scraped RV University website");

      return {
        url: "https://rvu.edu.in",
        type: "college-info",
        content: content,
        success: true,
        scrapedAt: new Date(),
        contentLength: content.length,
      };
    } catch (error) {
      console.error("❌ Error scraping RV University website:", error.message);
      return this.getRVUBackupData();
    }
  }

  async scrapeUnivaultPortal() {
    try {
      console.log("🔍 Scraping Univault question papers portal...");
      const response = await axios.get("https://univault-portal.vercel.app", {
        timeout: 20000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        },
      });

      const $ = cheerio.load(response.data);

      // Remove unwanted elements
      $(
        "script, style, nav, footer, header, iframe, img, svg, meta, link"
      ).remove();

      let content = "UNIVAULT - QUESTION PAPERS PORTAL\n\n";

      // Extract all text content
      const bodyText = $("body").text();
      const cleanText = bodyText.replace(/\s+/g, " ").trim().substring(0, 4000);

      content += `PORTAL CONTENT: ${cleanText}\n\n`;

      // Look for specific question paper indicators
      const questionPaperIndicators = [
        "question",
        "paper",
        "exam",
        "subject",
        "semester",
        "course",
        "download",
        "pdf",
        "previous",
        "year",
        "midterm",
        "final",
      ];

      let hasQuestionPaperContent = false;
      questionPaperIndicators.forEach((indicator) => {
        if (cleanText.toLowerCase().includes(indicator)) {
          hasQuestionPaperContent = true;
        }
      });

      if (!hasQuestionPaperContent) {
        content +=
          "Note: This portal appears to be a question paper repository for RV University students.\n";
      }

      console.log("✅ Successfully scraped Univault portal");

      return {
        url: "https://univault-portal.vercel.app",
        type: "question-papers",
        content: content,
        success: true,
        scrapedAt: new Date(),
        contentLength: content.length,
      };
    } catch (error) {
      console.error("❌ Error scraping Univault portal:", error.message);
      return this.getUnivaultBackupData();
    }
  }

  // ... keep the existing backup data methods ...
  getRVUBackupData() {
    console.log("📋 Using backup data for RV University");
    return {
      url: "https://rvu.edu.in",
      type: "college-info",
      content: `RV UNIVERSITY - BENGALURU (Backup Information)
      // ... existing backup content ...
      `,
      success: true,
      isBackupData: true,
      scrapedAt: new Date(),
    };
  }

  getUnivaultBackupData() {
    console.log("📋 Using backup data for Univault portal");
    return {
      url: "https://univault-portal.vercel.app",
      type: "question-papers",
      content: `UNIVAULT - QUESTION PAPERS PORTAL (Backup Information)
      // ... existing backup content ...
      `,
      success: true,
      isBackupData: true,
      scrapedAt: new Date(),
    };
  }

  async scrapeAllWebsites() {
    console.log("🚀 Starting to scrape both college websites...");

    const scrapedData = [];

    try {
      // Scrape RV University main website
      const rvuData = await this.scrapeRVUMainWebsite();
      scrapedData.push(rvuData);

      // Wait 2 seconds before next request to be respectful
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Scrape Univault portal
      const univaultData = await this.scrapeUnivaultPortal();
      scrapedData.push(univaultData);

      console.log("✅ Successfully scraped both websites");
      return scrapedData;
    } catch (error) {
      console.error("❌ Error in scrapeAllWebsites:", error);
      // Return backup data if scraping fails
      return [this.getRVUBackupData(), this.getUnivaultBackupData()];
    }
  }

  async getScrapedData(forceRefresh = false) {
    if (forceRefresh || !this.scrapedData || this.scrapedData.length === 0) {
      this.scrapedData = await this.scrapeAllWebsites();
    }
    return this.scrapedData;
  }
}

module.exports = new ScraperService();
