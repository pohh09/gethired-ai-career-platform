export interface DemoJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  color: string;
  location: string;
  type: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  salary: string;
  experience: string;
  postedDate: string;
  tags: string[];
  description: string;
  requirements: string[];
  matchScore: number;
  featured?: boolean;
}

export interface DemoApplication {
  id: string;
  company: string;
  role: string;
  logo: string;
  color: string;
  status: "saved" | "applied" | "interview" | "offer" | "rejected";
  appliedDate: string;
  location: string;
  salary: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  nextStep?: string;
  interviewDate?: string;
  notes?: string;
  matchScore: number;
}

export const DEMO_USER = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  title: "Senior Full Stack & React Engineer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  location: "Bangalore, India",
  experience: "5+ Years",
  skills: ["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "Tailwind CSS", "MongoDB", "PostgreSQL", "Docker", "AWS"],
};

export const DEMO_METRICS = {
  totalApplications: 42,
  activeInterviews: 8,
  offersReceived: 2,
  atsScore: 94,
  responseRate: "38%",
  avgSalaryRange: "₹32L - ₹45L",
  interviewPassRate: "75%",
  conversionRate: 19,
  avgResponseDays: 3,
};

export const DEMO_UPCOMING_INTERVIEWS = [
  {
    id: "int-1",
    company: "Stripe",
    role: "Senior Frontend Architect",
    date: "Tomorrow",
    time: "10:00 AM IST",
    type: "Technical System Design",
    interviewer: "Sarah Chen (Staff Engineer)",
    status: "Confirmed",
    color: "bg-indigo-600",
    link: "https://meet.google.com/demo-stripe-round",
  },
  {
    id: "int-2",
    company: "Razorpay",
    role: "Engineering Lead (Core Payments)",
    date: "Friday",
    time: "03:00 PM IST",
    type: "Hiring Manager & System Architecture",
    interviewer: "Vikram Malhotra (VP of Engineering)",
    status: "Confirmed",
    color: "bg-blue-600",
    link: "https://meet.google.com/demo-razorpay-round",
  },
  {
    id: "int-3",
    company: "Google",
    role: "Senior Software Engineer (Cloud Platform)",
    date: "Next Monday",
    time: "11:30 AM IST",
    type: "Coding & Algorithms Round 2",
    interviewer: "David Miller (Principal Engineer)",
    status: "Scheduled",
    color: "bg-emerald-600",
    link: "https://meet.google.com/demo-google-round",
  },
  {
    id: "int-4",
    company: "Swiggy",
    role: "Staff Software Engineer",
    date: "Next Wednesday",
    time: "02:00 PM IST",
    type: "Executive Leadership & Values Fit",
    interviewer: "Ananya Roy (Director of Engineering)",
    status: "Scheduled",
    color: "bg-amber-600",
    link: "https://meet.google.com/demo-swiggy-round",
  },
];

