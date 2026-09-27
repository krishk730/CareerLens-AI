# CareerLens AI

> **Tagline:** Learn • Showcase Skills • Find Opportunities • Grow  
> **Target Audience:** College students, freshers, internship seekers, and entry-level job seekers.

CareerLens AI is a modern full-stack career intelligence platform and opportunities marketplace designed to bridge the gap between academic coursework and entry-level employment. It empowers students with ATS resume diagnostics, AI match scoring, skill gap prioritization, personalized 4-week roadmaps, and an interactive career mentor.

---

## 🚀 Key Features

1. **AI Resume Analyzer & ATS Diagnostic**
   - Drag-and-drop resume upload (PDF, DOCX, TXT).
   - Server-side parsing and structured Gemini analysis.
   - Circular ATS score (0–100), section health breakdown (Summary, Education, Skills, Projects, Experience, Certificates).
   - Concrete bullet-point recommendations, missing keywords, and 3-step action plans.
   - Historical resume analysis tracking in Firebase Firestore.

2. **Smart Opportunity Matching (AI Match Score)**
   - Algorithmic evaluation comparing candidate skills & projects against job criteria.
   - Matched vs missing skill tags and personalized advisory explanation.
   - Bookmark/save opportunities and direct application submission.

3. **Curated & Live Opportunities Marketplace**
   - Filter by categories: Software Development, Data Science, Data Analyst, AI/ML, Web Development, Cyber Security, Business Analytics.
   - Filter by workplace (Remote, Hybrid, On-site) and type (Internship, Full-time).
   - Configurable external Job API support with fallback to a curated demo dataset.
   - Visual status badge (`Live Opportunities API` vs `Demo Opportunities`).

4. **Skill Gap Analysis & 4-Week Roadmap**
   - Role benchmarking across top engineering and data tracks.
   - Career Readiness percentage gauge.
   - High, Medium, and Low urgency missing skills breakdown.
   - Personalized 4-week learning roadmap with project objectives and estimated study hours.

5. **AI Career Recommendations**
   - Alternative career paths aligned with existing student skills.
   - Market demand indicators and suggested next milestones.

6. **CareerLens AI Assistant (Chatbot)**
   - Context-aware chatbot with memory of the student's target role, current skills, and latest resume scores.
   - Suggested prompts for interview prep, portfolio suggestions, and resume improvements.

7. **Applications Pipeline Tracker**
   - Kanban-style status tracking: Saved, Applied, Interview, Selected, Rejected.
   - Application statistics and stage distribution.
   - Manual application logging.

8. **Complete Student Career Profile**
   - Personal details, Education, Categorized Skills inventory, Highlighted Projects, Experience, and Certificates.
   - Dynamic 0–100% Career Profile Completeness calculation.

9. **Instant Demo Student Mode**
   - Built-in `Demo Student` profile (Alex Rivera, CS Junior) for immediate testing and evaluation without credentials.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion, Canvas-Confetti
- **Backend Runtime:** Node.js, Express, tsx
- **AI Engine:** Google Gemini API (`@google/genai` SDK using `gemini-3.8-flash`)
- **Database & Auth:** Firebase Authentication, Cloud Firestore
- **Security:** Zero-trust Firestore ABAC rules (`firestore.rules`), server-side API proxy (no client-side API keys)

---

## 🏛 Architecture

```
CareerLens AI
├── src/
│   ├── components/         # Reusable UI (CircularProgress, JobCard, JobMatchModal, etc.)
│   ├── context/            # AuthContext (Firebase Auth + Demo Mode), ThemeContext, NotificationContext
│   ├── lib/                # Firebase initialization & Firestore error-handled services
│   ├── pages/              # LandingPage, Dashboard, Profile, ResumeAnalyzer, Opportunities, etc.
│   ├── services/           # apiClient (Frontend API callers)
│   └── types/              # Strict TypeScript interfaces
├── server/
│   ├── services/           # geminiService.ts, jobService.ts
│   └── app.ts              # Express API endpoints (/api/ai/*, /api/jobs/*)
├── firestore.rules         # Hardened Firestore security rules
├── firebase-blueprint.json # Database entity definitions
├── vite.config.ts          # Vite configuration with Express API server middleware
└── server.ts               # Full-stack production entrypoint
```

---

## 🔐 Environment Variables

Create a `.env` file (or use AI Studio Secrets):

```env
# Required for Gemini AI features
GEMINI_API_KEY="your-gemini-api-key"

# App URL (auto-injected in AI Studio)
APP_URL="http://localhost:3000"

# Optional: External Job Data API (e.g. Adzuna, RapidAPI JSearch)
# When left empty, CareerLens AI uses its high-quality curated demo opportunities.
JOB_API_KEY=""
JOB_API_BASE_URL=""
```

---

## ⚡ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Start production full-stack server
npm run start
```

---

## 🛡 Security & Compliance

- **No Secrets in Client Code:** All Gemini API and external job API calls are routed through server endpoints (`/api/*`).
- **Firestore Security Rules:** Restricted to authenticated owner (`request.auth.uid == userId`) with default-deny fallback.
- **Advisory Notice:** All AI match scores and career recommendations are informational guidance and do not guarantee hiring outcomes.
