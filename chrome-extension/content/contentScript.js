console.log("🚀 Review Shield Loaded");

// Add global CSS for Review Shield animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

// Generate unique product ID from URL to enable caching
function getProductId() {
  const url = window.location.href;
  const asin = url.match(/\/dp\/([A-Z0-9]+)/)?.[1];
  const productId = url.match(/productId=([^&]+)/)?.[1];
  return (asin || productId || url).substring(0, 50);
}

// Check if cache exists for current product
function getCachedPredictions() {
  try {
    const data = localStorage.getItem("reviewShield_cache");
    if (!data) return null;
    const cache = JSON.parse(data);
    const productId = getProductId();
    const cached = cache[productId];
    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      // Cache valid for 24 hours
      return cached.predictions;
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }
  return null;
}

// Store predictions in cache
function cachePredictions(predictions) {
  try {
    let cache = {};
    try {
      cache = JSON.parse(localStorage.getItem("reviewShield_cache") || "{}");
    } catch (e) {}
    const productId = getProductId();
    cache[productId] = {
      predictions,
      timestamp: Date.now(),
    };
    localStorage.setItem("reviewShield_cache", JSON.stringify(cache));
  } catch (e) {
    console.error("Cache write error:", e);
  }
}

// Helper function to display analysis results
async function displayAnalysisResults(reviews, predictions, platform) {
  const reviewsSection =
    document.querySelector('[data-hook="reviews-block"]') ||
    document.querySelector('div[class*="reviews"]') ||
    document.body;

  // Remove loading state if present
  const loadingDiv = document.querySelector(".review-shield-loading");
  if (loadingDiv) loadingDiv.remove();

  predictions.forEach((prediction) => {
    const review = reviews.find((r) => r.id === prediction.id);
    if (!review) return;

    const el = review.element;
    if (el.querySelector(".review-shield-badge")) return;

    // Create badge with reason
    const container = document.createElement("div");
    container.className = "review-shield-container";
    container.style.marginBottom = "10px";

    const badge = document.createElement("div");
    badge.className = "review-shield-badge";
    badge.style.cursor = "pointer";
    badge.style.padding = "10px";
    badge.style.marginBottom = "8px";
    badge.style.fontWeight = "bold";
    badge.style.borderRadius = "6px";
    badge.style.fontSize = "14px";
    badge.style.display = "flex";
    badge.style.justifyContent = "space-between";
    badge.style.alignItems = "center";

    const badgeText = document.createElement("span");
    badgeText.innerText = `🛡️ Review Shield | ${prediction.label.toUpperCase()} | Trust: ${
      prediction.score
    }% | Confidence: ${prediction.confidence}%`;

    const expandIcon = document.createElement("span");
    expandIcon.innerText = "▼";
    expandIcon.style.fontSize = "12px";
    expandIcon.style.marginLeft = "8px";

    badge.appendChild(badgeText);
    badge.appendChild(expandIcon);

    const reasonDiv = document.createElement("div");
    reasonDiv.className = "review-shield-reason";
    reasonDiv.style.display = "none";
    reasonDiv.style.padding = "10px";
    reasonDiv.style.marginBottom = "8px";
    reasonDiv.style.borderRadius = "4px";
    reasonDiv.style.fontSize = "13px";
    reasonDiv.style.lineHeight = "1.5";
    reasonDiv.style.borderLeft = "3px solid #666";
    reasonDiv.style.backgroundColor = "rgba(0,0,0,0.03)";
    reasonDiv.style.color = "#333";

    const reasonTitle = document.createElement("strong");
    reasonTitle.innerText = "Why? ";
    const reasonText = document.createElement("span");
    reasonText.innerText = prediction.reason || "No analysis available";

    reasonDiv.appendChild(reasonTitle);
    reasonDiv.appendChild(reasonText);

    badge.addEventListener("click", () => {
      const isHidden = reasonDiv.style.display === "none";
      reasonDiv.style.display = isHidden ? "block" : "none";
      expandIcon.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
      expandIcon.style.transition = "transform 0.2s";
    });

    // Style based on label
    if (prediction.label === "fake") {
      badge.style.backgroundColor = "#ff0000";
      badge.style.color = "white";
      reasonDiv.style.borderLeftColor = "#ff0000";
      reasonDiv.style.backgroundColor = "rgba(255,0,0,0.08)";
      el.style.border = "3px solid red";
      el.style.backgroundColor = "#ffe5e5";
    } else if (prediction.label === "suspicious") {
      badge.style.backgroundColor = "#ff9800";
      badge.style.color = "black";
      reasonDiv.style.borderLeftColor = "#ff9800";
      reasonDiv.style.backgroundColor = "rgba(255,152,0,0.08)";
      el.style.border = "3px solid orange";
      el.style.backgroundColor = "#fff4d6";
    } else {
      badge.style.backgroundColor = "#28a745";
      badge.style.color = "white";
      reasonDiv.style.borderLeftColor = "#28a745";
      reasonDiv.style.backgroundColor = "rgba(40,167,69,0.08)";
      el.style.border = "3px solid green";
      el.style.backgroundColor = "#e8ffe8";
    }

    container.appendChild(badge);
    container.appendChild(reasonDiv);
    el.insertBefore(container, el.firstChild);
  });

  // Get summary and patterns
  let reviewSummary = null;
  if (reviews.length > 0) {
    try {
      reviewSummary = await ApiService.getReviewSummary(reviews);
      displayReviewSummary(reviewSummary);
      const patterns = detectReviewPatterns(predictions, reviews);
      displayReviewPatterns(patterns);
    } catch (err) {
      console.error("Failed to get summary:", err);
    }
  }

  // Calculate stats
  const fakeCount = predictions.filter((p) => p.label === "fake").length;
  const suspiciousCount = predictions.filter(
    (p) => p.label === "suspicious"
  ).length;
  const genuineCount = predictions.filter((p) => p.label === "genuine").length;
  const avgScore = Math.round(
    predictions.reduce((sum, p) => sum + p.score, 0) / predictions.length
  );
  const avgConfidence = Math.round(
    predictions.reduce((sum, p) => sum + (p.confidence || 85), 0) /
      predictions.length
  );

  chrome.storage.local.set({
    reviewShieldStats: {
      total: predictions.length,
      fake: fakeCount,
      suspicious: suspiciousCount,
      genuine: genuineCount,
      avgScore: avgScore,
      avgConfidence: avgConfidence,
      platform: platform,
      lastScan: new Date().toLocaleTimeString(),
      summary: reviewSummary,
    },
  });
}

