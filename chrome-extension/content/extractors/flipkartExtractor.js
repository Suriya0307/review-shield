// Flipkart Review Extractor

class FlipkartExtractor {
  extractReviews() {
    const reviews = [];
    // Flipkart-specific review extraction logic
    const reviewElements = document.querySelectorAll('div[class*="review"]');

    reviewElements.forEach((el) => {
      const review = {
        platform: "flipkart",
        text: el.querySelector('[class*="review-text"]')?.innerText || "",
        rating: el.querySelector('[class*="rating"]')?.innerText || "",
        author: el.querySelector('[class*="author"]')?.innerText || "",
        date: el.querySelector('[class*="date"]')?.innerText || "",
      };
      reviews.push(review);
    });

    return reviews;
  }
}

// Export for use
window.FlipkartExtractor = FlipkartExtractor;
