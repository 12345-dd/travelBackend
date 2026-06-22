const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const generateWithRetry = async (
  prompt,
  retries = 3
) => {
  for (
    let attempt = 1;
    attempt <= retries;
    attempt++
  ) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
    } catch (error) {
      console.log(
        `Gemini Attempt ${attempt} Failed`
      );

      if (
        error.status === 503 &&
        attempt < retries
      ) {
        await sleep(3000);
        continue;
      }

      throw error;
    }
  }
};

const parseGeminiResponse = (
  response
) => {
  const text = response.text.trim();

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.log(
      "Invalid JSON Returned By Gemini:"
    );
    console.log(cleanedText);

    throw new Error(
      "AI returned invalid JSON"
    );
  }
};

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

    const response =
      await generateWithRetry(
        prompt
      );

    return parseGeminiResponse(
      response
    );
  } catch (error) {
    console.error(
      "Gemini Generation Error:",
      error
    );

    if (error.status === 429) {
      throw new Error(
        "AI quota exceeded. Please try again later."
      );
    }

    if (error.status === 503) {
      throw new Error(
        "AI service is currently busy. Please try again in a few minutes."
      );
    }

    throw new Error(
      error.message ||
        "Failed to generate travel plan"
    );
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
${userPrompt || "Generate alternative activities"}

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

    const response =
      await generateWithRetry(
        prompt
      );

    return parseGeminiResponse(
      response
    );
  } catch (error) {
    console.error(
      "Day Regeneration Error:",
      error
    );

    if (error.status === 429) {
      throw new Error(
        "AI quota exceeded. Please try again later."
      );
    }

    if (error.status === 503) {
      throw new Error(
        "AI service is currently busy. Please try again in a few minutes."
      );
    }

    throw new Error(
      error.message ||
        "Failed to regenerate day"
    );
  }
};

module.exports = {
  generateTravelPlan,
  regenerateDayPlan,
};