// Display cached results instantly (0.1 sec instead of 30 seconds)
async function displayCachedResults(predictions) {
  const platform = window.location.hostname.includes("amazon")
    ? "AMAZON"
    : window.location.hostname.includes("flipkart")
    ? "FLIPKART"
    : window.location.hostname.includes("myntra")
    ? "MYNTRA"
    : "UNKNOWN";

  const scanner = new ReviewScanner();
  const reviews = scanner.scanPage().slice(0, predictions.length);
  await displayAnalysisResults(reviews, predictions, platform);
}

function displayReviewSummary(summary, trustScore) {
  // Find appropriate insertion point based on platform
  const reviewsSection =
    document.querySelector('[data-hook="reviews-block"]') ||
    document.querySelector('div[class*="reviews"]') ||
    document.body;

  const summaryContainer = document.createElement("div");
  summaryContainer.className = "review-shield-summary";
  summaryContainer.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const title = document.createElement("h2");
  title.innerText = "🧠 AI Product Review Summary";
  title.style.cssText =
    "margin: 0 0 15px 0; font-size: 18px; font-weight: 600;";

  const sentiment = document.createElement("div");
  sentiment.innerText = `Overall Sentiment: ${(
    summary.overallSentiment || "Unknown"
  ).toUpperCase()}`;
  sentiment.style.cssText = "margin-bottom: 12px; font-size: 14px;";

  const positivesBox = document.createElement("div");
  positivesBox.style.cssText = "margin-bottom: 12px;";
  const positivesTitle = document.createElement("strong");
  positivesTitle.innerText = "✓ Most Praised:";
  positivesTitle.style.display = "block";
  positivesTitle.style.marginBottom = "6px";
  const positivesList = document.createElement("div");
  positivesList.style.cssText = "margin-left: 16px; font-size: 13px;";
  (summary.positives || []).slice(0, 3).forEach((p) => {
    const item = document.createElement("div");
    item.innerText = "• " + p;
    item.style.marginBottom = "4px";
    positivesList.appendChild(item);
  });
  positivesBox.appendChild(positivesTitle);
  positivesBox.appendChild(positivesList);

  const negativesBox = document.createElement("div");
  negativesBox.style.cssText = "margin-bottom: 12px;";
  const negativesTitle = document.createElement("strong");
  negativesTitle.innerText = "✗ Most Complained:";
  negativesTitle.style.display = "block";
  negativesTitle.style.marginBottom = "6px";
  const negativesList = document.createElement("div");
  negativesList.style.cssText = "margin-left: 16px; font-size: 13px;";
  (summary.negatives || []).slice(0, 3).forEach((n) => {
    const item = document.createElement("div");
    item.innerText = "• " + n;
    item.style.marginBottom = "4px";
    negativesList.appendChild(item);
  });
  negativesBox.appendChild(negativesTitle);
  negativesBox.appendChild(negativesList);

  const verdict = document.createElement("div");
  verdict.innerText =
    "Verdict: " + (summary.verdict || "Unable to generate verdict");
  verdict.style.cssText =
    "margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 13px; font-style: italic;";

  summaryContainer.appendChild(title);
  summaryContainer.appendChild(sentiment);
  summaryContainer.appendChild(positivesBox);
  summaryContainer.appendChild(negativesBox);
  summaryContainer.appendChild(verdict);

  // Insert at the top of reviews section
  if (reviewsSection.firstChild) {
    reviewsSection.insertBefore(summaryContainer, reviewsSection.firstChild);
  } else {
    reviewsSection.appendChild(summaryContainer);
  }
}

