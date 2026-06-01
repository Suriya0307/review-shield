// Background Service Worker for Review Shield

console.log("Review Shield background service worker loaded");

// Store results in memory
let analysisResults = [];

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeReviews") {
    // Call backend API to analyze reviews
    analyzeReviewsWithBackend(request.reviews)
      .then((results) => {
        analysisResults = results;
        sendResponse({ success: true, results });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  } else if (request.action === "getResults") {
    sendResponse({ results: analysisResults });
  }
});

async function analyzeReviewsWithBackend(reviews) {
  // Call backend API endpoint
  const response = await fetch("http://localhost:5000/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviews }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze reviews");
  }

  return await response.json();
}
