# 🚀 GetHired AI — Commercial SaaS Job Application & Recruiter CRM Platform

GetHired AI is an enterprise-grade, commercial SaaS job application tracking and recruiter CRM platform built with modern full-stack web standards: **React 19**, **TypeScript**, **Vite**, **TanStack Query v5**, **Zustand**, **Axios**, **Recharts**, **Framer Motion**, **Node.js**, **Express.js**, and **MongoDB Atlas**.

![GetHired SaaS Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

---

## 🌟 Key Features

### 📊 1. Real-Time Analytics & Executive Dashboard
- **Live Metrics**: Real-time KPI trackers for **Total Applications**, **Applied**, **Interview**, **Offer**, and **Rejected** status metrics.
- **Recharts Data Visualizations**:
  - **Stage Breakdown**: Bar chart analytics across all pipeline stages.
  - **Status Distribution**: Donut/Pie distribution percentages of active applications.
  - **6-Month Application Trend**: Area chart tracking job search momentum.
- **Recent Applications Feed**: Instant overview of recent job submissions.

### 🏢 2. Company CRM Module (Ashby / Greenhouse / Linear Style)
- **Directory Views**: Switch between **Grid Card View** and **Table List View**.
- **Recruiter Contact Management**: Store recruiter names, titles, email addresses, LinkedIn profiles, phone numbers, and relationship statuses (`Cold`, `Warm`, `Active`, `Referral`).
- **Communication History Timeline**: Chronological tracking of calls, emails, LinkedIn messages, referrals, meetings, and interviews.
- **Rich Text Pinned Notes**: Format interview preparation notes, tech stack details, and pin priority insights.
- **Interactive Hiring Pipeline**: Track candidates and role progression across `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`, and `Accepted`.
- **Multi-Attribute Search & Tag Filters**: Search by company, industry, recruiter, size, workplace model (*Remote*, *Hybrid*, *Onsite*), or tags (`Dream Company`, `Referral`, `Startup`, `MNC`, `Remote`, `Priority`).

### 💼 3. Job Pipeline Management
- **Debounced Search**: Instant filter across companies, titles, and tags.
- **Multi-Filtering & Sorting**: Filter by stage and priority; sort by date, company name, or priority.
- **Paginated Data Table**: Interactive table with page controls, total ranges, and badge indicators.
- **Job Details Modal**: Display salary ranges, locations, application dates, URLs, and notes.

### 📝 4. Form Validation & Custom Confirmation Dialogs
- **Add / Edit Job Modal**: Powered by **React Hook Form** + **Zod** schema validation.
- **Accessible Confirmation Modal**: Custom dialogs replacing browser `confirm()` with warning graphics, cancel options, and loading states.

### 👤 5. Profile & Security Management
- **Personal Profile**: Update name and email address with backend validation.
- **Security**: Update passwords securely with current password verification and bcrypt hashing.

### 🌗 6. Enterprise Design System & UX Hardening
- **Vercel & Linear Aesthetic**: Clean dark mode glassmorphism, Inter font scale, crisp borders, and subtle Framer Motion micro-animations.
- **Network Resilience**: Automatic online/offline status detection with graceful toast notifications.
- **Error Boundaries**: Class-based React Error Boundaries providing recovery fallbacks.

---

## 🏗️ Architecture & Folder Structure

```
gethired/
├── client/                     # Frontend (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── activity/      # Activity timeline components
│   │   │   ├── ai/            # AI Insights components
│   │   │   ├── analytics/     # Analytics chart widgets
│   │   │   ├── calendar/      # Calendar & planner components
│   │   │   ├── common/        # Breadcrumbs, PageHeader, ErrorBoundary
│   │   │   ├── companies/     # Company CRM components (CompanyCard, CompanyTable, RecruiterCard, Timeline, NotesPanel, Tags)
│   │   │   ├── dashboard/     # Dashboard metric cards & recent job widgets
│   │   │   ├── jobs/          # JobFormModal, JobDetailModal, JobTable
│   │   │   ├── layout/        # Navbar, Sidebar, WorkspaceSwitcher
│   │   │   ├── notifications/ # Notification drawer components
│   │   │   └── ui/            # Design System (Button, Input, Select, Badge, Card, Modal, Table, Skeleton, Loader, EmptyState)
│   │   ├── constants/         # Design tokens & status constants
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom hooks (useJobs, useNetworkStatus, useDebounce, etc.)
│   │   ├── layouts/           # DashboardLayout & AuthLayout
│   │   ├── lib/               # TanStack Query client configuration
│   │   ├── pages/             # Dashboard, Jobs, Companies, CompanyDetail, Analytics, Calendar, AiInsights, Notifications, Activity, Profile, Settings, Login, Register, NotFound
│   │   ├── routes/            # AppRoutes with lazy loading & ProtectedRoute
│   │   ├── services/          # Axios instance & typed API services
│   │   ├── store/             # Zustand authStore, uiStore, and companyStore
│   │   └── types/             # Strict TypeScript interface definitions
│   ├── .env.example
│   └── package.json
│
└── server/                     # Backend (Node.js + Express + MongoDB Mongoose)
    ├── src/
    │   ├── config/            # Database connection setup
    │   ├── controllers/       # authController, jobController
    │   ├── middleware/        # authMiddleware (JWT verification)
    │   ├── models/            # User and JobApplication Mongoose schemas
    │   ├── routes/            # authRoutes, jobRoutes
    │   ├── app.js             # Express application configuration
    │   └── server.js          # HTTP server bootstrap
    ├── .env.example
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 8, TypeScript
- **Routing**: React Router v7
- **State & Caching**: TanStack Query v5, Zustand v5 (with local storage persistence)
- **HTTP Client**: Axios with centralized request/response interceptors & token queue
- **Design System & Icons**: Tailwind CSS v4, Lucide React
- **Charts & Motion**: Recharts v3, Framer Motion v12
- **Validation**: React Hook Form, Zod

### Backend
- **Runtime & Framework**: Node.js, Express.js
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt password hashing

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas Database connection URI

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/gethired.git
cd gethired

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `.env` in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create `.env` in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers
```bash
# Terminal 1: Start Backend
cd server
npm run dev

# Terminal 2: Start Frontend
cd client
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment Guide

### Deploying Frontend (Vercel)
1. Import repository into Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_URL=https://your-api-domain.com/api`

### Deploying Backend (Render / Railway)
1. Environment: **Node**.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Environment Variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`

---

## 📄 License
Licensed under the [ISC License](LICENSE). Built for enterprise engineering standards.
