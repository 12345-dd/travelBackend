const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

const generateTravelPlan = async ({
  destination,
  durationDays,
  budgetTier,
  interests,
}) => {
  try {
    const prompt = `
You are an expert travel planner.

Generate a ${durationDays} day travel itinerary for ${destination}.

Budget Tier: ${budgetTier}

Interests:
${interests.join(", ")}

Return ONLY valid JSON.

Required JSON Structure:

{
  "itinerary": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "title": "",
          "description": "",
          "estimatedCostUSD": 0,
          "timeOfDay": "Morning"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "",
      "tier": "",
      "estimatedCostNightUSD": 0,
      "rating": ""
    }
  ],
  "estimatedBudget": {
    "transport": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "total": 0
  },
  "packingList": [
    {
      "item": "",
      "category": "",
      "isPacked": false
    }
  ]
}

Rules:

1. Create itinerary for all ${durationDays} days.
2. Suggest 3 hotels:
   - Budget
   - Mid Range
   - Luxury
3. Include realistic ratings.
4. Include realistic travel budget.
5. Generate packing list according to destination and activities.
6. Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text.trim();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate travel plan");
  }
};

const regenerateDayPlan = async ({
  destination,
  dayNumber,
  durationDays,
  budgetTier,
  interests,
  userPrompt,
}) => {
  try {
    const prompt = `
You are an expert travel planner.

Destination: ${destination}

Trip Duration: ${durationDays} days

Budget Tier: ${budgetTier}

Interests:
${interests.join(", ")}

Regenerate only Day ${dayNumber}.

Additional User Request:
${userPrompt}

Return ONLY JSON.

{
  "dayNumber": ${dayNumber},
  "activities": [
    {
      "title": "",
      "description": "",
      "estimatedCostUSD": 0,
      "timeOfDay": "Morning"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text.trim();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Day Regeneration Error:", error);
    throw new Error("Failed to regenerate day");
  }
};

module.exports = {
  generateTravelPlan,
  regenerateDayPlan
};