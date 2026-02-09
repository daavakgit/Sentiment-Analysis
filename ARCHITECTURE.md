# ZomaLens - Architecture & How It Works

This document provides a deep dive into the technical architecture, data flow, and "magic" behind the ZomaLens Customer Feedback Sentiment Analysis Tool.

## 1. High-Level Overview

ZomaLens is a **MERN stack** application (MongoDB, Express, React, Node.js) designed to analyze customer feedback in real-time. It uses a **Hybrid AI Engine** to process text, determining sentiment (positive/negative/neutral), extracting keywords, and identifying operational categories (e.g., Delivery vs. Food Quality).

### The "Magic" (AI Analysis Flow)

When a user submits a review to be analyzed, the system follows a robust **Fallback Strategy** to ensure 100% uptime:

1.  **Primary Path (Server-Side AI)**: The app sends the text to the Backend API (`/api/analyze`). The backend attempts to call Google's **Gemini 1.5 Flash API**.
2.  **Secondary Path (Client-Side AI)**: If the backend fails (e.g., server down, API key quota exceeded), the Frontend uses a client-side API key to call Gemini directly.
3.  **Tertiary Path (Local Logic)**: If both external AI calls fail, the app falls back to a **Local Sentiment Library (`sentiment` + `compromise`)**. This ensures the user *always* gets a result, even without internet or API quota.

---

## 2. Technical Stack

### Frontend (Client)
-   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast build tool)
-   **Styling**: Pure CSS with CSS Variables for theming (Glassmorphism design).
-   **State Management**: React `useState` / `useEffect`.
-   **Visualization**: [Recharts](https://recharts.org/) for interactive data charts.
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth page transitions and micro-interactions.
-   **Icons**: [Lucide React](https://lucide.dev/).

### Backend (Server)
-   **Runtime**: Node.js.
-   **Framework**: Express.js.
-   **Database**: MongoDB (connected via Mongoose).
-   **API Handling**: Axios for external AI calls.

---

## 3. Directory Structure Explaination

```
/
├── api/                  # Backend Code
│   └── index.js          # Express Server & API Routes
├── src/                  # Frontend Code
│   ├── components/       # Reusable UI Components
│   │   ├── Dashboard.jsx # Main analytics view (Charts & Graphs)
│   │   ├── LiveAnalysis.jsx # AI Playground for testing text
│   │   ├── ReviewList.jsx   # Data grid for viewing raw reviews
│   │   └── ...
│   ├── data/             # Mock Data (used if DB is empty)
│   ├── utils/
│   │   └── aiEngine.js   # The Hybrid AI Logic (Gemini + Local fallback)
│   ├── App.jsx           # Main Router & Layout logic
│   └── index.css         # Global Styles & Variables
├── .env                  # Environment Variables (API Keys, DB URI)
└── index.html            # Entry point
```

---

## 4. Key Components Breakdown

### A. Dashboard (`Dashboard.jsx`)
The command center. It calculates metrics on the fly using `calculateMetrics` from `mockData.js` (or real data).
-   **Sentiment Trends**: Area chart showing sentiment score changes over the last 7 days.
-   **Category Performance**: Bar chart showing which operational areas (Delivery, Taste, Packaging) are performing best.
-   **Critical Issues**: Filters reviews with "Negative" sentiment to highlight urgent problems.

### B. Live AI Engine (`LiveAnalysis.jsx` + `aiEngine.js`)
This is the interactive playground.
-   **Input**: Text area for raw customer feedback.
-   **Process**: Calls `analyzeText()`.
-   **Output**:
    -   **Sentiment**: Positive/Negative/Neutral.
    -   **Score**: A number between -1.0 (Bad) and 1.0 (Good).
    -   **Emotions**: Detected emotions (e.g., "Anger", "Delight").
    -   **Keywords**: Extracted nouns/adjectives (e.g., "stale bun", "fast delivery").

### C. Backend API (`api/index.js`)
-   `GET /api/reviews`: Fetches all reviews from MongoDB.
-   `POST /api/analyze`: Proxies requests to Google Gemini to keep API keys hidden (when possible).
-   `GET /api/health`: Simple health check to verify server status.

---

## 5. Data Flow Diagram

1.  **User opens App**: `App.jsx` mounts.
2.  **Data Fetching**: `useEffect` attempts to fetch `/api/reviews`.
    -   *Success*: Populates state with MongoDB data.
    -   *Fail*: Falls back to `src/data/mockData.js` so the UI doesn't break.
3.  **Interaction**: User clicks "Dashboard".
    -   Data is passed to `Dashboard.jsx`.
    -   Metrics are recalculated.
    -   Charts are rendered using Recharts.

## 6. Deployment & Production

-   **Build**: `npm run build` bundles React into static files in `/dist`.
-   **Serve**: `api/index.js` is configured to serve these static files via `express.static`, allowing the app to run as a single unit (Monolith) suitable for platforms like Render or Vercel.
