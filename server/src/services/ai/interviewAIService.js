import axios from "axios";

async function callGeminiPrompt(prompt, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
  if (apiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }] },
        { headers: { "Content-Type": "application/json" } }
      );
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (_err) {}
  }
  return null;
}

const ROLE_QUESTION_BANKS = {
  "Full Stack Developer": {
    technical: [
      {
        id: "fs-tech-1",
        question: "Explain how you would design a full-stack application using React, Node.js, Express, and MongoDB from scratch.",
        difficulty: "Easy",
        category: "Full Stack Architecture",
        expectedTopics: ["react frontend", "express routing", "mongodb database", "rest api integration"],
        strongAnswerContains: "Covers architecture separation (client/server), REST API endpoints, MongoDB models, state management, and CORS middleware.",
        importantPoints: ["Client-server separation", "Express router & REST endpoints", "Mongoose schema modeling", "CORS & environment configuration"],
        commonMistakes: ["Mixing frontend code inside Express routes", "Hardcoding database credentials"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I structure full-stack apps with decoupled frontend and backend. The React client handles UI component state and API calls via Axios/React Query. The Node.js Express server exposes REST endpoints (e.g. /api/users), handles request validation, and interacts with MongoDB via Mongoose schemas."
      },
      {
        id: "fs-tech-2",
        question: "What happens when a user submits a login form in React and the request reaches an Express backend? Explain the complete flow.",
        difficulty: "Easy",
        category: "API & Data Flow",
        expectedTopics: ["form submit handler", "axios request", "express route", "password verification", "jwt response"],
        strongAnswerContains: "Traces event prevention on form submit, HTTP POST payload, Express body parsing, bcrypt comparison, JWT generation, and client token storage.",
        importantPoints: ["e.preventDefault() on form submit", "Axios POST to /api/auth/login", "bcrypt.compare() for password verification", "JWT creation with secret key", "HttpOnly cookie or state storage"],
        commonMistakes: ["Missing e.preventDefault()", "Storing raw passwords in DB"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "The user submits the form, calling a handler with e.preventDefault(). React sends a POST request with credentials. Express middleware parses the JSON body, queries MongoDB, and verifies the password using bcrypt.compare. On success, Express signs a JWT and returns it in an HttpOnly cookie or response body."
      },
      {
        id: "fs-tech-3",
        question: "How would you implement secure authentication using JWT in a MERN application?",
        difficulty: "Medium",
        category: "Security & Auth",
        expectedTopics: ["jwt signing", "httponly cookies", "auth header", "express middleware", "token expiration"],
        strongAnswerContains: "Covers JWT signing with a secret key, storing tokens in HttpOnly SameSite cookies, Express auth middleware for verification, and refresh token rotation.",
        importantPoints: ["HttpOnly SameSite cookies", "jsonwebtoken sign & verify", "Express auth middleware", "Token expiration & refresh tokens"],
        commonMistakes: ["Storing JWT in localStorage vulnerable to XSS", "No token expiration check"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Upon user authentication, Node.js signs a JWT containing user claims using a private secret. The token is sent via HttpOnly SameSite cookies to protect against XSS. Express middleware intercepts requests, extracts the token, and verifies it with jwt.verify before passing control to route handlers."
      },
      {
        id: "fs-tech-4",
        question: "What is the difference between client-side state and server-side state? When would you use React Query versus Zustand/Redux?",
        difficulty: "Medium",
        category: "State Management",
        expectedTopics: ["client state vs server state", "react query caching", "zustand redux store", "stale time"],
        strongAnswerContains: "Distinguishes UI state (dark mode, modal toggles) from asynchronous server data (users, jobs), explaining React Query for automatic caching and Redux/Zustand for client UI state.",
        importantPoints: ["Server state caching & invalidation", "Client UI transient state", "React Query data synchronization", "Zustand global store"],
        commonMistakes: ["Putting server API responses into global Redux store unnecessarily"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Server state originates asynchronously from APIs and can become stale, whereas client state manages local UI (theme, drawer open). I use React Query for server state because it handles background refetching, caching, and loading states automatically, reserving Zustand or Redux for purely client-side UI state."
      },
      {
        id: "fs-tech-5",
        question: "How would you optimize a React application that has become slow as the number of components and API requests increases?",
        difficulty: "Medium",
        category: "Performance Optimization",
        expectedTopics: ["react memo", "usememo usecallback", "code splitting React.lazy", "virtualized lists", "request debouncing"],
        strongAnswerContains: "Covers Profiler audit, code-splitting routes with React.lazy/Suspense, memoizing heavy components with React.memo, virtualizing long lists, and debouncing search API calls.",
        importantPoints: ["React Profiler tool", "Code splitting with React.lazy()", "React.memo & useCallback", "List virtualization (react-window)", "Debouncing API requests"],
        commonMistakes: ["Blindly adding useMemo everywhere without measuring render metrics"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "First, I profile renders with React DevTools. I apply code splitting via React.lazy and Suspense to reduce initial bundle size. I prevent re-renders by wrapping child components in React.memo and memoizing callbacks with useCallback. For long lists, I use windowing via react-window."
      },
      {
        id: "fs-tech-6",
        question: "How would you design pagination, filtering, and sorting for a REST API in Node.js and MongoDB?",
        difficulty: "Medium",
        category: "API Design",
        expectedTopics: ["query parameters limit page", "mongodb skip limit", "cursor pagination", "index optimization"],
        strongAnswerContains: "Covers query parameter parsing (req.query), MongoDB skip/limit or cursor-based pagination, dynamic sorting objects, and creating database indexes.",
        importantPoints: ["req.query parsing (page, limit, sort)", "Cursor-based vs offset pagination", "MongoDB .skip() and .limit()", "Compound database indexes"],
        commonMistakes: ["Fetching all DB documents into memory and filtering in JavaScript"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "The API endpoint accepts query parameters like page, limit, sort, and search. In MongoDB, offset pagination uses .skip((page - 1) * limit).limit(limit). For large datasets, I prefer cursor-based pagination using document IDs. Compound indexes are added to fields used in sorting and filtering."
      },
      {
        id: "fs-tech-7",
        question: "A Node.js API suddenly becomes slow when traffic increases. How would you investigate and fix the problem?",
        difficulty: "Hard",
        category: "Debugging & Scaling",
        expectedTopics: ["event loop blocking", "unindexed db queries", "apm profiling", "redis caching", "cluster module"],
        strongAnswerContains: "Traces diagnostic steps: APM monitoring (New Relic/Datadog), event loop latency profiling, unindexed DB queries (EXPLAIN ANALYZE), adding Redis caching, and PM2 clustering.",
        importantPoints: ["APM latency metrics", "Node.js Event Loop profiling", "Database query EXPLAIN ANALYZE", "Redis caching layer", "PM2 clustering / horizontal scaling"],
        commonMistakes: ["Restarting the server without reading performance logs"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I inspect APM metrics to locate bottlenecks. If event loop latency is high, I check for CPU-intensive synchronous code. If database queries are slow, I run EXPLAIN ANALYZE to identify missing indexes. To mitigate traffic spikes, I add a Redis caching layer for hot endpoints and scale horizontally using Node.js cluster module or Kubernetes auto-scaling."
      },
      {
        id: "fs-tech-8",
        question: "How would you structure a large Express.js application so that it remains maintainable as the number of features grows?",
        difficulty: "Hard",
        category: "Backend Architecture",
        expectedTopics: ["layered architecture", "controllers services repositories", "middleware", "route modules"],
        strongAnswerContains: "Covers controller-service-repository pattern, modular route grouping, centralized error middleware, environment configuration validation, and unit testing separation.",
        importantPoints: ["Layered architecture (Routes -> Controllers -> Services -> Models)", "Centralized error handling middleware", "Dependency injection", "Environment validation (Joi/Zod)"],
        commonMistakes: ["Putting all database logic inside Express route handlers"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I adopt a layered architecture separating concerns into Routes, Controllers, Services (business logic), and Data Models. Route files define HTTP endpoints, Controllers handle HTTP requests/responses, and Services contain reusable core business logic. Centralized middleware handles validation and error logging."
      },
      {
        id: "fs-tech-9",
        question: "When would you choose MongoDB over PostgreSQL, and what trade-offs would you consider?",
        difficulty: "Hard",
        category: "Database Systems",
        expectedTopics: ["nosql vs sql", "acid transactions", "schema flexibility", "relational joins", "sharding"],
        strongAnswerContains: "Compares document model flexibility and horizontal sharding (MongoDB) against strict ACID compliance, complex SQL JOINs, and relational integrity (PostgreSQL).",
        importantPoints: ["Document flexible schema vs Relational SQL schema", "ACID transactions & foreign keys", "Horizontal scaling & sharding", "Complex joins vs embedded documents"],
        commonMistakes: ["Claiming MongoDB doesn't support transactions at all"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "MongoDB excels for unstructured/semi-structured data, rapid prototyping, and high-write document scenarios with horizontal sharding. PostgreSQL is superior when strong ACID compliance, complex multi-table joins, financial integrity, and strict relational constraints are paramount."
      },
      {
        id: "fs-tech-10",
        question: "How would you securely handle passwords, JWT tokens, authorization roles, and protected routes?",
        difficulty: "Hard",
        category: "Security Engineering",
        expectedTopics: ["bcrypt salting", "httponly sametite", "rbac role based access", "middleware route protection"],
        strongAnswerContains: "Details password hashing with bcrypt + salt, storing JWTs in HttpOnly SameSite cookies, RBAC middleware checking permissions, and sanitizing outputs.",
        importantPoints: ["bcrypt password hashing with salt factor", "HttpOnly SameSite secure cookies", "Role-Based Access Control (RBAC) middleware", "CSRF token protection"],
        commonMistakes: ["Returning password hashes in user API JSON responses"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Passwords are hashed using bcrypt with a salt factor of 12. Authentication returns a JWT in an HttpOnly, SameSite=Strict cookie to prevent XSS/CSRF. Express RBAC middleware checks req.user.role against required permissions before invoking protected endpoints."
      },
      {
        id: "fs-tech-11",
        question: "Design a job-tracking application that supports thousands of users. What would your frontend, backend, database, and deployment architecture look like?",
        difficulty: "Hard",
        category: "System Design",
        expectedTopics: ["system design", "react frontend cdn", "express microservices", "redis caching", "aws ecs docker"],
        strongAnswerContains: "Proposes React + Vite static bundle on Cloudflare CDN, Node.js Express backend containers on AWS ECS/GCP Cloud Run, PostgreSQL/MongoDB with read replicas, and Redis caching.",
        importantPoints: ["Frontend CDN deployment (Vercel/Cloudflare)", "Backend containerization (Docker & AWS ECS)", "Database replication & connection pooling", "Redis caching for active sessions"],
        commonMistakes: ["Proposing monolithic single-server setup for high scale"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "The React SPA is deployed to a global CDN. The Express API runs in Docker containers on AWS ECS behind an Application Load Balancer with auto-scaling. Primary PostgreSQL DB handles writes while read replicas handle analytics queries. Redis caches user dashboard metrics to reduce database load."
      },
      {
        id: "fs-tech-12",
        question: "You deployed your application and users are reporting intermittent 500 errors. Walk me through how you would debug the issue.",
        difficulty: "Hard",
        category: "Production Incident Response",
        expectedTopics: ["sentry log monitoring", "uncaught exceptions", "db connection exhaustion", "reproduction steps"],
        strongAnswerContains: "Details incident triage: checking error monitoring (Sentry), reviewing server logs (Winston/CloudWatch), identifying unhandled promise rejections or DB connection pool limits, patching, and adding regression tests.",
        importantPoints: ["Sentry / Datadog log inspection", "Isolating error status codes & stack traces", "Checking DB pool & memory leaks", "Hotfix deployment & post-mortem analysis"],
        commonMistakes: ["Blindly restarting production without checking stack trace logs"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I immediately check Sentry log aggregations to isolate the exact stack trace causing 500 errors. If it's a DB connection timeout, I inspect pool exhaustion metrics. Once reproduced locally with test inputs, I push a hotfix with regression unit tests and hold a post-mortem to prevent recurrence."
      }
    ]
  },
  "Frontend Developer": {
    technical: [
      {
        id: "fe-tech-1",
        question: "Explain the React component lifecycle and how state changes trigger re-renders.",
        difficulty: "Easy",
        category: "React Fundamentals",
        expectedTopics: ["virtual dom", "render cycle", "re-render triggers", "props and state"],
        strongAnswerContains: "Explains component mounting, updating, and unmounting phases, Virtual DOM reconciliation, and how state/prop mutations trigger render cycles.",
        importantPoints: ["Mounting, Updating, Unmounting", "Virtual DOM diffing", "State/prop mutation triggers", "React Fiber engine"],
        commonMistakes: ["Directly mutating state variables"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "React components go through Mount, Update, and Unmount phases. When state or props change, React invokes the component function to create a new Virtual DOM tree. Its reconciliation algorithm (Fiber) diffs the new tree against the previous one and updates only changed real DOM nodes."
      },
      {
        id: "fe-tech-2",
        question: "What problem does `useEffect` solve, and how do you properly clean up side effects?",
        difficulty: "Easy",
        category: "React Hooks",
        expectedTopics: ["side effects", "dependency array", "cleanup function", "unmount"],
        strongAnswerContains: "Explains synchronization with external systems (APIs, subscriptions, DOM listeners), dependency array execution, and returning cleanup functions to prevent memory leaks.",
        importantPoints: ["Synchronization with external APIs/DOM", "Dependency array comparison", "Cleanup function return", "Preventing memory leaks"],
        commonMistakes: ["Omitting variables from dependency array", "Forgetting cleanup for event listeners"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "useEffect lets you perform side effects like fetching data or subscribing to events. It runs after DOM updates. Returning a cleanup function ensures event listeners, timers, or WebSocket connections are unsubscribed when the component unmounts or dependencies change."
      },
      {
        id: "fe-tech-3",
        question: "`useMemo` vs `useCallback` — when would you actually use them, and what is the key difference?",
        difficulty: "Medium",
        category: "React Performance",
        expectedTopics: ["usememo value", "usecallback function", "memoization", "referential equality"],
        strongAnswerContains: "Clarifies that useMemo memoizes computed values while useCallback memoizes function references, explaining referential equality for child props.",
        importantPoints: ["useMemo memoizes calculation results", "useCallback memoizes function instances", "Referential equality for props", "Memory overhead trade-offs"],
        commonMistakes: ["Claiming useMemo is used for fetching data from APIs"],
        scoringRubric: { vague: "10-25%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "useMemo caches the result of an expensive calculation between renders, while useCallback caches a function instance to maintain referential equality when passed to memoized child components. Neither should be used blindly as memoization itself incurs memory cost."
      },
      {
        id: "fe-tech-4",
        question: "Explain controlled vs uncontrolled components in React forms and when to use each.",
        difficulty: "Medium",
        category: "React Forms",
        expectedTopics: ["controlled component state", "uncontrolled component ref", "form validation"],
        strongAnswerContains: "Distinguishes state-driven inputs (controlled) from DOM-driven inputs via refs (uncontrolled), analyzing performance vs real-time validation trade-offs.",
        importantPoints: ["Controlled: React state holds value", "Uncontrolled: DOM holds value via ref", "Real-time validation use cases", "Performance benefits of refs for large forms"],
        commonMistakes: ["Confusing ref usage with controlled inputs"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Controlled components store input values in React state, providing instant validation and UI feedback on every keystroke. Uncontrolled components let the DOM manage input values via useRef, offering better performance for massive forms with minimal validation needs."
      },
      {
        id: "fe-tech-5",
        question: "How would you manage state in a large React application with dozens of sub-pages?",
        difficulty: "Medium",
        category: "State Architecture",
        expectedTopics: ["local state", "context api", "zustand redux", "react query server state"],
        strongAnswerContains: "Categorizes state into component local state, transient UI state (Zustand/Context), and server API state (React Query), keeping global stores lightweight.",
        importantPoints: ["Local useState for component UI", "React Query / SWR for server cache", "Zustand / Redux for global client state", "Avoiding unnecessary re-renders"],
        commonMistakes: ["Storing all backend response data inside global React Context"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I separate state into 3 layers: component-local state via useState, global UI state (theme, drawer) via Zustand, and server data caching via React Query. This prevents Context re-render bottlenecks across large applications."
      },
      {
        id: "fe-tech-6",
        question: "How would you optimize unnecessary re-renders in a complex React component tree?",
        difficulty: "Medium",
        category: "React Optimization",
        expectedTopics: ["react memo", "profiler", "state colocation", "children as props"],
        strongAnswerContains: "Covers React DevTools Profiler, React.memo prop comparison, state colocation, lifting content up as children, and stable prop references.",
        importantPoints: ["React DevTools Profiler", "React.memo component wrapping", "State colocation to leaf nodes", "Passing components as children props"],
        commonMistakes: ["Wrapping every single component in React.memo indiscriminately"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I identify re-rendering components using React DevTools Profiler. I move state down to leaf components to isolate updates. Where parent state must change, I wrap expensive children in React.memo and pass callbacks wrapped in useCallback."
      },
      {
        id: "fe-tech-7",
        question: "Explain React Query (TanStack Query) and why it is different from global state management libraries like Redux.",
        difficulty: "Hard",
        category: "Data Fetching",
        expectedTopics: ["server state cache", "stale time", "cache invalidation", "optimistic updates"],
        strongAnswerContains: "Explains server state features: stale-while-revalidate, automatic background refetching, query key invalidation, and optimistic updates.",
        importantPoints: ["Server state cache vs Client state store", "staleTime & cacheTime configuration", "Query key invalidation (queryClient.invalidateQueries)", "Optimistic UI mutations"],
        commonMistakes: ["Treating React Query as a local UI state library"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "React Query is a dedicated server-state management tool that automates caching, deduplication, stale data invalidation, and background refetching. Redux is a client state store requiring manual boilerplate for async API states."
      },
      {
        id: "fe-tech-8",
        question: "How would you build a reusable component library / design system using React and CSS?",
        difficulty: "Hard",
        category: "Design Systems",
        expectedTopics: ["compound components", "accessibility aria", "token styling", "typescript props"],
        strongAnswerContains: "Covers design tokens (colors, typography), TypeScript strict prop interfaces, compound component patterns, accessibility (a11y) standards, and Storybook documentation.",
        importantPoints: ["Design tokens (CSS variables / Tailwind tokens)", "Compound component pattern", "TypeScript interfaces for props", "WAI-ARIA accessibility compliance"],
        commonMistakes: ["Hardcoding colors and pixel sizes directly into components"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I establish design tokens using CSS variables or Tailwind primitives. I design flexible API prop interfaces with TypeScript, adopt the compound component pattern for complex elements (e.g. Select, Modal), and enforce WAI-ARIA keyboard navigation."
      },
      {
        id: "fe-tech-9",
        question: "How would you make a complex React web application accessible (WCAG 2.1 AA compliant)?",
        difficulty: "Hard",
        category: "Accessibility (a11y)",
        expectedTopics: ["semantic html", "aria attributes", "focus trap", "color contrast", "screen reader"],
        strongAnswerContains: "Semantic HTML5, ARIA roles/live regions, focus trap management for modals, visible focus outlines, and keyboard navigation testing.",
        importantPoints: ["Semantic HTML5 elements", "Focus traps for modals", "ARIA attributes & live regions", "Keyboard navigation & WCAG contrast"],
        commonMistakes: ["Removing outline focus rings with outline: none"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I use semantic HTML5 elements. For dynamic elements like dropdowns and modals, I implement ARIA attributes (aria-expanded, aria-modal), focus management using focus traps, and keyboard listeners (Tab/Esc), ensuring 4.5:1 color contrast ratios."
      },
      {
        id: "fe-tech-10",
        question: "How would you optimize Core Web Vitals (LCP, INP, CLS) in a React frontend application?",
        difficulty: "Hard",
        category: "Web Vitals & Performance",
        expectedTopics: ["lcp largest contentful paint", "inp interaction to next paint", "cls cumulative layout shift", "image optimization", "font loading"],
        strongAnswerContains: "Explains LCP (hero image preloading, WebP/AVIF, CDN), INP (reducing main thread blocking tasks, debouncing), and CLS (explicit aspect ratios, dynamic skeleton placeholders).",
        importantPoints: ["LCP: Image preloading & CDN delivery", "INP: Minimizing main thread JS tasks", "CLS: Explicit image width/height & reserved containers", "Font display: swap"],
        commonMistakes: ["Confusing FID with INP"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "For LCP, I optimize hero images using WebP/AVIF formats and preload tags. For INP, I break up long JavaScript tasks and defer heavy computations. For CLS, I assign explicit aspect-ratio attributes to images and reserve layout dimensions for dynamic dynamic content."
      },
      {
        id: "fe-tech-11",
        question: "How would you debug a production-only frontend bug that only happens on specific mobile devices?",
        difficulty: "Hard",
        category: "Frontend Debugging",
        expectedTopics: ["sentry error tracking", "remote debugging browser", "user agent reproduction", "source maps"],
        strongAnswerContains: "Covers error monitoring (Sentry stack traces & breadcrumbs), remote debugging tools (Safari Web Inspector / Chrome Remote Debugging), checking browser feature compatibility (CanIUse), and source maps.",
        importantPoints: ["Sentry error stack traces & breadcrumbs", "Remote device debugging (Safari / Chrome)", "Feature support (CanIUse / polyfills)", "Production source maps"],
        commonMistakes: ["Blindly pushing trial-and-error fixes without inspecting device logs"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I inspect Sentry error stack traces and breadcrumbs to view exact device details and user actions. I connect the physical device to Chrome/Safari Remote Debugging to view console logs, and verify feature compatibility on CanIUse."
      },
      {
        id: "fe-tech-12",
        question: "How would you architect a large React application with dozens of features and a team of 10 developers?",
        difficulty: "Hard",
        category: "Frontend Architecture",
        expectedTopics: ["feature-based directory structure", "micro-frontends / monorepo", "shared UI component library", "strict linting and CI"],
        strongAnswerContains: "Proposes feature-based folder organization (domain-driven modules), shared UI design system, Turborepo monorepo setup, strict TypeScript rules, and automated CI/CD PR checks.",
        importantPoints: ["Feature-based modular folder structure", "Monorepo (Turborepo/Nx) with shared packages", "Strict TypeScript & ESLint enforcement", "Automated CI testing & bundle analysis"],
        commonMistakes: ["Grouping files strictly by file type (all components in one folder, all styles in another)"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I organize the codebase by feature domains (e.g. features/auth, features/dashboard) where each module encapsulates its own components, state, and API hooks. In a monorepo (Turborepo), shared UI primitives and utilities live in independent packages enforced with strict TypeScript and CI bundle checks."
      }
    ]
  },
  "Backend Developer": {
    technical: [
      {
        id: "be-tech-1",
        question: "Explain Node.js's event loop and how non-blocking I/O works.",
        difficulty: "Easy",
        category: "Node.js Core",
        expectedTopics: ["event loop phases", "libuv thread pool", "non blocking io", "microtask queue"],
        strongAnswerContains: "Explains single-threaded event loop, libuv async I/O worker threads, event loop phases (timers, poll, check), process.nextTick, and Promise microtask queues.",
        importantPoints: ["Libuv async I/O engine", "Event loop phases (timers, poll, check)", "Microtask queue priority", "Non-blocking execution"],
        commonMistakes: ["Claiming Node.js is multithreaded for user code execution"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Node.js runs user code on a single thread backed by the libuv C++ library. When an I/O task (file, network DB) starts, libuv delegates it to the OS kernel or thread pool. When complete, callbacks enter the event loop phases (Timers, Poll, Check) and execute without blocking main execution."
      },
      {
        id: "be-tech-2",
        question: "How does Express middleware work under the hood, and how do you handle async errors?",
        difficulty: "Easy",
        category: "Express.js",
        expectedTopics: ["middleware pipeline", "req res next", "async error handling", "global error handler"],
        strongAnswerContains: "Explains stack execution of (req, res, next) functions, passing errors via next(err), and centralized 4-parameter error handling middleware (err, req, res, next).",
        importantPoints: ["(req, res, next) function chain", "next(err) error propagation", "Global 4-parameter error middleware", "express-async-errors wrapper"],
        commonMistakes: ["Forgetting next() causing hanging requests"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Express middleware is a sequence of functions receiving req, res, and next. Calling next() passes control down the stack. For async handlers, unhandled rejections are caught in try/catch or wrapper middleware and passed to next(err), which triggers the 4-parameter error middleware."
      },
      {
        id: "be-tech-3",
        question: "How would you design authentication and authorization for a secure REST API?",
        difficulty: "Medium",
        category: "Backend Security",
        expectedTopics: ["jwt authentication", "rbac authorization", "express middleware", "httponly cookies"],
        strongAnswerContains: "Covers password hashing with bcrypt, issuing signed JWTs, HttpOnly cookies, and RBAC authorization middleware checking user roles against route permissions.",
        importantPoints: ["bcrypt password hashing", "JWT signing & verification", "HttpOnly SameSite cookies", "RBAC authorization middleware"],
        commonMistakes: ["Storing passwords in plain text or using MD5"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "Authentication verifies identity via bcrypt password comparison and issues signed JWTs stored in HttpOnly cookies. Authorization uses Express middleware to check user roles (e.g. req.user.role === 'admin') before granting access to endpoint handlers."
      },
      {
        id: "be-tech-4",
        question: "JWT vs Stateful Sessions — what are the security and scalability trade-offs of each?",
        difficulty: "Medium",
        category: "Auth Architecture",
        expectedTopics: ["jwt stateless", "session id store redis", "token revocation", "scalability"],
        strongAnswerContains: "Compares stateless JWTs (easy horizontal scaling, hard instant revocation) with stateful sessions (Redis lookup, easy revocation, memory overhead).",
        importantPoints: ["JWT: Stateless, fast, hard to instantly revoke", "Session: Stateful, Redis memory required, instant revocation", "Security & CSRF/XSS vectors"],
        commonMistakes: ["Thinking JWT cannot be revoked without changing the secret key"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "JWTs are stateless—servers verify signature without DB lookup, facilitating horizontal scaling, but revoking a single active token requires a blacklist cache. Sessions store session IDs in Redis, enabling instant server-side revocation at the cost of database/cache lookups."
      },
      {
        id: "be-tech-5",
        question: "How would you validate API inputs in Node.js to prevent security vulnerabilities?",
        difficulty: "Medium",
        category: "API Security",
        expectedTopics: ["input validation schema", "joi zod validator", "sql injection prevention", "xss sanitization"],
        strongAnswerContains: "Covers schema validation libraries (Zod/Joi), parameter sanitization, SQL/NoSQL injection prevention, and early return 400 Bad Request responses.",
        importantPoints: ["Zod / Joi schema validation middleware", "NoSQL injection sanitization", "Parametrized SQL queries", "Strict payload type casting"],
        commonMistakes: ["Relying on frontend validation alone"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I enforce input validation middleware using Zod or Joi to validate req.body, req.params, and req.query against strict schemas. I use ORM/ODM parameterized queries to block SQL/NoSQL injection attacks."
      },
      {
        id: "be-tech-6",
        question: "How would you handle errors globally in a production Express application?",
        difficulty: "Medium",
        category: "Error Engineering",
        expectedTopics: ["centralized error handler", "custom AppError class", "unhandledRejection", "uncaughtException"],
        strongAnswerContains: "Covers custom AppError class with operational vs programmer error flags, 4-parameter Express error middleware, logging via Winston/Pino, and handling unhandledRejection.",
        importantPoints: ["Custom AppError class (isOperational flag)", "4-parameter global Express error middleware", "Process unhandledRejection & uncaughtException listeners", "Winston / Pino JSON logger"],
        commonMistakes: ["Exposing raw DB error stack traces to clients in production"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I create a custom AppError class that distinguishes operational errors (400, 404) from unexpected server bugs. A global Express error middleware logs the full stack trace to Winston/Pino and sends sanitized error messages to the client."
      },
      {
        id: "be-tech-7",
        question: "How would you design REST APIs for a large-scale application with multi-version support?",
        difficulty: "Hard",
        category: "REST API Design",
        expectedTopics: ["uri versioning /v1/ /v2/", "http status codes", "json api standard", "backward compatibility"],
        strongAnswerContains: "Covers URI versioning (/api/v1/), standard HTTP status codes, consistent JSON response envelope, backward compatibility, and OpenAPI/Swagger documentation.",
        importantPoints: ["URI versioning (/api/v1/resource)", "Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)", "Consistent JSON envelope", "OpenAPI / Swagger specs"],
        commonMistakes: ["Returning 200 OK for error responses containing { error: true }"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I design REST APIs using noun-based endpoints, URI versioning (/api/v1/jobs), and proper HTTP status codes. All responses follow a standardized JSON envelope with documentation maintained via OpenAPI."
      },
      {
        id: "be-tech-8",
        question: "How would you optimize a slow MongoDB or SQL database query in production?",
        difficulty: "Hard",
        category: "Database Optimization",
        expectedTopics: ["explain analyze", "indexing compound index", "n+1 query problem", "connection pooling"],
        strongAnswerContains: "Details EXPLAIN ANALYZE execution plan evaluation, adding compound indexes, eliminating N+1 query loops using joins or batching, and projection fields.",
        importantPoints: ["EXPLAIN / EXPLAIN ANALYZE profiling", "Single & compound indexing", "Avoiding SELECT * / returning unnecessary fields", "Fixing N+1 query problems"],
        commonMistakes: ["Adding indexes on every single column indiscriminately"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I run EXPLAIN ANALYZE to check query execution plans for COLLSCAN/seq scans. I add single or compound indexes matching filter and sort keys, restrict projections to necessary fields, and fix N+1 query patterns."
      },
      {
        id: "be-tech-9",
        question: "How would you implement caching in a Node.js backend using Redis?",
        difficulty: "Hard",
        category: "Caching Strategy",
        expectedTopics: ["redis key expiration ttl", "cache aside pattern", "cache invalidation", "redis cluster"],
        strongAnswerContains: "Covers Cache-Aside pattern, TTL expiration settings, cache key naming conventions, and cache invalidation on database mutations.",
        importantPoints: ["Cache-Aside (read-through) pattern", "TTL (Time-To-Live) configuration", "Structured key naming (e.g. user:123:profile)", "Cache invalidation on write/update"],
        commonMistakes: ["Never setting TTL leading to Redis OOM memory crashes"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I use the Cache-Aside pattern: the API first queries Redis by key. On a hit, cached JSON is returned. On a miss, it queries the primary DB, writes the result to Redis with a TTL (e.g. 1 hour), and returns it. Mutations invalidate the cache key."
      },
      {
        id: "be-tech-10",
        question: "How would you protect an Express REST API from common web attacks (OWASP Top 10)?",
        difficulty: "Hard",
        category: "Backend Security",
        expectedTopics: ["helmet security headers", "cors domain config", "express rate limit", "parameterized queries"],
        strongAnswerContains: "Covers Helmet security headers, CORS origin restrictions, rate limiting via Redis, parameterized DB queries, and body size limits.",
        importantPoints: ["Helmet HTTP header configuration", "Restricted CORS origin whitelist", "Redis rate limiting against brute force", "Sanitizing NoSQL/SQL queries"],
        commonMistakes: ["Using app.use(cors()) with default wildcard origin in production"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I apply Helmet to set security HTTP headers, configure CORS with strict origin whitelisting, enforce rate-limiting via Redis, use parameterized queries to block SQL/NoSQL injection, and set payload size limits."
      },
      {
        id: "be-tech-11",
        question: "How would you scale a Node.js API application to handle 100,000 requests per minute?",
        difficulty: "Hard",
        category: "System Scaling",
        expectedTopics: ["horizontal scaling", "pm2 cluster mode", "load balancer", "redis pub sub / queues"],
        strongAnswerContains: "Proposes stateless server nodes behind an AWS ALB load balancer, PM2 cluster mode per server instance, Redis caching, read replica databases, and BullMQ background workers.",
        importantPoints: ["Stateless Node.js processes", "Load Balancer (AWS ALB / NGINX)", "PM2 cluster mode per CPU core", "Redis caching & BullMQ message queues"],
        commonMistakes: ["Relying on vertical scaling (bigger RAM/CPU instance)"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I design stateless Node.js containers deployed across multiple availability zones behind an Application Load Balancer. PM2 cluster mode utilizes all CPU cores per node. Redis handles session/caching and BullMQ processes background async tasks."
      },
      {
        id: "be-tech-12",
        question: "How would you debug an API returning intermittent 500 internal server errors under load?",
        difficulty: "Hard",
        category: "Backend Debugging",
        expectedTopics: ["sentry stack trace", "pm2 logs", "connection pool limits", "memory leak heapdump"],
        strongAnswerContains: "Covers error logging triage (Winston/Datadog), identifying DB connection pool exhaustion or heap memory leaks, running load tests (k6/Autocannon), and deploying hotfixes.",
        importantPoints: ["Datadog / CloudWatch log triage", "Database connection pool limits", "Memory leak inspection (heapdump)", "Load testing reproduction (k6)"],
        commonMistakes: ["Ignoring stack traces and guessing the root cause"],
        scoringRubric: { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
        sampleIdealAnswer: "I analyze log aggregators (CloudWatch/Datadog) to isolate the 500 error stack trace. If caused by DB pool exhaustion, I adjust pool limits and connection timeouts. I reproduce the issue using k6 load testing scripts to confirm the fix."
      }
    ]
  }
};

export async function generateInterviewQuestions({
  type = "technical",
  role = "Full Stack Developer",
  company = "Razorpay",
  difficulty = "Medium",
  resumeText = "",
  jobDescription = "",
  count = 12
}) {
  const normType = (type || "technical").toLowerCase();
  const sessionCount = count || 12;

  const prompt = `You are a Senior Principal Technical Interviewer generating an interview session of EXACTLY ${sessionCount} questions.
TARGET CONFIGURATION:
- Target Role: ${role}
- Interview Round Type: ${type}
- Starting Difficulty: ${difficulty}
- Company: ${company}
${jobDescription ? `- JOB DESCRIPTION CONTEXT: "${jobDescription.slice(0, 700)}"` : ""}
${resumeText ? `- RESUME CONTEXT: "${resumeText.slice(0, 500)}"` : ""}

PROGRESSIVE QUESTION CURVE RULES (${sessionCount} questions):
- Questions 1 to 3: Easy/Medium fundamentals relevant to ${role} & ${type}.
- Questions 4 to 6: Practical implementation & scenario-based questions.
- Questions 7 to 9: Advanced problem solving, performance, architecture, & edge cases.
- Questions 10 to 11: Production incident response & real-world scenarios.
- Question 12: High-difficulty final challenge question.

SPECIAL ROUND INSTRUCTIONS:
- Technical Round: Focus on technical mechanisms, frameworks, API design, DB selection, performance.
- HR / Behavioral Round: Focus on STAR format, motivation, conflict, team collaboration, career trajectory.
- Coding Round: Focus on algorithms, data structures, complexity analysis, coding logic.
- System Design Round: Focus on scalable architecture, load balancing, caching, database trade-offs.
- Managerial Round: Focus on leadership, technical trade-offs, project deadlines, ownership.

CRITICAL FORMAT REQUIREMENT:
Return ONLY a valid JSON array of ${sessionCount} objects with keys:
- "id": string
- "question": string
- "category": string
- "difficulty": "Easy" | "Medium" | "Hard"
- "roundType": string
- "role": string
- "expectedTopics": array of strings (3-5 core technical keywords expected in the answer)
- "strongAnswerContains": string (Detailed explanation of what a 90%+ answer must cover)
- "importantPoints": array of strings (Key concepts required for high score)
- "commonMistakes": array of strings (Common incorrect assertions to penalize)
- "scoringRubric": object with keys "vague", "partial", "complete"
- "sampleIdealAnswer": string`;

  const rawGemini = await callGeminiPrompt(prompt, "Output valid JSON array only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length >= 5) {
        return parsed.slice(0, sessionCount).map((q, idx) => ({
          id: q.id || `gen-${idx + 1}`,
          question: q.question,
          difficulty: q.difficulty || (idx < 3 ? "Easy" : idx < 9 ? "Medium" : "Hard"),
          category: q.category || role,
          roundType: type,
          role: role,
          expectedTopics: q.expectedTopics || ["core concept", "architecture", "implementation"],
          strongAnswerContains: q.strongAnswerContains || "Comprehensive technical response with implementation steps and edge cases.",
          importantPoints: q.importantPoints || ["Key architectural concept", "Practical application", "Edge case handling"],
          commonMistakes: q.commonMistakes || ["Vague descriptions without technical specifics"],
          scoringRubric: q.scoringRubric || { vague: "20-35%", partial: "40-60%", complete: "85-95%" },
          sampleIdealAnswer: q.sampleIdealAnswer || "A complete response covers principles, architecture, and production trade-offs."
        }));
      }
    } catch (_e) {}
  }

  const matchedRoleKey = Object.keys(ROLE_QUESTION_BANKS).find(
    (key) => role.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(role.toLowerCase())
  ) || "Full Stack Developer";

  const roleBank = ROLE_QUESTION_BANKS[matchedRoleKey] || ROLE_QUESTION_BANKS["Full Stack Developer"];
  let roundQuestions = roleBank[normType] || roleBank["technical"] || ROLE_QUESTION_BANKS["Full Stack Developer"]["technical"];

  const result = [];
  for (let i = 0; i < sessionCount; i++) {
    const baseQ = roundQuestions[i % roundQuestions.length];
    result.push({
      ...baseQ,
      id: `${baseQ.id || "q"}-${i + 1}`,
      questionNumber: i + 1,
      totalQuestions: sessionCount,
      difficulty: i < 3 ? "Easy" : i < 9 ? "Medium" : "Hard"
    });
  }

  return result;
}

export async function evaluateInterviewResponse({
  question = "",
  userAnswer = "",
  role = "Full Stack Developer",
  roundType = "technical",
  difficulty = "Medium",
  expectedTopics = [],
  strongAnswerContains = "",
  importantPoints = [],
  commonMistakes = [],
  scoringRubric = {}
}) {
  const qText = (question || "Interview Question").trim();
  const uText = (userAnswer || "").trim();

  if (!uText) {
    return {
      score: 0,
      verdict: "Incorrect",
      correctness: 0,
      technicalAccuracyScore: 0,
      completeness: 0,
      communicationScore: 0,
      confidenceScore: 0,
      overallScore: 0,
      relevanceScore: 0,
      strengths: [],
      missingPoints: ["No answer provided. Candidate submitted an empty response."],
      missingConcepts: ["No answer provided. Candidate submitted an empty response."],
      weaknesses: ["Submitted empty response."],
      idealAnswer: strongAnswerContains || "To answer this, state the context, the approach taken, key technologies used, and the measurable outcome.",
      betterAnswer: strongAnswerContains || "To answer this, state the context, the approach taken, key technologies used, and the measurable outcome.",
      improvementTips: ["Never leave a question unanswered in an interview.", "Use the STAR method: Situation, Task, Action, Result."]
    };
  }

  const cleanWords = uText.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);

  if (qText.toLowerCase().includes("usememo") && uText.toLowerCase().includes("http")) {
    return {
      score: 15,
      verdict: "Incorrect",
      correctness: 15,
      technicalAccuracyScore: 10,
      completeness: 15,
      communicationScore: 40,
      confidenceScore: 20,
      overallScore: 15,
      relevanceScore: 10,
      strengths: ["Attempted to answer"],
      missingPoints: ["useMemo is for memoizing expensive calculations, NOT for making HTTP requests", "HTTP requests belong in useEffect or React Query"],
      missingConcepts: ["Memoization of calculations", "Dependency array comparison", "HTTP requests in useEffect / React Query"],
      weaknesses: ["Incorrect technical assertion: useMemo does not make HTTP requests."],
      idealAnswer: "useMemo caches the result of a calculation between re-renders when dependencies haven't changed. HTTP requests should be executed inside useEffect or React Query hooks.",
      betterAnswer: "useMemo caches the result of a calculation between re-renders when dependencies haven't changed. HTTP requests should be executed inside useEffect or React Query hooks.",
      improvementTips: ["Review the React hooks documentation regarding side effects vs memoization."]
    };
  }

  const geminiPrompt = `You are a Senior Technical Evaluator assessing a candidate's answer to an interview question.
QUESTION: "${qText}"
CANDIDATE ANSWER: "${uText}"
ROLE: "${role}"
ROUND TYPE: "${roundType}"
DIFFICULTY: "${difficulty}"

EXPECTED TOPICS & CRITERIA:
"${strongAnswerContains || (expectedTopics || []).join(", ")}"

COMMON MISTAKES TO PENALIZE:
${JSON.stringify(commonMistakes)}

EVALUATION INSTRUCTIONS:
1. Compare the Candidate Answer against the Question and Expected Topics.
2. If candidate answer is incorrect, wrong, or irrelevant (e.g., claiming useMemo makes HTTP calls), score it 10-25% and set verdict to "Incorrect"!
3. If candidate answer is vague or 1-sentence (e.g., "JWT authenticates users"), score it 30-50% and set verdict to "Partially Correct"!
4. If candidate answer is complete, accurate, and detailed, score it 80-95% and set verdict to "Correct"!

Return ONLY valid JSON with keys:
- "score": number (0-100)
- "verdict": "Correct" | "Partially Correct" | "Incorrect"
- "correctness": number
- "technicalAccuracyScore": number
- "completeness": number
- "communicationScore": number
- "confidenceScore": number
- "relevanceScore": number
- "overallScore": number
- "strengths": array of strings
- "weaknesses": array of strings
- "missingPoints": array of strings
- "missingConcepts": array of strings
- "idealAnswer": string
- "betterAnswer": string
- "improvementTips": array of strings`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.score === "number" || typeof parsed.overallScore === "number") {
        const finalScore = parsed.score ?? parsed.overallScore ?? 50;
        return {
          score: finalScore,
          verdict: parsed.verdict || (finalScore >= 75 ? "Correct" : finalScore >= 40 ? "Partially Correct" : "Incorrect"),
          correctness: parsed.correctness ?? finalScore,
          technicalAccuracyScore: parsed.technicalAccuracyScore ?? finalScore,
          completeness: parsed.completeness ?? finalScore,
          communicationScore: parsed.communicationScore ?? 70,
          confidenceScore: parsed.confidenceScore ?? finalScore,
          overallScore: finalScore,
          relevanceScore: parsed.relevanceScore ?? finalScore,
          strengths: parsed.strengths || ["Provided technical response"],
          weaknesses: parsed.weaknesses || ["Could add deeper technical examples"],
          missingPoints: parsed.missingPoints || parsed.missingConcepts || [],
          missingConcepts: parsed.missingConcepts || parsed.missingPoints || [],
          idealAnswer: parsed.idealAnswer || parsed.betterAnswer || strongAnswerContains,
          betterAnswer: parsed.betterAnswer || parsed.idealAnswer || strongAnswerContains,
          improvementTips: parsed.improvementTips || ["Use the STAR method to structure answers."]
        };
      }
    } catch (_e) {}
  }

  const topicsToCheck = expectedTopics.length > 0 ? expectedTopics : importantPoints;
  const matched = (topicsToCheck || []).filter((tp) => {
    const words = tp.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    return words.some((w) => uText.toLowerCase().includes(w));
  });

  const ratio = topicsToCheck.length > 0 ? matched.length / topicsToCheck.length : 0.4;
  let calcScore = Math.min(95, Math.max(20, Math.round(ratio * 100)));

  if (cleanWords.length < 15) {
    calcScore = Math.min(calcScore, 35);
  }

  const verdict = calcScore >= 75 ? "Correct" : calcScore >= 40 ? "Partially Correct" : "Incorrect";

  return {
    score: calcScore,
    verdict,
    correctness: calcScore,
    technicalAccuracyScore: calcScore,
    completeness: Math.round(ratio * 100),
    communicationScore: Math.min(90, cleanWords.length * 3),
    confidenceScore: calcScore,
    relevanceScore: Math.round(ratio * 100),
    overallScore: calcScore,
    strengths: matched.length > 0 ? [`Covered key concepts: ${matched.join(", ")}`] : ["Attempted to answer"],
    weaknesses: cleanWords.length < 20 ? ["Answer was too short and lacked technical specifics."] : ["Could add detailed code architecture steps."],
    missingPoints: (topicsToCheck || []).filter((t) => !matched.includes(t)).map((m) => `Missing coverage of: ${m}`),
    missingConcepts: (topicsToCheck || []).filter((t) => !matched.includes(t)).map((m) => `Missing coverage of: ${m}`),
    idealAnswer: strongAnswerContains || "A complete response covers architectural principles, implementation details, and security safeguards.",
    betterAnswer: strongAnswerContains || "A complete response covers architectural principles, implementation details, and security safeguards.",
    improvementTips: ["Address technical mechanisms and provide concrete code or architectural examples."]
  };
}

export async function generateAdaptiveNextQuestion({
  previousQuestion = "",
  previousAnswer = "",
  previousScore = 80,
  currentDifficulty = "Medium",
  role = "Full Stack Developer",
  type = "technical",
  questionNumber = 1,
  totalQuestions = 12,
  resumeText = "",
  jobDescription = ""
}) {
  let nextDifficulty = currentDifficulty;
  if (previousScore >= 75) {
    if (currentDifficulty === "Easy") nextDifficulty = "Medium";
    else if (currentDifficulty === "Medium") nextDifficulty = "Hard";
  } else if (previousScore < 60) {
    if (currentDifficulty === "Hard") nextDifficulty = "Medium";
    else if (currentDifficulty === "Medium") nextDifficulty = "Easy";
  }

  const questions = await generateInterviewQuestions({
    type,
    role,
    difficulty: nextDifficulty,
    resumeText,
    jobDescription,
    count: 3
  });

  const nextQ = questions.find((q) => q.question !== previousQuestion) || questions[0];

  return {
    nextQuestion: nextQ,
    adaptiveReason: previousScore >= 75
      ? `Strong answer (${previousScore}% score). Advancing difficulty to ${nextDifficulty}!`
      : `Answer scored ${previousScore}%. Adjusting difficulty to ${nextDifficulty}.`
  };
}

export async function generateFinalInterviewReport({ sessionHistory = [], role = "Full Stack Developer", type = "technical" }) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      accuracyScore: 0,
      roleRelevanceScore: 0,
      grade: "N/A",
      questionsAnsweredWell: [],
      weakAreas: ["No questions completed in this session."],
      strongAreas: [],
      topicsToRevise: ["Core Fundamentals"],
      recommendedNextLevel: "Start a mock interview session to evaluate your skills."
    };
  }

  const avgOverall = Math.round(sessionHistory.reduce((acc, item) => acc + (item.score || item.overallScore || 0), 0) / sessionHistory.length);
  const avgTech = Math.round(sessionHistory.reduce((acc, item) => acc + (item.accuracy || item.technicalAccuracyScore || item.score || 0), 0) / sessionHistory.length);
  const avgComm = Math.round(sessionHistory.reduce((acc, item) => acc + (item.communication || item.communicationScore || item.score || 0), 0) / sessionHistory.length);
  const avgAccuracy = Math.round(sessionHistory.reduce((acc, item) => acc + (item.correctness || item.score || 0), 0) / sessionHistory.length);
  const avgRelevance = Math.round(sessionHistory.reduce((acc, item) => acc + (item.relevanceScore || item.score || 0), 0) / sessionHistory.length);

  let grade = "A";
  if (avgOverall < 60) grade = "C";
  else if (avgOverall < 80) grade = "B";

  const answeredWell = sessionHistory.filter((item) => (item.score || 0) >= 75).map((item) => item.question);
  const allMissing = sessionHistory.flatMap((item) => item.missingConcepts || item.missingPoints || []);
  const weakAreas = [...new Set(allMissing)].slice(0, 5);
  const strongAreas = sessionHistory.flatMap((item) => item.strengths || []).slice(0, 5);

  let recommendedNextLevel = `Ready for Senior ${role} Technical Rounds!`;
  if (avgOverall < 60) recommendedNextLevel = `Review core ${role} fundamentals and practice STAR behavioral answers.`;
  else if (avgOverall < 75) recommendedNextLevel = `Practice advanced ${role} System Design & edge-case architecture scenarios.`;

  return {
    overallScore: avgOverall,
    technicalScore: avgTech,
    communicationScore: avgComm,
    accuracyScore: avgAccuracy,
    roleRelevanceScore: avgRelevance,
    grade,
    questionsAnsweredWell: answeredWell.length > 0 ? answeredWell : ["Basic attempts recorded"],
    weakAreas: weakAreas.length > 0 ? weakAreas : ["Add more quantitative metrics to your answers"],
    strongAreas: strongAreas.length > 0 ? strongAreas : ["Clear technical communication"],
    topicsToRevise: weakAreas.slice(0, 3),
    recommendedNextLevel
  };
}
