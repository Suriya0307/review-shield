class ApiService {
  static async predictFakeReviews(reviews) {
    try {
      console.log("🔥 API SERVICE STARTED");
      console.log(reviews);

      // Batch all reviews in ONE request instead of sequential calls
      // This reduces 13 reviews × 3 seconds = 39 seconds → 2-4 seconds

      const reviewsData = reviews.map((r, idx) => ({
        id: idx,
        title: r.reviewTitle || "",
        text: r.reviewText || "",
        rating: r.rating || 0,
        verified: r.verified ? "Yes" : "No",
        reviewer: r.reviewer || "Unknown",
        length: r.reviewLength || 0,
      }));

      console.log("================================");
      console.log("SENDING TO BACKEND");
      console.log(reviewsData);
      console.log("================================");

      const response = await fetch(
        "https://reviewshield-backend.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-v3.2",
            messages: [
              {
                role: "system",
                content: `You are Review Shield AI - an expert at detecting fake e-commerce reviews.

For each review, evaluate these signals:
1. Product Specificity (0-10): Mentions specific features, models, technical details
2. Personal Experience (0-10): Uses "I", "my", describes personal usage
3. Balanced Opinion (0-10): Mentions both pros AND cons, not just praise
4. Detail Level (0-10): Length and depth of explanation (1-2 sentences = low, 5+ = high)
5. Marketing Penalty (0-10): Deduct points for generic phrases like "must buy", "highly recommend", "best ever"

Calculate FINAL TRUST SCORE = Average of above signals (weighted toward honesty)

CLASSIFICATION RULES (strict):
- FAKE (0-39): Obvious spam, copied, completely generic, no details, pure marketing
- SUSPICIOUS (40-69): Some details but feels off, generic praise, too short, unbalanced
- GENUINE (70-100): Specific product details, personal experience, balanced, authentic

IMPORTANT: A long, detailed review with specific product info should NEVER be fake.

Analyze ALL reviews below. Return ONLY valid JSON array.

Format:
[
  {
    "id": 0,
    "score": 85,
    "label": "genuine",
    "reason": "Specific technical details about performance..."
  },
  ...
]`,
              },
              {
                role: "user",
                content: `Analyze these ${reviews.length} reviews:

${reviewsData
  .map(
    (r) => `
[Review ${r.id}]
Title: ${r.title}
Text: ${r.text}
Rating: ${r.rating}/5
Verified: ${r.verified}
Length: ${r.length} chars
`
  )
  .join("\n")}

Return JSON array with predictions for each review ID.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      console.log("================================");
      console.log("BACKEND RESPONSE");
      console.log(data);
      console.log("================================");

      const raw = data.choices[0].message.content;
      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const results = JSON.parse(cleaned);

      // Ensure we have predictions for all reviews
      const predictions = reviewsData.map((r) => {
        const result = results.find((res) => res.id === r.id) || results[r.id];
        return {
          id: r.id,
          score: Number(result?.score) || 50,
          label: (result?.label || "suspicious").toLowerCase(),
          reason: result?.reason || "Analysis performed",
          confidence: Number(result?.confidence) || 80,
        };
      });

      return predictions;
    } catch (err) {
      console.error("Error analyzing reviews:", err);
      // Return neutral predictions on error
      return reviews.map((_, idx) => ({
        id: idx,
        score: 50,
        label: "suspicious",
        reason: "Service temporarily unavailable",
        confidence: 50,
      }));
    }
  }

  static async getReviewSummary(reviews) {
    try {
      // Take first 20 reviews for summary
      const reviewsToSummarize = reviews.slice(0, 20);

      const reviewTexts = reviewsToSummarize
        .map(
          (r) =>
            `Title: ${r.reviewTitle}\nText: ${r.reviewText}\nRating: ${r.rating}`
        )
        .join("\n\n---\n\n");

      const response = await fetch(
        "https://reviewshield-backend.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-v3.2",
            messages: [
              {
                role: "system",
                content: `You are Review Shield AI. Analyze customer reviews and provide a summary.
Return ONLY valid JSON.

Format:
{
  "overallSentiment": "positive|neutral|negative",
  "positives": ["string", "string"],
  "negatives": ["string", "string"],
  "verdict": "string summary"
}`,
              },
              {
                role: "user",
                content: `Please analyze these ${reviewsToSummarize.length} reviews and provide:
1. Overall sentiment
2. Top 3 positives mentioned
3. Top 3 negatives mentioned
4. A brief overall verdict

Reviews:
${reviewTexts}

Return ONLY valid JSON.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const raw = data.choices[0].message.content;
      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Error getting summary:", err);
      return {
        overallSentiment: "unknown",
        positives: [],
        negatives: [],
        verdict: "Unable to generate summary",
      };
    }
  }
}

window.ApiService = ApiService;
