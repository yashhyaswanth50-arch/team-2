# AI Career Guidance Assistant

A production-ready web application designed specifically for first-year college students who are undecided or exploring suitable career paths, higher-study options, and actionable semester-by-semester roadmaps based on their genuine interests, enjoyed subjects, and existing skills.

---

## 🌟 Key Features

1. **Onboarding & Profile Wizard**
   - 5-step guided experience capturing personal context, interests (multi-select chips + free-text), favorite subjects, existing skills, and custom constraints (e.g., "prefer non-coding", "creative focus").
   - Instant sample persona presets ("Maya - Undecided Freshman", "Alex - Tech & Analytics", "Priya - Health & Science") for quick exploration.
   - Local persistence to resume where students left off.

2. **AI Career Discovery Engine (Server-Side Gemini 3.8 Flash)**
   - Maps student profile inputs to 3–5 realistic career paths.
   - Generates role descriptions, specific match reasons, day-to-day work tasks, and common job titles.
   - Realistic salary qualifiers (non-promissory) and work environment contexts.
   - Intelligently asks 1–3 clarifying questions if inputs are sparse or multifaceted.

3. **Interactive Step-by-Step Roadmap View**
   - Semester & month-based milestone timeline (0–3 months, 3–6 months, 6–12 months, Year 2).
   - Activity types: Courses, Projects, Internships, Networking, Competitions, Certifications.
   - Interactive milestone checklist: **Not Started**, **In Progress**, and **Done**.
   - Personal notes & reflection box per milestone.
   - Printable / PDF export ready view.
   - Unique shareable link for counselors and peers.

4. **Higher-Study & Skill Gap Exploration**
   - Compares degrees (Bachelor's, Master's, Diplomas) vs. professional certifications.
   - Skill gap breakdown: Skills already possessed vs. skills to build.
   - "Explore More" engine with custom emphasis (e.g., "more creative", "less coding", "more analytical").

5. **College Counselor View**
   - Read-only review mode for academic advisors.
   - Review student profile, selected pathways, and checklist progress.
   - Leave guidance notes and recommendations linked to specific milestones.

6. **AI Safety & Student Empathy**
   - Avoids unrealistic salary guarantees or definitive job claims.
   - Prominently displays academic counseling disclaimers.

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── metadata.json             # AI Studio metadata & capabilities
├── package.json              # App scripts and npm dependencies
├── server.ts                 # Full-stack Express backend + Gemini API routes + Vite dev middleware
├── src/
│   ├── types.ts              # Shared TypeScript interfaces and data models
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Main application controller, state, and view routing
│   ├── index.css             # Tailwind CSS entry
│   ├── data/
│   │   └── constants.ts      # Preset interests, subjects, skill suggestions & sample personas
│   ├── utils/
│   │   └── storage.ts        # LocalStorage persistence helpers & step progress manager
│   └── components/
│       ├── Header.tsx        # Top navigation, counselor mode switcher, and profile reset
│       ├── HeroLanding.tsx   # Welcoming landing page with value props & preset cards
│       ├── OnboardingWizard.tsx # 5-step guided profile builder
│       ├── CareerCard.tsx    # Card representation for recommended paths
│       ├── CareerResultsView.tsx # Filter & search bar, domain chips, and career grid
│       ├── RoadmapView.tsx   # Interactive milestone checklist, study options, notes, & share
│       ├── CounselorView.tsx # Read-only advisor dashboard with student feedback tools
│       ├── ExploreMoreModal.tsx # Alternative angle generation modal
│       ├── ClarifyingQuestionsModal.tsx # Clarifying questionnaire modal
│       └── DisclaimerBanner.tsx # Academic counseling disclaimer banner
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Required for Gemini API calls. In Google AI Studio, this is managed in Settings > Secrets.
GEMINI_API_KEY="your-gemini-api-key"

# APP_URL: The base URL where the app is hosted (optional in local development)
APP_URL="http://localhost:3000"
```

---

## 🚀 Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. The backend server automatically starts with `tsx` and mounts Vite middleware for development.

3. **Check Types and Linting**:
   ```bash
   npm run lint
   ```

---

## 🚢 Deployment Guide

### Deploying to Google Cloud Run (Single Container)

1. Build the frontend and bundle the backend:
   ```bash
   npm run build
   ```
   This compiles the frontend into `dist/` and bundles `server.ts` into a self-contained CommonJS server at `dist/server.cjs`.

2. Test production build locally:
   ```bash
   npm start
   ```

3. Deploy using gcloud CLI:
   ```bash
   gcloud run deploy ai-career-guidance \
     --source . \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY="your_api_key_here" \
     --allow-unauthenticated
   ```

### Deploying to Firebase Hosting / Cloud Run

- **Cloud Run Service**: Run the Express server as the backend service handling `/api/*`.
- **Firebase Hosting**: Rewrites `/api/**` to your Cloud Run service and serves static files from `dist/`.