export const DEMO_JOBS: DemoJob[] = [
  {
    id: "job-1",
    title: "Senior Frontend Architect",
    company: "Stripe",
    logo: "ST",
    color: "bg-indigo-600",
    location: "Bangalore, India",
    type: "Full-time",
    workplaceType: "Hybrid",
    salary: "₹38L - ₹52L LPA",
    experience: "5-8 Years",
    postedDate: "2 days ago",
    tags: ["React", "TypeScript", "Micro-Frontends", "Web Vitals", "GraphQL"],
    description:
      "Stripe is looking for a Senior Frontend Architect to lead our global dashboard infrastructure. You will design ultra-responsive web experiences, optimize real-time billing visualization, and mentor high-performing engineering squads.",
    requirements: [
      "5+ years building large-scale React applications with TypeScript",
      "Deep understanding of frontend performance, bundle optimization, and Core Web Vitals",
      "Experience with state orchestration (Zustand, Redux, React Query)",
      "Strong background in design systems and accessible UI components (a11y)",
    ],
    matchScore: 96,
    featured: true,
  },
  {
    id: "job-2",
    title: "Engineering Lead (Payments Platform)",
    company: "Razorpay",
    logo: "RP",
    color: "bg-blue-600",
    location: "Bangalore, India",
    type: "Full-time",
    workplaceType: "Hybrid",
    salary: "₹35L - ₹48L LPA",
    experience: "6-9 Years",
    postedDate: "3 days ago",
    tags: ["Node.js", "React", "Distributed Systems", "PostgreSQL", "Redis"],
    description:
      "Join Razorpay's high-throughput payment orchestration team. You will lead a squad of 8 engineers architecting microservices that process tens of millions of financial transactions daily with 99.999% uptime.",
    requirements: [
      "Extensive experience building resilient Node.js / Go backend microservices",
      "Experience in database partitioning, Redis caching, and Kafka/RabbitMQ message queues",
      "Strong understanding of full-stack TypeScript architectures",
      "Demonstrated track record of technical leadership and cross-functional delivery",
    ],
    matchScore: 94,
    featured: true,
  },
  {
    id: "job-3",
    title: "Senior Full Stack Engineer",
    company: "Atlassian",
    logo: "AT",
    color: "bg-blue-500",
    location: "Remote (India)",
    type: "Full-time",
    workplaceType: "Remote",
    salary: "₹40L - ₹55L LPA",
    experience: "4-7 Years",
    postedDate: "1 day ago",
    tags: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    description:
      "Atlassian is hiring a Senior Full Stack Engineer for Jira Cloud ecosystem. You will craft fluid collaboration workflows, build extensible plugin APIs, and optimize latency across global distributed regions.",
    requirements: [
      "Proficiency in modern React, TypeScript, GraphQL, and Node.js microservices",
      "Experience deploying cloud workloads on AWS (ECS, Lambda, CloudFront)",
      "Passion for developer tooling, test automation, and CI/CD pipelines",
      "Excellent communication and async collaboration in remote-first teams",
    ],
    matchScore: 92,
    featured: true,
  },
  {
    id: "job-4",
    title: "Staff Software Engineer (Consumer Tech)",
    company: "Swiggy",
    logo: "SW",
    color: "bg-amber-600",
    location: "Bangalore, India",
    type: "Full-time",
    workplaceType: "Hybrid",
    salary: "₹45L - ₹60L LPA",
    experience: "7-10 Years",
    postedDate: "4 days ago",
    tags: ["System Design", "React", "Node.js", "Kafka", "Microservices"],
    description:
      "Architect Swiggy's next-generation customer ordering and real-time delivery tracking platform. Handle hundreds of thousands of concurrent requests per second during peak hours with sub-50ms latency.",
    requirements: [
      "7+ years architecting high-scale distributed systems in consumer technology",
      "Deep expertise in event-driven architectures, Kafka streaming, and caching layers",
      "Mastery of frontend and backend system design tradeoffs",
      "Ability to define multi-year technical roadmaps and mentor senior engineers",
    ],
    matchScore: 90,
  },
  {
    id: "job-5",
    title: "Senior Software Engineer (Google Cloud)",
    company: "Google",
    logo: "GO",
    color: "bg-emerald-600",
    location: "Hyderabad / Bangalore",
    type: "Full-time",
    workplaceType: "Hybrid",
    salary: "₹45L - ₹65L LPA",
    experience: "4-8 Years",
    postedDate: "5 days ago",
    tags: ["Go", "TypeScript", "Kubernetes", "Distributed Systems", "GCP"],
    description:
      "Google Cloud is seeking engineers to build developer tooling and enterprise telemetry visualization for Kubernetes clusters and serverless platforms globally.",
    requirements: [
      "Strong CS fundamentals: algorithms, data structures, and concurrency",
      "Proficiency in Go, Java, or TypeScript",
      "Experience with Kubernetes, Docker, and distributed storage engines",
      "Experience building enterprise developer dashboards",
    ],
    matchScore: 89,
  },
  {
    id: "job-6",
    title: "Full Stack Engineer (Azure Developer Tools)",
    company: "Microsoft",
    logo: "MS",
    color: "bg-cyan-600",
    location: "Hyderabad, India",
    type: "Full-time",
    workplaceType: "Hybrid",
    salary: "₹36L - ₹50L LPA",
    experience: "3-6 Years",
    postedDate: "1 week ago",
    tags: ["TypeScript", "React", "C#", ".NET Core", "Azure"],
    description:
      "Empower millions of developers around the world with intelligent cloud management tools, VS Code integrations, and automated deployment pipelines.",
    requirements: [
      "Solid knowledge of TypeScript, React, and backend services (Node.js or .NET Core)",
      "Understanding of RESTful APIs, OpenAPI standards, and GraphQL",
      "Passionate about developer productivity and automated testing",
    ],
    matchScore: 88,
  },
  {
    id: "job-7",
    title: "Frontend Infrastructure Engineer",
    company: "Vercel",
    logo: "VC",
    color: "bg-slate-900",
    location: "Remote",
    type: "Full-time",
    workplaceType: "Remote",
    salary: "$140,000 - $180,000 / yr",
    experience: "4-7 Years",
    postedDate: "3 days ago",
    tags: ["Next.js", "React", "Edge Computing", "TypeScript", "Rust"],
    description:
      "Build the web framework and edge runtime that powers the modern web. Optimize server-side rendering, streaming responses, and asset compilation for Next.js.",
    requirements: [
      "Expertise in Next.js internal rendering pipelines (App Router, Server Components)",
      "Strong understanding of V8 runtime, edge functions, and WASM",
      "Open-source contributions and active community presence",
    ],
    matchScore: 95,
  },
  {
    id: "job-8",
    title: "Product Engineer (Workflow Automation)",
    company: "Linear",
    logo: "LN",
    color: "bg-purple-700",
    location: "Remote",
    type: "Full-time",
    workplaceType: "Remote",
    salary: "$150,000 - $190,000 / yr",
    experience: "5-8 Years",
    postedDate: "6 days ago",
    tags: ["React", "TypeScript", "GraphQL", "WebSockets", "IndexedDB"],
    description:
      "Linear builds tools for high-performing software teams. Help craft the world's fastest, keyboard-first issue tracker and project management platform with offline-first synchronization.",
    requirements: [
      "Obsessive attention to UI detail, 60fps animations, and keyboard shortcuts",
      "Experience with optimistic UI updates, WebSockets, and offline-first IndexedDB storage",
      "Full-stack proficiency with TypeScript, React, and Node.js",
    ],
    matchScore: 93,
  },
  {
    id: "job-9",
    title: "Senior Backend Engineer (Rider Tech)",
    company: "Uber",
    logo: "UB",
    color: "bg-slate-800",
    location: "Bangalore, India",
    type: "Full-time",
    workplaceType: "Hybrid",
    salary: "₹38L - ₹54L LPA",
    experience: "4-7 Years",
    postedDate: "1 week ago",
    tags: ["Go", "Java", "Microservices", "Kafka", "Cassandra"],
    description:
      "Power real-time dispatch, dynamic pricing, and trip matching engines handling billions of rides worldwide each year.",
    requirements: [
      "Deep understanding of distributed consensus, sharding, and high-throughput databases",
      "Strong experience with Go, Java, or Node.js in cloud environments",
      "Experience with real-time geospatial processing is a plus",
    ],
    matchScore: 87,
  },
  {
    id: "job-10",
    title: "Senior Full Stack Engineer (Guest Experience)",
    company: "Airbnb",
    logo: "AB",
    color: "bg-rose-600",
    location: "Remote / Hybrid",
    type: "Full-time",
    workplaceType: "Remote",
    salary: "₹42L - ₹58L LPA",
    experience: "5-8 Years",
    postedDate: "2 weeks ago",
    tags: ["React", "TypeScript", "Node.js", "GraphQL", "Accessibility"],
    description:
      "Shape how millions of travelers discover unique homes and experiences around the world. Build dynamic booking flows and rich multi-media trip planners.",
    requirements: [
      "Expertise in React, TypeScript, and modern frontend architecture",
      "Experience writing robust GraphQL schema stitching and backend resolvers",
      "Commitment to high accessibility standards and internationalization",
    ],
    matchScore: 91,
  },
];

