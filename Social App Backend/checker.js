import { checkToxicity } from "./utils/toxicityChecker.js";

async function runTests() {
  try {
    const cleanText = "I hope you have a wonderful day!";
    const toxicText = "You are such an idiot and a loser.";

    const cleanScore = await checkToxicity(cleanText);
    const toxicScore = await checkToxicity(toxicText);

    console.log("Clean Text:", cleanText, "→ Toxicity Score:", cleanScore);
    console.log("Toxic Text:", toxicText, "→ Toxicity Score:", toxicScore);
  } catch (err) {
    console.error("Error checking toxicity:", err);
  }
}

runTests();
