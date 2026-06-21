const router = require("express").Router();

const tripController = require("../controllers/tripController")

const authMiddleware = require("../middleware/authMiddleware")

router.post("/trips", authMiddleware, tripController.createTrip);

router.get("/trips", authMiddleware, tripController.getTrips);

router.get("/trips/:id", authMiddleware, tripController.getTripById);

router.put("/trips/:id", authMiddleware, tripController.updateTrip);

router.delete("/trips/:id", authMiddleware, tripController.deleteTrip);

router.post(
  "/trips/:id/activity",
  authMiddleware,
  tripController.addActivity
);

router.delete(
  "/trips/:id/activity",
  authMiddleware,
  tripController.removeActivity
);

router.post(
  "/trips/:id/regenerate-day",
  authMiddleware,
  tripController.regenerateDay
);


// const {generateTravelPlan} = require("../services/geminiService");

// router.get("/test-gemini", async (req, res) => {
//   try {
//     const result = await generateTravelPlan({
//       destination: "Tokyo",
//       durationDays: 3,
//       budgetTier: "Medium",
//       interests: ["Food", "Culture"],
//     });

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

module.exports = router;