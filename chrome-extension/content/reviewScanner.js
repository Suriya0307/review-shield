// Review Scanner

class ReviewScanner {
  constructor() {
    this.reviews = [];
  }

  scanPage() {
    const reviewElements = this.getReviewElements();

    this.reviews = reviewElements.map((el, index) => {
      const reviewText =
        el
          .querySelector('[data-hook="reviewTextContainer"]')
          ?.innerText?.trim() ||
        el.querySelector('[data-hook="review-body"] span')?.innerText?.trim() ||
        el.querySelector('[data-hook="review-body"]')?.innerText?.trim() ||
        el.querySelector('[data-hook="review-collapsed"]')?.innerText?.trim() ||
        el.innerText ||
        "";

      const reviewTitle =
        el.querySelector("a.a-link-normal.a-text-bold")?.innerText?.trim() ||
        el.querySelector('[data-hook="review-title"]')?.innerText?.trim() ||
        "";

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
