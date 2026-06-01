// Review Highlighter

class ReviewHighlighter {
  constructor() {
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement("style");

    style.textContent = `
      .review-shield-fake {
        background-color: #ffcccc !important;
        border: 3px solid #ff0000 !important;
      }

      .review-shield-suspicious {
        background-color: #fff3cd !important;
        border: 3px solid #ff9800 !important;
      }

      .review-shield-genuine {
        background-color: #d4edda !important;
        border: 3px solid #28a745 !important;
      }

      .review-shield-badge {
        padding: 8px 12px;
        margin-bottom: 10px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 14px;
        display: inline-block;
      }

      .review-shield-badge.fake {
        background: #ff0000;
        color: white;
      }

      .review-shield-badge.suspicious {
        background: #ff9800;
        color: black;
      }

      .review-shield-badge.genuine {
        background: #28a745;
        color: white;
      }
    `;

    document.head.appendChild(style);
  }

  highlightReview(element, classification, score) {
    element.classList.remove(
      "review-shield-fake",
      "review-shield-suspicious",
      "review-shield-genuine"
    );

    if (classification === "fake") {
      element.classList.add("review-shield-fake");
    } else if (classification === "suspicious") {
      element.classList.add("review-shield-suspicious");
    } else {
      element.classList.add("review-shield-genuine");
    }

    const existingBadge =
      element.querySelector(".review-shield-badge");

    if (existingBadge) {
      existingBadge.remove();
    }

    const badge = document.createElement("div");

    badge.className =
      `review-shield-badge ${classification}`;

    badge.innerHTML = `
      🛡️ Review Shield |
      ${classification.toUpperCase()}
      |
      Trust Score: ${score}%
    `;

    element.prepend(badge);
  }
}

window.ReviewHighlighter = ReviewHighlighter;