export const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    id: "app-1",
    company: "Stripe",
    role: "Senior Frontend Architect",
    logo: "ST",
    color: "bg-indigo-600",
    status: "interview",
    appliedDate: "Aug 02, 2026",
    location: "Bangalore (Hybrid)",
    salary: "₹38L - ₹52L",
    workplaceType: "Hybrid",
    nextStep: "System Design Round (Tomorrow 10:00 AM)",
    interviewDate: "Tomorrow, 10:00 AM",
    notes: "Passed recruiter screen with flying colors. Emphasize React 19 concurrent features and Web Vitals.",
    matchScore: 96,
  },
  {
    id: "app-2",
    company: "Razorpay",
    role: "Engineering Lead (Payments)",
    logo: "RP",
    color: "bg-blue-600",
    status: "interview",
    appliedDate: "Aug 04, 2026",
    location: "Bangalore",
    salary: "₹35L - ₹48L",
    workplaceType: "Hybrid",
    nextStep: "Hiring Manager Round (Friday 3:00 PM)",
    interviewDate: "Friday, 3:00 PM",
    notes: "Review microservice idempotency patterns and distributed transaction rollback handling.",
    matchScore: 94,
  },
  {
    id: "app-3",
    company: "Google",
    role: "Senior Software Engineer",
    logo: "GO",
    color: "bg-emerald-600",
    status: "interview",
    appliedDate: "Jul 28, 2026",
    location: "Bangalore",
    salary: "₹45L - ₹65L",
    workplaceType: "Hybrid",
    nextStep: "Coding Round 2 (Next Monday)",
    interviewDate: "Next Monday, 11:30 AM",
    notes: "Completed initial phone screen. Practice dynamic programming and graph traversals.",
    matchScore: 89,
  },
  {
    id: "app-4",
    company: "Atlassian",
    role: "Senior Full Stack Engineer",
    logo: "AT",
    color: "bg-blue-500",
    status: "offer",
    appliedDate: "Jul 15, 2026",
    location: "Remote",
    salary: "₹48,00,000 / yr + ₹12L Equity",
    workplaceType: "Remote",
    nextStep: "Review Offer Contract & Benefits Package",
    notes: "Official offer received! Base: ₹48L + ₹12L RSU grant + ₹5L joining bonus. Decision deadline Aug 25.",
    matchScore: 92,
  },
  {
    id: "app-5",
    company: "Vercel",
    role: "Frontend Infrastructure Engineer",
    logo: "VC",
    color: "bg-slate-900",
    status: "offer",
    appliedDate: "Jul 18, 2026",
    location: "Remote",
    salary: "$165,000 / yr + Stock Options",
    workplaceType: "Remote",
    nextStep: "Negotiate Equity & Signing Bonus",
    notes: "Exceptional team feedback from VP of Eng. Offer letter signed digitally for consideration.",
    matchScore: 95,
  },
  {
    id: "app-6",
    company: "Swiggy",
    role: "Staff Software Engineer",
    logo: "SW",
    color: "bg-amber-600",
    status: "applied",
    appliedDate: "Aug 10, 2026",
    location: "Bangalore",
    salary: "₹45L - ₹60L",
    workplaceType: "Hybrid",
    nextStep: "Waiting for Recruiter Resume Review",
    notes: "Referred by Staff Engineer on the Consumer Orders team. Strong keyword match.",
    matchScore: 90,
  },
  {
    id: "app-7",
    company: "Uber",
    role: "Senior Backend Engineer",
    logo: "UB",
    color: "bg-slate-800",
    status: "applied",
    appliedDate: "Aug 08, 2026",
    location: "Bangalore",
    salary: "₹38L - ₹54L",
    workplaceType: "Hybrid",
    nextStep: "Application Under Review",
    notes: "Applied via GetHired automated tailored cover letter workflow.",
    matchScore: 87,
  },
  {
    id: "app-8",
    company: "Airbnb",
    role: "Senior Full Stack Engineer",
    logo: "AB",
    color: "bg-rose-600",
    status: "applied",
    appliedDate: "Aug 06, 2026",
    location: "Remote",
    salary: "₹42L - ₹58L",
    workplaceType: "Remote",
    nextStep: "Recruiter Phone Screen Scheduled",
    notes: "Highlighted guest checkout experience and GraphQL API performance optimizations.",
    matchScore: 91,
  },
  {
    id: "app-9",
    company: "Microsoft",
    role: "Full Stack Engineer (Azure)",
    logo: "MS",
    color: "bg-cyan-600",
    status: "saved",
    appliedDate: "Aug 12, 2026",
    location: "Hyderabad",
    salary: "₹36L - ₹50L",
    workplaceType: "Hybrid",
    nextStep: "Tailor STAR resume bullets before submitting",
    notes: "Good alignment with React and cloud tooling background.",
    matchScore: 88,
  },
  {
    id: "app-10",
    company: "Linear",
    role: "Product Engineer",
    logo: "LN",
    color: "bg-purple-700",
    status: "saved",
    appliedDate: "Aug 13, 2026",
    location: "Remote",
    salary: "$150,000 - $190,000",
    workplaceType: "Remote",
    nextStep: "Submit video intro & portfolio project",
    notes: "Prepare offline synchronization case study and keyboard shortcut architecture demo.",
    matchScore: 93,
  },
  {
    id: "app-11",
    company: "Meta",
    role: "Senior Frontend Engineer (Instagram)",
    logo: "ME",
    color: "bg-blue-600",
    status: "rejected",
    appliedDate: "Jun 12, 2026",
    location: "London / Remote",
    salary: "£110,000 - £140,000",
    workplaceType: "Remote",
    nextStep: "Re-apply eligible in 6 months",
    notes: "Position closed due to team headcount freeze. Good recruiter rapport maintained.",
    matchScore: 86,
  },
  {
    id: "app-12",
    company: "Amazon",
    role: "Software Development Engineer II",
    logo: "AZ",
    color: "bg-amber-700",
    status: "rejected",
    appliedDate: "May 20, 2026",
    location: "Hyderabad",
    salary: "₹32L - ₹44L",
    workplaceType: "On-site",
    nextStep: "Archived",
    notes: "Decided to prioritize remote/hybrid roles with higher React/Node focus.",
    matchScore: 84,
  },
];