function detectReviewPatterns(predictions, reviews) {
  const patterns = {
    genericMarketing: 0,
    extremelyShort: 0,
    suspiciousExaggeration: 0,
  };

  const genericPhrases = [
    "amazing product",
    "best ever",
    "must buy",
    "highly recommended",
    "perfect",
    "excellent quality",
    "great value",
    "highly recommend",
    "worth it",
  ];

  const reviews_to_check = reviews.slice(0, 30);

  reviews_to_check.forEach((review, idx) => {
    const prediction = predictions.find((p) => p.id === idx);
    if (!prediction) return;

    const text = (review.reviewText || "").toLowerCase();

    // Check for generic marketing language
    if (genericPhrases.some((phrase) => text.includes(phrase))) {
      if (text.split(" ").length < 50) {
        patterns.genericMarketing++;
      }
    }

    // Check for extremely short reviews (potential spam)
    if (text.split(" ").length < 10 && prediction.label === "fake") {
      patterns.extremelyShort++;
    }

    // Check for suspicious exaggeration
    if (
      (text.match(/!/g) || []).length > 3 ||
      text.includes("absolutely") ||
      text.includes("completely") ||
      text.includes("never seen")
    ) {
      if (prediction.label === "suspicious" || prediction.label === "fake") {
        patterns.suspiciousExaggeration++;
      }
    }
  });

  return patterns;
}

