const express = require("express");
const {
  addContribution,
  getContributions,
  updateContribution,
  deleteContribution,
  expressInterest,
  getInterests,
} = require("../controllers/contributionController");
const authMiddleware = require("../Middleware/auth");

const router = express.Router();

router.post("/", addContribution);
router.get("/", getContributions);
router.put("/:id", updateContribution);
router.delete("/:id", deleteContribution);
router.post("/:id/interest", authMiddleware, expressInterest);
router.get("/interests", authMiddleware, getInterests);

module.exports = router;