export const DEMO_RESUME_TEXT = `ALEX JOHNSON
Senior Full Stack & React Engineer | Bangalore, India | alex.johnson@example.com | +91 98765 43210 | github.com/pooj0901

PROFESSIONAL SUMMARY
Senior Full Stack Developer with 5+ years of experience engineering high-performance web applications, distributed microservices, and modern user interfaces. Expert in React, TypeScript, Node.js, Next.js, and cloud architectures. Proven track record improving Core Web Vitals, scaling API throughput by 45%, and architecting mission-critical SaaS platforms.

CORE TECHNICAL SKILLS
• Frontend: React 19, TypeScript, Next.js (App Router), Redux Toolkit, Zustand, TanStack Query, Tailwind CSS, Framer Motion, Webpack/Vite
• Backend: Node.js, Express.js, GraphQL, RESTful APIs, Python, Microservices, Redis Caching, RabbitMQ
• Databases: MongoDB, PostgreSQL, Mongoose, Prisma ORM, Redis
• DevOps & Cloud: AWS (ECS, S3, CloudFront, Lambda), Docker, CI/CD GitHub Actions, Nginx, Jest, Playwright
• Architecture: Distributed Systems, REST & GraphQL API Design, Clean Code, Micro-Frontends, OAuth2/JWT Security

PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer — TechNova Labs (2022 – Present)
• Architected enterprise SaaS dashboard serving 150,000+ daily active users with 99.98% uptime SLA.
• Optimized React rendering pipelines and micro-frontends, cutting Largest Contentful Paint (LCP) from 3.2s to 1.1s (65% improvement).
• Designed resilient Node.js microservices with Redis sliding window caching, reducing database load by 48% under 15k RPS spikes.
• Led engineering migration from legacy monolith to modular React + TypeScript architecture with 100% type safety.
• Mentored squad of 6 frontend and backend engineers, conducting weekly architectural design reviews.

Full Stack Developer — PixelForge Systems (2020 – 2022)
• Developed responsive financial analytics portal featuring interactive chart visualizations and real-time WebSocket ticker updates.
• Implemented JWT token verification middleware, bcrypt password hashing, and role-based access control (RBAC).
• Automated deployment workflows with GitHub Actions CI/CD, reducing production release times from 40 mins to 6 mins.
• Wrote automated unit and integration tests using Jest and React Testing Library, achieving 88% code test coverage.

EDUCATION & CERTIFICATIONS
• Bachelor of Technology (B.Tech) in Computer Science & Engineering — 2020 (CGPA: 8.9/10)
• AWS Certified Solutions Architect – Associate (2023)
• Meta Certified Frontend Developer Specialist (2022)`;

