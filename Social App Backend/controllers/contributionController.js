const Contribution = require("../Model/Contribution");
const Interest = require("../Model/Interest");

const addContribution = async (req, res) => {
  try {
    const { projectName, description, sourceLinks, phone, email } = req.body;

    if (!projectName || !description || !phone || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newContribution = new Contribution({
      projectName,
      description,
      sourceLinks,
      phone,
      email,
    });

    const saved = await newContribution.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find().sort({ createdAt: -1 });
    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, projectName, description, sourceLinks, phone } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required for authorization" });
    }

    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found" });
    }

    if (contribution.email !== email) {
      return res.status(403).json({ error: "Unauthorized: Email does not match" });
    }

    const updated = await Contribution.findByIdAndUpdate(
      id,
      { projectName, description, sourceLinks, phone },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required for authorization" });
    }

    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found" });
    }

    if (contribution.email !== email) {
      return res.status(403).json({ error: "Unauthorized: Email does not match" });
    }

    await Contribution.findByIdAndDelete(id);
    res.json({ message: "Contribution deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const expressInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;
    
    console.log("User from session:", req.user);
    console.log("UserId:", userId, "UserEmail:", userEmail);
    
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in session" });
    }
    
    // Check if contribution exists
    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found" });
    }
    
    // Check if user already expressed interest
    const existingInterest = await Interest.findOne({ contributionId: id, userId });
    if (existingInterest) {
      return res.status(400).json({ error: "Already expressed interest" });
    }
    
    // Create new interest
    const interest = new Interest({
      contributionId: id,
      userId,
      userEmail,
    });
    
    await interest.save();
    res.status(201).json({ message: "Interest expressed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInterests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in session" });
    }
    
    // Get user's interests
    const userInterests = await Interest.find({ userId }).select("contributionId");
    const userInterestIds = userInterests.map(interest => interest.contributionId.toString());
    
    // Get interest counts for all contributions
    const interestCounts = await Interest.aggregate([
      { $group: { _id: "$contributionId", count: { $sum: 1 } } }
    ]);
    
    const counts = {};
    interestCounts.forEach(item => {
      counts[item._id.toString()] = item.count;
    });
    
    res.json({ userInterests: userInterestIds, counts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addContribution, getContributions, updateContribution, deleteContribution, expressInterest, getInterests };