function displayReviewPatterns(patterns) {
  // Only show if there are issues detected
  if (Object.values(patterns).every((v) => v === 0)) return;

  const reviewsSection =
    document.querySelector('[data-hook="reviews-block"]') ||
    document.querySelector('div[class*="reviews"]') ||
    document.body;

  const patternsContainer = document.createElement("div");
  patternsContainer.className = "review-shield-patterns";
  patternsContainer.style.cssText = `
    background: #fff3cd;
    border: 2px solid #ffc107;
    color: #856404;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const title = document.createElement("h3");
  title.innerText = "⚠️ Detected Review Risks";
  title.style.cssText =
    "margin: 0 0 10px 0; font-size: 15px; font-weight: 600;";

  const list = document.createElement("div");
  list.style.cssText = "font-size: 13px;";

  if (patterns.genericMarketing > 0) {
    const item = document.createElement("div");
    item.innerText = `⚠ ${patterns.genericMarketing} reviews use generic marketing language`;
    item.style.marginBottom = "6px";
    list.appendChild(item);
  }

  if (patterns.extremelyShort > 0) {
    const item = document.createElement("div");
    item.innerText = `⚠ ${patterns.extremelyShort} reviews extremely short (potential spam)`;
    item.style.marginBottom = "6px";
    list.appendChild(item);
  }

  if (patterns.suspiciousExaggeration > 0) {
    const item = document.createElement("div");
    item.innerText = `⚠ ${patterns.suspiciousExaggeration} reviews contain suspicious exaggeration`;
    item.style.marginBottom = "6px";
    list.appendChild(item);
  }

  patternsContainer.appendChild(title);
  patternsContainer.appendChild(list);

  // Insert after summary or at top
  const summary = document.querySelector(".review-shield-summary");
  if (summary && summary.nextSibling) {
    summary.parentNode.insertBefore(patternsContainer, summary.nextSibling);
  } else if (reviewsSection.firstChild) {
    reviewsSection.insertBefore(patternsContainer, reviewsSection.firstChild);
  } else {
    reviewsSection.appendChild(patternsContainer);
  }
}

async function analyzeReviews() {
  try {
    // Check cache first - if same product, load instantly
    const cachedPredictions = getCachedPredictions();
    if (cachedPredictions) {
      // Use cached results - instant display
      await displayCachedResults(cachedPredictions);
      return;
    }

    // Show loading state
    const reviewsSection =
      document.querySelector('[data-hook="reviews-block"]') ||
      document.querySelector('div[class*="reviews"]') ||
      document.body;

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "review-shield-loading";
    loadingDiv.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      margin-bottom: 20px;
      border-radius: 8px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;
    loadingDiv.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation: spin 1s linear infinite;">
        <circle cx="8" cy="8" r="6" stroke="white" stroke-width="2" fill="none" opacity="0.3"/>
        <circle cx="8" cy="2" r="1.5" fill="white"/>
      </svg>
      <span>🧠 Analyzing reviews with AI...</span>
    `;

    if (reviewsSection.firstChild) {
      reviewsSection.insertBefore(loadingDiv, reviewsSection.firstChild);
    } else {
      reviewsSection.appendChild(loadingDiv);
    }

    // Detect platform
    let platform = "UNKNOWN";
    if (window.location.hostname.includes("amazon")) {
      platform = "AMAZON";
    } else if (window.location.hostname.includes("flipkart")) {
      platform = "FLIPKART";
    } else if (window.location.hostname.includes("myntra")) {
      platform = "MYNTRA";
    }

    // Create scanner
    const scanner = new ReviewScanner();

    // Extract structured reviews - LIMIT TO FIRST 20 for speed
    // This reduces API processing time significantly
    let reviews = scanner.scanPage();
    reviews = reviews.slice(0, 20);

    // Get predictions (now batched in single API call)
    const predictions = await ApiService.predictFakeReviews(reviews);

    // Cache results for instant future loads
    cachePredictions(predictions);

    // Display results (handles all display logic, summary, patterns, and stats)
    await displayAnalysisResults(reviews, predictions, platform);

    console.log("✅ Review analysis complete");
  } catch (error) {
    console.error("Review Shield Error:", error);

    // Show error message to user
    const reviewsSection =
      document.querySelector('[data-hook="reviews-block"]') ||
      document.querySelector('div[class*="reviews"]') ||
      document.body;

    const errorDiv = document.createElement("div");
    errorDiv.className = "review-shield-error";
    errorDiv.style.cssText = `
      background: #ffe5e5;
      border: 2px solid #ff4f6d;
      color: #d32f2f;
      padding: 12px;
      margin-bottom: 16px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
    `;
    errorDiv.innerHTML =
      "⚠️ Review Shield: AI service temporarily unavailable. Please try again later.";

    if (reviewsSection.firstChild) {
      reviewsSection.insertBefore(errorDiv, reviewsSection.firstChild);
    } else {
      reviewsSection.appendChild(errorDiv);
    }
  }
}

// Amazon
if (window.location.hostname.includes("amazon")) {
  setTimeout(() => {
    analyzeReviews();
  }, 3000);
}

// Flipkart
if (window.location.hostname.includes("flipkart")) {
  setTimeout(() => {
    analyzeReviews();
  }, 3000);
}

// Myntra
if (window.location.hostname.includes("myntra")) {
  setTimeout(() => {
    analyzeReviews();
  }, 3000);
}
