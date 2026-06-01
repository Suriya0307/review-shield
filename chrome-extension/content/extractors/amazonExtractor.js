// Amazon Review Extractor

class AmazonExtractor {
  extractReviews() {
    const reviews = [];

    const reviewElements = document.querySelectorAll('[data-hook="review"]');

    reviewElements.forEach((el, index) => {
      try {
        const text =
          el.querySelector('[data-hook="review-body"]')?.innerText?.trim() ||
          "";

        if (!text) return;

        const rating =
          el.querySelector('[data-hook="review-star-rating"]')?.innerText ||
          el.querySelector('[data-hook="cmps-review-star-rating"]')
            ?.innerText ||
          "";

        const review = {
          id: `amazon_${index}`,
          platform: "amazon",

          text,

          rating,

          author: el.querySelector(".a-profile-name")?.innerText?.trim() || "",

          date:
            el.querySelector('[data-hook="review-date"]')?.innerText?.trim() ||
            "",

          element: el,
        };

        reviews.push(review);
      } catch (err) {
        console.error("Review failed:", index, err);
      }
    });

    console.log(`[ReviewShield] Extracted ${reviews.length} reviews`);

    return reviews;
  }
}

window.AmazonExtractor = AmazonExtractor;
