const router = require("express").Router();


const {generateTravelPlan} = require("../services/geminiService");

router.get("/test-gemini", async (req, res) => {
  try {
    const result = await generateTravelPlan({
      destination: "Tokyo",
      durationDays: 3,
      budgetTier: "Medium",
      interests: ["Food", "Culture"],
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;