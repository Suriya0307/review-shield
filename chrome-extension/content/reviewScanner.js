// Review Scanner

class ReviewScanner {
  constructor() {
    this.reviews = [];
  }

  scanPage() {
    const reviewElements = this.getReviewElements();

    this.reviews = reviewElements.map((el, index) => {
      const reviewBody = el.querySelector('[data-hook="review-body"]');

      const reviewText =
        reviewBody?.innerText?.trim() || reviewBody?.textContent?.trim() || "";

      const reviewTitle =
        el.querySelector('[data-hook="review-title"]')?.innerText?.trim() || "";

      const reviewer =
        el.querySelector(".a-profile-name")?.innerText?.trim() || "Unknown";

      const ratingText =
        el.querySelector('[data-hook="review-star-rating"]')?.innerText ||
        el.querySelector('[data-hook="cmps-review-star-rating"]')?.innerText ||
        "";

      const rating = parseFloat(ratingText.split(" ")[0]) || 0;

      const verified = el.innerText.includes("Verified Purchase");

      const reviewDate =
        el.querySelector('[data-hook="review-date"]')?.innerText?.trim() || "";

      console.log("================================");
      console.log("REVIEW INDEX:", index);
      console.log("TITLE:", reviewTitle);
      console.log("TEXT:", reviewText);
      console.log("TEXT LENGTH:", reviewText.length);
      console.log("RATING:", rating);
      console.log("VERIFIED:", verified);
      console.log("================================");

      return {
        id: index,
        reviewer,
        reviewTitle,
        reviewText,
        reviewLength: reviewText.length,
        rating,
        verified,
        reviewDate,
        element: el,
      };
    });

    console.log(`[ReviewShield] Scanned ${this.reviews.length} reviews`);

    console.table(
      this.reviews.map((r) => ({
        id: r.id,
        reviewer: r.reviewer,
        rating: r.rating,
        verified: r.verified,
        length: r.reviewLength,
      }))
    );

    return this.reviews;
  }

  getReviewElements() {
    return Array.from(document.querySelectorAll('[data-hook="review"]'));
  }
}

window.ReviewScanner = ReviewScanner;
