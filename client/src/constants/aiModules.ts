import type { AIModuleCategory } from "../types/aiWorkspace";

export const AI_MODULE_CATEGORIES: AIModuleCategory[] = [
  {
    id: "resume",
    title: "Resume",
    subtitle: "Analyzer, ATS Score, Builder, Optimizer & Tailoring",
    description:
      "Analyze layout, simulate ATS scores across Greenhouse/Lever, rewrite bullet points, and build custom resume versions.",
    iconName: "FileText",
    badge: "Essential",
    color: "blue",
    gradient: "from-blue-600 to-indigo-600",
    suggestedActions: [
      { label: "Analyze my resume", toolId: "resume-analyzer" },
      { label: "Check ATS score", toolId: "ats-score" },
      { label: "Tailor resume for job", toolId: "resume-tailor" },
    ],
    tools: [
      {
        id: "resume-analyzer",
        name: "Resume Analyzer",
        description:
          "Comprehensive audit of structural layout, formatting, impact metrics, and language style.",
        category: "Resume",
        moduleId: "resume",
        iconName: "FileCheck",
        badge: "Popular",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Paste Resume Text",
          primaryPlaceholder:
            "Paste resume content for an instant deep structural audit...",
        },
      },
      {
        id: "ats-score",
        name: "ATS Score Checker",
        description:
          "Simulate ATS parser scoring across Greenhouse, Lever, and Workday recruitment systems.",
        category: "Resume",
        moduleId: "resume",
        iconName: "Gauge",
        badge: "High Accuracy",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Resume Text",
          primaryPlaceholder:
            "Paste your resume text to evaluate ATS readability...",
          secondaryLabel: "Target Role / Job Title",
          secondaryPlaceholder: "e.g. Senior Frontend Engineer",
        },
      },
      {
        id: "resume-builder",
        name: "Resume Content Builder",
        description:
          "Generate executive summary statements, technical skill taxonomies, and project sections.",
        category: "Resume",
        moduleId: "resume",
        iconName: "PenTool",
        badge: "Quick",
        isFavorite: false,
        inputPlaceholders: {
          primaryLabel: "Target Role & Experience Summary",
          primaryPlaceholder:
            "e.g. 4 years Full Stack React & Node.js experience...",
        },
      },
      {
        id: "resume-optimizer",
        name: "Resume Bullet Optimizer",
        description:
          "Transform plain bullet points into metric-driven quantitative STAR statements.",
        category: "Resume",
        moduleId: "resume",
        iconName: "Sparkles",
        badge: "AI Rewriter",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Bullet Points to Rewrite",
          primaryPlaceholder:
            "e.g. Worked on React components and fixed bugs...",
        },
      },
      {
        id: "resume-tailor",
        name: "Tailor Resume for Job",
        description:
          "Inject target job keywords and match requirements for maximum interview callback rate.",
        category: "Resume",
        moduleId: "resume",
        iconName: "Target",
        badge: "Smart Tailor",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Target Job Description",
          primaryPlaceholder:
            "Paste target job description to match resume keywords...",
        },
      },
      {
        id: "resume-import",
        name: "Import Resume PDF/Doc",
        description:
          "Extract sections from PDF/Word resumes into GetHired AI workspace.",
        category: "Resume",
        moduleId: "resume",
        iconName: "Upload",
        badge: "Import",
        isFavorite: false,
      },
      {
        id: "resume-export",
        name: "Export Resume Version",
        description:
          "Export clean ATS-friendly formatted markdown or text versions.",
        category: "Resume",
        moduleId: "resume",
        iconName: "Download",
        badge: "Export",
        isFavorite: false,
      },
    ],
  },
  {
    id: "jobs",
    title: "Jobs",
    subtitle: "Job Match Score, Analyzer, Skill Gaps & Company Research",
    description:
      "Calculate job fit percentage, breakdown skill demands, pinpoint missing qualifications, and research prospective employers.",
    iconName: "Briefcase",
    badge: "Smart Match",
    color: "purple",
    gradient: "from-purple-600 to-pink-600",
    suggestedActions: [
      { label: "Calculate job match score", toolId: "job-match" },
      { label: "Analyze job description", toolId: "job-analyzer" },
      { label: "Find skill gaps", toolId: "skill-gap" },
    ],
    tools: [
      {
        id: "job-match",
        name: "Job Match Score",
        description:
          "Calculate exact percentage match between your profile and any target job posting.",
        category: "Jobs",
        moduleId: "jobs",
        iconName: "Target",
        badge: "Must Have",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Job Description",
          primaryPlaceholder: "Paste target job posting text...",
          secondaryLabel: "Your Resume or Skills",
          secondaryPlaceholder: "Paste your resume or skills summary...",
        },
      },
      {
        id: "job-analyzer",
        name: "Job Description Analyzer",
        description:
          "Uncover key skill demands, hidden flags, compensation notes, and tech stack details.",
        category: "Jobs",
        moduleId: "jobs",
        iconName: "SearchCheck",
        badge: "Deep Insights",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Job Description Text",
          primaryPlaceholder: "Paste full job posting description...",
        },
      },
      {
        id: "skill-gap",
        name: "Skill Gap Analysis",
        description:
          "Identify frameworks, tools, or certifications needed to qualify for target roles.",
        category: "Jobs",
        moduleId: "jobs",
        iconName: "CheckSquare",
        badge: "Recommended",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Target Role or Job Description",
          primaryPlaceholder: "Target role title or job posting...",
        },
      },
      {
        id: "salary-insights",
        name: "Salary Insights",
        description:
          "Benchmark compensation standards for your role, location, and experience level.",
        category: "Jobs",
        moduleId: "jobs",
        iconName: "DollarSign",
        badge: "Market Data",
        isFavorite: false,
        inputPlaceholders: {
          primaryLabel: "Role Title & Location",
          primaryPlaceholder:
            "e.g. Senior Frontend Developer - Bangalore, India",
        },
      },
      {
        id: "company-research",
        name: "Company Research",
        description:
          "Deep dive into company culture, recent funding, interview culture, and tech stack.",
        category: "Jobs",
        moduleId: "jobs",
        iconName: "Building2",
        badge: "Intel",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Target Company Name",
          primaryPlaceholder: "e.g. Razorpay, Swiggy, Zomato, Flipkart...",
        },
      },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    subtitle: "Mock Simulator, Technical, HR & Behavioral Practice",
    description:
      "Simulate real interviews, practice technical coding questions, refine HR answers, and receive instant AI performance feedback.",
    iconName: "Video",
    badge: "Interactive",
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    suggestedActions: [
      { label: "Start mock interview", toolId: "mock-interview" },
      { label: "Prepare React questions", toolId: "technical-interview" },
      { label: "Practice HR answers", toolId: "hr-interview" },
    ],
    tools: [
      {
        id: "mock-interview",
        name: "Mock Interview",
        description:
          "Real-time AI interactive interview simulator tailored to your target company and role.",
        category: "Interview",
        moduleId: "interview",
        iconName: "Video",
        badge: "Interactive",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Role & Target Company",
          primaryPlaceholder: "e.g. Senior React Developer at Razorpay",
        },
      },
      {
        id: "technical-interview",
        name: "Technical Interview",
        description:
          "Coding logic, system design, frontend architecture, and API design interview questions.",
        category: "Interview",
        moduleId: "interview",
        iconName: "Code2",
        badge: "Tech Round",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Tech Stack / Topic",
          primaryPlaceholder:
            "e.g. React 19, TypeScript, System Design, Node.js",
        },
      },
      {
        id: "hr-interview",
        name: "HR Interview",
        description:
          "Prepare structured responses for salary expectations, background, and culture fit questions.",
        category: "Interview",
        moduleId: "interview",
        iconName: "UserCheck",
        badge: "Culture Fit",
        isFavorite: false,
      },
      {
        id: "behavioral-interview",
        name: "Behavioral Interview",
        description:
          "Master STAR method responses for leadership, conflict resolution, and tight deadlines.",
        category: "Interview",
        moduleId: "interview",
        iconName: "Award",
        badge: "STAR Method",
        isFavorite: false,
      },
      {
        id: "ai-interview-feedback",
        name: "AI Interview Feedback",
        description:
          "Instant structural score and constructive feedback on your recorded interview answers.",
        category: "Interview",
        moduleId: "interview",
        iconName: "MessageSquare",
        badge: "Instant Review",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Interview Answer Text",
          primaryPlaceholder:
            "Paste your spoken or written interview answer for instant evaluation...",
        },
      },
    ],
  },
  {
    id: "career",
    title: "Career",
    subtitle: "Roadmap, Portfolio Review, LinkedIn & Recommendations",
    description:
      "Generate strategic career roadmaps, conduct portfolio and LinkedIn audits, and receive tailored upskilling recommendations.",
    iconName: "TrendingUp",
    badge: "Growth",
    color: "emerald",
    gradient: "from-emerald-600 to-teal-600",
    suggestedActions: [
      { label: "Build career roadmap", toolId: "career-roadmap" },
      { label: "Review portfolio", toolId: "portfolio-review" },
      { label: "Review LinkedIn profile", toolId: "linkedin-review" },
    ],
    tools: [
      {
        id: "career-roadmap",
        name: "Career Roadmap",
        description:
          "Personalized 6-month strategic plan to advance from Engineer to Lead/Staff Architect.",
        category: "Career",
        moduleId: "career",
        iconName: "Map",
        badge: "Strategy",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Current Role & Target Goal",
          primaryPlaceholder:
            "e.g. Current: Frontend Developer -> Target: Staff Architect",
        },
      },
      {
        id: "portfolio-review",
        name: "Portfolio Review",
        description:
          "Audit portfolio layout, project README clarity, and open source GitHub code structure.",
        category: "Career",
        moduleId: "career",
        iconName: "Layout",
        badge: "Design & Code",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Portfolio URL or Project List",
          primaryPlaceholder:
            "Paste your portfolio link or list featured projects...",
        },
      },
      {
        id: "linkedin-review",
        name: "LinkedIn Review",
        description:
          "Optimize LinkedIn headline, summary, skills tags, and recruiter discoverability.",
        category: "Career",
        moduleId: "career",
        iconName: "Globe",
        badge: "Branding",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "LinkedIn Headline & About Text",
          primaryPlaceholder: "Paste your current LinkedIn bio or headline...",
        },
      },
      {
        id: "learning-recommendations",
        name: "Learning Recommendations",
        description:
          "Curated learning paths and hands-on project ideas to fill your exact skill gaps.",
        category: "Career",
        moduleId: "career",
        iconName: "BookOpen",
        badge: "Upskill",
        isFavorite: false,
        inputPlaceholders: {
          primaryLabel: "Target Skills to Learn",
          primaryPlaceholder: "e.g. Next.js App Router, Docker, Microservices",
        },
      },
      {
        id: "career-advice",
        name: "Career Advice & Coaching",
        description:
          "Ask open-ended questions about offer negotiation, career pivots, or promotion timing.",
        category: "Career",
        moduleId: "career",
        iconName: "HelpCircle",
        badge: "Coaching",
        isFavorite: true,
        inputPlaceholders: {
          primaryLabel: "Career Question / Scenario",
          primaryPlaceholder:
            "e.g. How should I negotiate between two competing remote offers?",
        },
      },
    ],
  },
];
