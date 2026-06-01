document.addEventListener("DOMContentLoaded", () => {
  const emptyState = document.getElementById("emptyState");
  const statsPanel = document.getElementById("statsPanel");
  const platformBadge = document.getElementById("platformBadge");
  const scanTime = document.getElementById("scanTime");
  const trustValue = document.getElementById("trustValue");
  const trustBarFill = document.getElementById("trustBarFill");
  const trustBarGlow = document.getElementById("trustBarGlow");
  const confidenceValue = document.getElementById("confidenceValue");
  const confidenceBarFill = document.getElementById("confidenceBarFill");
  const confidenceBarGlow = document.getElementById("confidenceBarGlow");
  const statTotal = document.getElementById("statTotal");
  const statGenuine = document.getElementById("statGenuine");
  const statSuspicious = document.getElementById("statSuspicious");
  const statFake = document.getElementById("statFake");
  const btnClear = document.getElementById("btnClear");
  const btnScan = document.getElementById("btnScan");

  // Donut segments
  const donutGenuine = document.getElementById("donutGenuine");
  const donutSuspicious = document.getElementById("donutSuspicious");
  const donutFake = document.getElementById("donutFake");
  const CIRCUMFERENCE = 2 * Math.PI * 30; // r=30

  // ── Helper: trust score colour ────────────────────────────────
  function scoreColor(score) {
    if (score >= 70) return "#00ffc8";
    if (score >= 40) return "#ffb800";
    return "#ff4f6d";
  }

  // ── Animate counter ───────────────────────────────────────────
  function animateCount(el, target, duration = 600) {
    const start = performance.now();
    const from = parseInt(el.textContent) || 0;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      el.textContent = Math.round(from + (target - from) * ease);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── Render donut ──────────────────────────────────────────────
  function renderDonut(genuine, suspicious, fake, total) {
    if (total === 0) {
      [donutGenuine, donutSuspicious, donutFake].forEach((el) =>
        el.setAttribute("stroke-dasharray", `0 ${CIRCUMFERENCE}`)
      );
      return;
    }
    const gLen = (genuine / total) * CIRCUMFERENCE;
    const sLen = (suspicious / total) * CIRCUMFERENCE;
    const fLen = (fake / total) * CIRCUMFERENCE;

    // Each arc is offset by the sum of previous arcs
    donutGenuine.setAttribute(
      "stroke-dasharray",
      `${gLen} ${CIRCUMFERENCE - gLen}`
    );
    donutGenuine.setAttribute("stroke-dashoffset", "0");

    donutSuspicious.setAttribute(
      "stroke-dasharray",
      `${sLen} ${CIRCUMFERENCE - sLen}`
    );
    donutSuspicious.setAttribute("stroke-dashoffset", `${-gLen}`);

    donutFake.setAttribute(
      "stroke-dasharray",
      `${fLen} ${CIRCUMFERENCE - fLen}`
    );
    donutFake.setAttribute("stroke-dashoffset", `${-(gLen + sLen)}`);
  }

  // ── Render stats ──────────────────────────────────────────────
  function renderStats(stats) {
    emptyState.style.display = "none";
    statsPanel.style.display = "flex";

    platformBadge.textContent = stats.platform || "UNKNOWN";
    scanTime.textContent = stats.lastScan || "—";

    const score = stats.avgScore || 0;
    const color = scoreColor(score);

    // Trust bar
    trustValue.textContent = score + "%";
    trustValue.style.color = color;
    trustBarFill.style.width = score + "%";
    trustBarFill.style.background = color;
    trustBarGlow.style.width = score + "%";
    trustBarGlow.style.background = color;

    // Confidence bar
    const confidence = stats.avgConfidence || 0;
    confidenceValue.textContent = confidence + "%";
    confidenceValue.style.color = "#5B9FD1";
    confidenceBarFill.style.width = confidence + "%";
    confidenceBarGlow.style.width = confidence + "%";

    // Counters
    animateCount(statTotal, stats.total || 0);
    animateCount(statGenuine, stats.genuine || 0);
    animateCount(statSuspicious, stats.suspicious || 0);
    animateCount(statFake, stats.fake || 0);

    // Donut (delayed so CSS transition fires)
    setTimeout(
      () =>
        renderDonut(
          stats.genuine || 0,
          stats.suspicious || 0,
          stats.fake || 0,
          stats.total || 0
        ),
      100
    );
  }

  // ── Load from storage ─────────────────────────────────────────
  function loadData() {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["reviewShieldStats"], (data) => {
        if (data.reviewShieldStats) {
          renderStats(data.reviewShieldStats);
        }
      });
    } else {
      // Dev/preview: inject mock data after 1 s
      setTimeout(() => {
        renderStats({
          platform: "AMAZON",
          total: 84,
          genuine: 52,
          suspicious: 20,
          fake: 12,
          avgScore: 62,
          lastScan: new Date().toLocaleTimeString(),
        });
      }, 1000);
    }
  }

  loadData();

  // ── Clear button ──────────────────────────────────────────────
  btnClear.addEventListener("click", () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.remove("reviewShieldStats", () => {
        statsPanel.style.display = "none";
        emptyState.style.display = "flex";
      });
    } else {
      statsPanel.style.display = "none";
      emptyState.style.display = "flex";
    }
  });

  // ── Re-scan button ────────────────────────────────────────────
  btnScan.addEventListener("click", () => {
    btnScan.classList.add("scanning");
    btnScan.disabled = true;

    setTimeout(() => {
      btnScan.classList.remove("scanning");
      btnScan.disabled = false;

      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "rescan" });
          }
        });
      }

      loadData();
    }, 1800);
  });

  // ── Report button ─────────────────────────────────────────────
  const btnReport = document.getElementById("btnReport");
  const reportModal = document.getElementById("reportModal");
  const reportClose = document.getElementById("reportClose");
  const reportBody = document.getElementById("reportBody");

  if (btnReport) {
    btnReport.addEventListener("click", () => {
      chrome.storage.local.get(["reviewShieldStats"], (data) => {
        if (data.reviewShieldStats) {
          const stats = data.reviewShieldStats;
          generateAndDisplayReport(stats);
        }
      });
    });
  }

  if (reportClose) {
    reportClose.addEventListener("click", () => {
      reportModal.style.display = "none";
    });
  }

  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = "none";
    }
  });

  function generateAndDisplayReport(stats) {
    const html = `
      <div class="report-section">
        <h3>📊 Summary</h3>
        <div class="report-stat">
          <span class="report-stat-label">Reviews Analyzed:</span>
          <span class="report-stat-value">${stats.total || 0}</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-label">Platform:</span>
          <span class="report-stat-value">${stats.platform || "Unknown"}</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-label">Scan Time:</span>
          <span class="report-stat-value">${stats.lastScan || "—"}</span>
        </div>
      </div>

      <div class="report-section">
        <h3>🎯 Classification Results</h3>
        <div class="report-stat">
          <span class="report-stat-label">Genuine:</span>
          <span class="report-stat-value">${Math.round(
            (stats.genuine / (stats.total || 1)) * 100
          )}%</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-label">Suspicious:</span>
          <span class="report-stat-value">${Math.round(
            (stats.suspicious / (stats.total || 1)) * 100
          )}%</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-label">Fake:</span>
          <span class="report-stat-value">${Math.round(
            (stats.fake / (stats.total || 1)) * 100
          )}%</span>
        </div>
      </div>

      <div class="report-section">
        <h3>📈 Metrics</h3>
        <div class="report-stat">
          <span class="report-stat-label">Trust Score:</span>
          <span class="report-stat-value">${stats.avgScore || 0}%</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-label">AI Confidence:</span>
          <span class="report-stat-value">${stats.avgConfidence || 0}%</span>
        </div>
      </div>

      ${
        stats.summary
          ? `
      <div class="report-section">
        <h3>💭 AI Analysis</h3>
        <div class="report-stat">
          <span class="report-stat-label">Overall Sentiment:</span>
          <span class="report-stat-value">${
            stats.summary.overallSentiment || "Unknown"
          }</span>
        </div>
        ${
          stats.summary.positives && stats.summary.positives.length > 0
            ? `
        <div style="margin-top: 8px;">
          <strong style="color: #28a745;">Most Praised:</strong>
          <ul style="margin: 4px 0 0 16px; padding: 0;">
            ${stats.summary.positives
              .slice(0, 3)
              .map((p) => `<li>${p}</li>`)
              .join("")}
          </ul>
        </div>
        `
            : ""
        }
        ${
          stats.summary.negatives && stats.summary.negatives.length > 0
            ? `
        <div style="margin-top: 8px;">
          <strong style="color: #ff4f6d;">Most Complained:</strong>
          <ul style="margin: 4px 0 0 16px; padding: 0;">
            ${stats.summary.negatives
              .slice(0, 3)
              .map((n) => `<li>${n}</li>`)
              .join("")}
          </ul>
        </div>
        `
            : ""
        }
        <div class="report-verdict">
          ${stats.summary.verdict || "No verdict available"}
        </div>
      </div>
      `
          : ""
      }

      <div class="report-section" style="margin-bottom: 0;">
        <h3>🎓 Recommendation</h3>
        ${
          stats.avgScore >= 70
            ? `
        <div class="report-verdict" style="border-left-color: #28a745;">
          ✅ Product reviews appear largely authentic. Reviews show genuine customer experiences with specific details and balanced opinions.
        </div>
        `
            : stats.avgScore >= 50
            ? `
        <div class="report-verdict" style="border-left-color: #ffb800;">
          ⚠️ Mixed review quality detected. Some reviews may benefit from further verification. Check for detailed reviews with specific experiences.
        </div>
        `
            : `
        <div class="report-verdict" style="border-left-color: #ff4f6d;">
          ⛔ High risk detected. Multiple suspicious or fake reviews identified. Exercise caution when making purchase decisions.
        </div>
        `
        }
      </div>
    `;

    reportBody.innerHTML = html;
    reportModal.style.display = "flex";
  }
});
