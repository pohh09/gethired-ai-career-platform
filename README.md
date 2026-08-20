# 🚀 GetHired AI — Next-Gen AI Career Platform & Multi-Provider Job Tracker

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Gemini 1.5](https://img.shields.io/badge/Google_Gemini-1.5_Flash-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GetHired AI** is an intelligent, full-stack career acceleration platform and job application ecosystem. Powered by **Google Gemini 1.5 Flash AI**, it unifies ATS resume matching, STAR bullet optimization, adaptive mock interview simulations, contextual cover letter generation, and real-time job aggregation across **9 global job boards** into a high-performance, tracker-centric workflow.

---

## 🌐 Live Deployment & Links

- 🔗 **GitHub Repository**: [https://github.com/pooj0901/gethired](https://github.com/pooj0901/gethired)
- 🖥️ **Live Web Application**: [https://gethired-ai.vercel.app](https://gethired-ai.vercel.app) *(or your deployed production URL)*

---

## 🌟 Core Features & Capabilities

### 🤖 1. AI-Powered Career Intelligence Suite

- **🎯 AI Resume Matching & ATS Fit Scoring**
  - Instant ATS compatibility scoring (0–100) and letter grades ($A+$, $A$, $B$, $C$).
  - Detects matching and missing keywords, technical skill gaps, and layout vulnerabilities.
  - Actionable ATS tips and keyword optimization advice to beat enterprise screening engines.

- **✍️ AI Resume Optimizer & STAR Bullet Rewriter**
  - Converts generic bullet points into high-impact **STAR** (Situation, Task, Action, Result) statements with quantifiable metrics.
  - Executive action verb injector and tailored summary rewrites.

- **🎙️ Adaptive AI Mock Interview Simulator**
  - Simulates multi-round technical, behavioral, and system design interviews for over 15+ engineering and tech roles.
  - Real-time rubric evaluation scoring technical accuracy, communication clarity, relevance, and missing concepts.
  - Provides ideal model answers, actionable feedback, and comprehensive post-session performance reports.

- **✉️ Contextual Cover Letter & Follow-Up Generator**
  - Generates tailored, role-specific cover letters pre-seeded directly with target job descriptions and company values.
  - Generates post-interview follow-up emails and recruiter outreach messages with one click.

- **🧭 AI Career Coach & Strategic Roadmaps**
  - Personalized promotion roadmaps, career transition playbooks, and market salary negotiation benchmarks.

---

### 🌐 2. Multi-Provider Job Search Aggregator (9 Job Boards)

GetHired AI features a unified job search engine that queries and aggregates listings across **9 global job boards and ATS platforms**:

1. **Adzuna** — Deep regional and international job listings.
2. **Jooble** — Worldwide aggregated postings.
3. **RemoteOK** — Curated remote-first tech roles.
4. **Greenhouse** — Direct ATS board crawler.
5. **Lever** — Modern startup and scale-up ATS postings.
6. **USAJobs** — Federal and public sector job opportunities.
7. **JSearch (RapidAPI)** — Multi-source web aggregator (LinkedIn, Indeed, Glassdoor).
8. **Arbeitnow** — European and global tech positions with visa sponsorship filters.
9. **RapidJobs** — Fast indexing tech board.

*Features automated query normalization, deduplication, salary extraction, and one-click import into your active application tracker.*

---

### 💼 3. Central Job Application Tracker (Primary Home Base)

- **Kanban & Table Views**: Track applications across stages: `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`, and `Archived`.
- **Fast Job Creation (≤ 2 clicks)**: Quick-add applications directly from the dashboard or import with auto-enrichment from discovered jobs.
- **Contextual AI Actions**: Every tracked job provides direct AI triggers:
  - *✨ Tailor Resume for this Job*
  - *✉️ Generate Cover Letter for this Job*
  - *🎯 Practice Interview for this Role*
  - *🔍 Analyze Match & Missing Skills*
- **1-Click Drilldown Dashboard**: Interactive KPI cards filtering pipeline states in real time.

---

### 📄 4. Guided ATS Resume Builder & Document Hub

- **7-Step Guided Wizard**: Build a professional ATS-compliant resume with live preview and "⚡ Skip to Preview" functionality.
- **Vector PDF & Markdown Export**: High-fidelity browser printing engine with zero margin distortion.
- **Master Resumes & Shared Drafts**: Manage master profiles and drafts for peer review.

---

### 👥 5. Community & Peer Review Hub

- **PII-Protected Peer Feedback**: Opt-in document sharing (`private` by default) with inline community feedback and helpfulness upvotes.
- **Accountability Streaks**: Daily application and practice streaks with motivational milestones.
- **Community Success Feed & Q&A**: Real interview questions, offer stories, and job search strategies from active job seekers.

---

### 🛡️ 6. Transparent AI Provenance & Reliability

- **Dual-Mode AI Architecture**: Google Gemini 1.5 Flash real-time inference with graceful fallback to heuristic parsers if API limits or network interruptions occur.
- **Honest UI Indicators**: Results explicitly display provenance badges (`source: "ai"` vs `source: "fallback"`) ensuring users and reviewers always know when a score is AI-generated or an estimated heuristic.

---

## 🏗️ Project Architecture & Directory Structure

```
gethired/
├── client/                               # Frontend (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/                      # ATSMethodologyBreakdown, ResumeAnalysis, KeywordCard
│   │   │   ├── aiWorkspace/             # AI Workspace tab panels (Jobs, Resume, Interview, Career)
│   │   │   ├── calendar/                # Calendar & interview scheduler
│   │   │   ├── common/                  # PageHeader, Breadcrumbs, ErrorBoundary
│   │   │   ├── community/               # Peer feedback, streaks, and share modals
│   │   │   ├── dashboard/               # KpiCard, ActionCenter, QuickActions, EmptyState
│   │   │   ├── jobs/                    # Kanban, DataTable, JobDetailModal, JobAiActionsMenu, Modals
│   │   │   ├── layout/                  # Navbar, Sidebar (6 core nav items), CommandPalette
│   │   │   ├── resumes/                 # ResumeCard, UploadResumeModal, MasterResumesTab
│   │   │   └── ui/                      # Design System (Button, Input, Select, Badge, Card, Modal, Table)
│   │   ├── hooks/                       # Custom hooks (useJobs, useDashboard, useDebounce, etc.)
│   │   ├── pages/                       # Dashboard, Jobs, Resumes, ResumeBuilder, AIWorkspace, Community, Analytics, Calendar, Profile, Settings, Login, Register
│   │   ├── routes/                      # AppRoutes with lazy loading & ProtectedRoute
│   │   ├── services/                    # Axios API client, aiService, aiWorkspaceService, authServices
│   │   ├── store/                       # Zustand stores (authStore, resumeStore, reminderStore, uiStore)
│   │   └── types/                       # Strict TypeScript interfaces (ai, job, community, user)
│   ├── .env.example
│   └── package.json
│
└── server/                               # Backend (Node.js + Express + MongoDB Mongoose)
    ├── src/
    │   ├── config/                      # Database (db.js) & environment configuration
    │   ├── controllers/                 # authController, jobController, communityController
    │   ├── middleware/                  # authMiddleware (JWT verification), error handlers
    │   ├── models/                      # User, JobApplication, SharedDocument, Feedback Mongoose schemas
    │   ├── routes/                      # authRoutes, jobRoutes, communityRoutes, aiRoutes
    │   ├── services/
    │   │   ├── ai/                      # Dedicated Gemini AI Services
    │   │   │   ├── resumeAIService.js   # ATS parsing, scoring & bullet optimization
    │   │   │   ├── interviewAIService.js# Multi-round mock interview generator & scoring
    │   │   │   ├── jobAnalysisAIService.js # Job match analysis & JD breakdown
    │   │   │   ├── careerAIService.js   # Career coaching & roadmap generation
    │   │   │   └── chatAIService.js     # AI Career Assistant & conversational coach
    │   │   ├── providers/               # 9 Job Board Crawlers & Aggregators
    │   │   │   ├── adzunaProvider.js
    │   │   │   ├── joobleProvider.js
    │   │   │   ├── remoteOKProvider.js
    │   │   │   ├── greenhouseProvider.js
    │   │   │   ├── leverProvider.js
    │   │   │   ├── usajobsProvider.js
    │   │   │   ├── jsearchProvider.js
    │   │   │   ├── arbeitnowProvider.js
    │   │   │   ├── rapidJobsProvider.js
    │   │   │   └── BaseProvider.js
    │   │   ├── aiService.js             # High-level resume matching & optimization
    │   │   ├── jobSearchService.js      # Multi-provider job orchestration
    │   │   └── coverLetterService.js    # AI Cover letter generation
    │   ├── app.js                       # Express middleware & route registration
    │   └── server.js                    # HTTP server startup
    ├── .env.example
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Language**: React 19, TypeScript, Vite 8
- **Routing**: React Router v7
- **State Management & Caching**: TanStack Query v5, Zustand v5 (with localStorage persistence)
- **Styling & UI**: Tailwind CSS v4, Lucide Icons, Framer Motion v12
- **Data Visualizations**: Recharts v3
- **Form Management**: React Hook Form, Zod

### Backend
- **Runtime & Framework**: Node.js 20+, Express.js 4.21
- **Database**: MongoDB Atlas via Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **AI Integration**: Google Gemini 1.5 Flash API (`@google/generative-ai` & Axios REST client)
- **Job Search Providers**: REST integrations across 9 job board APIs

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Google Gemini API Key**: [Get a free Gemini API Key](https://aistudio.google.com/)

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gethired?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_min_32_characters
NODE_ENV=development

# Google Gemini AI Integration
GEMINI_API_KEY=your_gemini_api_key_here

# Job Search Providers (Optional — defaults and public providers active)
JSEARCH_API_KEY=your_rapidapi_jsearch_key
JSEARCH_API_HOST=jsearch.p.rapidapi.com
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
JOOBLE_API_KEY=your_jooble_api_key
```

Start the backend server:

```bash
npm run dev
```
*Server starts on `http://localhost:5000`.*

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```
*Client opens on `http://localhost:5173`.*

---

## 🧪 Production Build & Verification

To build and validate the frontend bundle:

```bash
cd client
npm run build
```

To run server AI endpoint verification:

```bash
cd server
node test_ai_endpoints.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