export const DEMO_ATS_AUDIT = {
  atsScore: 94,
  overallGrade: "A+",
  summary:
    "Exceptional candidate profile with strong quantifiable achievements, modern tech stack coverage, and optimal ATS structural formatting. Keywords and metrics demonstrate senior-level impact.",
  sectionBySection: {
    summary: { score: 96, feedback: "Concise, value-driven summary highlighting core specializations and metrics." },
    experience: { score: 95, feedback: "Strong action verbs and clear metric-driven business outcomes (e.g. 65% LCP speedup, 48% DB load drop)." },
    skills: { score: 98, feedback: "Extensive keyword coverage matching Senior Full Stack and Architect specifications." },
    education: { score: 92, feedback: "Clean layout with degree, university, and current cloud certifications." },
  },
  keywordAnalysis: {
    foundKeywords: ["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "Tailwind CSS", "Redux", "Zustand", "Redis", "Jest", "AWS", "Microservices", "REST APIs"],
    missingKeywords: ["Docker", "Kubernetes", "AWS ECS", "Kafka"],
  },
  strengths: [
    "Quantified business results across all professional positions (LCP 65% faster, 15k RPS handling)",
    "Strong technical breadth spanning frontend architecture, distributed backend services, and cloud tools",
    "Clean standard ATS heading hierarchy and ATS-parsable font structures",
  ],
  missingKeywords: ["Docker", "Kubernetes", "Kafka"],
  actionPlan: [
    "Explicitly mention Docker containerization for your microservices in the TechNova experience section.",
    "Add distributed event streaming (Kafka/RabbitMQ) to your system architecture bullet points.",
    "Include high-level system design achievements to strengthen Staff Engineer eligibility.",
  ],
};

export const DEMO_CHAT_MESSAGES = [
  {
    id: "m-1",
    sender: "assistant" as const,
    text: "Hi Alex! 👋 I'm your AI Career Coach. I've audited your resume (94% ATS score) and analyzed your 8 active interview pipelines. How can I help you today?",
    timestamp: "10:00 AM",
  },
  {
    id: "m-2",
    sender: "user" as const,
    text: "Analyze my resume for the Stripe Senior Frontend Architect position.",
    timestamp: "10:02 AM",
  },
  {
    id: "m-3",
    sender: "assistant" as const,
    text: "Your resume matches 96% of Stripe's requirements! 🚀\n\nKey Strengths:\n• LCP optimization from 3.2s to 1.1s aligns perfectly with Stripe's obsession with sub-second performance.\n• Deep React 19, TypeScript, and micro-frontend architecture experience.\n\nRecommended Tweaks:\n• Highlight design system accessibility (WCAG AAA compliance).\n• Mention GraphQL caching strategies with Apollo / TanStack Query.",
    timestamp: "10:02 AM",
  },
  {
    id: "m-4",
    sender: "user" as const,
    text: "Can you rewrite my microservices bullet point in STAR format?",
    timestamp: "10:05 AM",
  },
  {
    id: "m-5",
    sender: "assistant" as const,
    text: "✨ Here is your STAR-optimized bullet point:\n\n\"Architected distributed Node.js microservices with Redis sliding-window caching, scaling system throughput to 15,000 RPS while reducing database latency by 48% during peak payment transaction events.\"",
    timestamp: "10:05 AM",
  },
];
