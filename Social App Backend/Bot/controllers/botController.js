const indexService = require("../services/indexService");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("Processing query:", message);

    const response = await indexService.processUserQuery(message);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const getScrapingStatus = async (req, res) => {
  try {
    const status = indexService.getScrapingStatus();
    res.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error("Error getting scraping status:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const refreshData = async (req, res) => {
  try {
    await indexService.refreshData();
    res.json({
      success: true,
      message: "Data refreshed successfully",
    });
  } catch (error) {
    console.error("Error refreshing data:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  handleChat,
  getScrapingStatus,
  refreshData,
};
