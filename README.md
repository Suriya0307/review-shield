# 🛡️ Review Shield

<div align="center">

# AI-Powered Chrome Extension for Detecting Fake Reviews on  </br>  E-Commerce Platforms

### Detect Fake Reviews • Generate Trust Scores • Shop With Confidence

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge\&logo=googlechrome)
![AI Powered](https://img.shields.io/badge/AI-DeepSeek_V3.2-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js-success?style=for-the-badge\&logo=node.js)
![Deployment](https://img.shields.io/badge/Deployment-Render-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=for-the-badge)

### 🛒 Amazon • Flipkart • Myntra

</div>

---

#  Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Solution](#-solution)
* [Key Features](#-key-features)
* [How It Works](#-how-it-works)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Installation](#-installation)
* [Deployment](#-deployment)
* [Screenshots](#-screenshots)
* [Impact](#-impact)
* [Future Enhancements](#-future-enhancements)
* [Team](#-team)
* [License](#-license)

---

# Overview

Online shoppers heavily depend on product reviews before making purchasing decisions. Unfortunately, fake, manipulated, incentivized, and spam reviews often mislead consumers and reduce trust in e-commerce platforms.

**Review Shield** is an AI-powered Chrome Extension that analyzes product reviews in real time, identifies fake or suspicious reviews, calculates trust scores, and helps users make smarter purchasing decisions.

Using **DeepSeek AI**, Review Shield evaluates review authenticity based on multiple factors including review quality, user experience details, emotional exaggeration, promotional language, and trust signals.

---

# Problem Statement

Millions of consumers trust online reviews to evaluate products.

However:

 * Fake reviews artificially boost product ratings

 * Review farms manipulate public perception

 * Promotional reviews lack transparency

 * Consumers struggle to identify trustworthy feedback

 * Poor purchasing decisions lead to customer dissatisfaction

These challenges reduce confidence in online marketplaces and negatively impact customer experience.

---

#  Solution

Review Shield provides an intelligent AI-based review verification system directly inside the shopping experience.

The extension:

✅ Extracts product reviews in real time

✅ Uses AI to evaluate review authenticity

✅ Calculates review trust scores

✅ Highlights fake and suspicious reviews

✅ Provides visual review classifications

✅ Helps consumers make informed purchasing decisions

---

#  Key Features

##  Real-Time Review Analysis

Automatically scans product reviews on supported e-commerce platforms.

### Information Extracted

* Review Text
* Review Rating
* Reviewer Information
* Verified Purchase Status
* Review Length
* Review Metadata

---

##  AI-Powered Fake Review Detection

Each review is analyzed using DeepSeek AI.

### Evaluation Criteria

* Product-specific details
* Personal experience
* Balanced opinions
* Review length
* Emotional exaggeration
* Generic marketing language
* Repetitive promotional phrases
* Authenticity indicators
* Trust signals
* Consistency between rating and content

---

##  Trust Score Generation

Each review receives a trust score from 0–100.

| Trust Score | Classification    |
| ----------- | ----------------- |
| 90–100      | ✅ Genuine         |
| 70–89       | 🟢 Mostly Genuine |
| 50–69       | ⚠️ Suspicious     |
| 0–49        | ❌ Fake            |

---

##  Interactive Dashboard

Review Shield provides:

* Total Reviews Analyzed
* Genuine Reviews Count
* Suspicious Reviews Count
* Fake Reviews Count
* Average Trust Score
* Confidence Metrics
* Platform Information
* Scan Timestamp

---

##  AI Summary Generation

Generate AI-powered summaries that provide:

* Review insights
* Trustworthiness analysis
* Suspicious review detection
* Product sentiment overview

---

##  One-Click Re-Scan

Users can instantly:

* Refresh analysis
* Recalculate trust scores
* Analyze newly loaded reviews

---

#  How It Works

### Step 1

User visits an Amazon product page.

### Step 2

Review Shield scans all available reviews.

### Step 3

Review data is sent securely to the backend.

### Step 4

DeepSeek AI analyzes review authenticity.

### Step 5

Trust scores and classifications are generated.

### Step 6

Results are displayed directly on the product page.

---

# 🏗️ System Architecture

```text
┌─────────────────────┐
│ Amazon Product Page │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Review Scanner      │
│ Chrome Extension    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Render Backend API  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ OpenRouter API      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ DeepSeek V3.2 AI    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Trust Score Engine  │
└─────────────────────┘
```

---

#  Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Chrome Extension Manifest V3

## Backend

* Node.js
* Express.js

## AI Layer

* DeepSeek V3.2
* OpenRouter API

## Deployment

* GitHub
* Render

---

#  Project Structure

```text
review-shield
│
├── backend
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── ...
│
├── chrome-extension
│   ├── manifest.json
│   ├── content
│   ├── popup
│   ├── services
│   ├── assets
│   └── ...
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Suriya0307/review-shield.git
cd review-shield
```

---


## Load Extension

Open Chrome:

```text
chrome://extensions
```

Enable:

```text
Developer Mode
```

Click:

```text
Load Unpacked
```

Select:

```text
chrome-extension/
```

---

# 🌐 Deployment

## Backend Deployment

Backend is deployed using Render.

Environment Variables:

```env
OPENROUTER_API_KEY=YOUR_API_KEY
```

---

## Extension Deployment

Package:

```text
chrome-extension/
```

Upload ZIP to Chrome Web Store.

---

# 🖼 Screenshots

## Dashboard





 <img width="1600" height="943" alt="image" src="https://github.com/user-attachments/assets/70bfb9dc-b481-4eb4-ac74-27ea933c2b9a" />


---




## Review Analysis




<img width="633" height="730" alt="Screenshot 2026-06-01 175524" src="https://github.com/user-attachments/assets/7daf42e9-3025-4f2a-9bef-92e35459df50" />


---

## Trust Score Visualization





<img width="1900" height="1139" alt="Screenshot 2026-06-01 201805" src="https://github.com/user-attachments/assets/b0b36757-542e-4a24-987d-b243c4d8b06a" />






---

## AI Summary Generation







<img width="1919" height="1143" alt="Screenshot 2026-06-01 201713" src="https://github.com/user-attachments/assets/6cbfa92b-ddfa-4409-aa94-c8ab83ecc7c4" />







---

#  Impact

Review Shield aims to:

* Improve consumer trust
* Reduce fake review influence
* Increase transparency in e-commerce
* Encourage informed purchasing decisions
* Promote trustworthy online marketplaces

---

#  Future Enhancements

### AI Improvements

* Fine-Tuned Fake Review Detection Model
* Multi-Model AI Verification
* Explainable AI Analysis

### Platform Expansion

* Flipkart Support
* Myntra Support
* eBay Support
* Walmart Support

### User Experience

* Dark Mode
* Review History
* Seller Reputation Analytics
* Mobile Browser Support
* Multi-Language Review Analysis

---

# 🎥 Demo

### GitHub Repository


https://github.com/Suriya0307/review-shield


### Backend URL


https://reviewshield-backend.onrender.com



### Demo Video

https://drive.google.com/drive/folders/1WmED7JP8E4jOP7IabPfHJzlJSi5b1hUH

---

# Team Gladitors

Developed as a Hackathon Project.


### Contributors

## Suriya SK


---

#  License

MIT License

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository.

---

###  Available on the Chrome Web Store

Install Review Shield and start analyzing product reviews directly on your favorite e-commerce platforms.

 <div align="center">
🔗 **Chrome Web Store:

#  Review Shield

### Making Online Shopping Safer With AI


</div>
