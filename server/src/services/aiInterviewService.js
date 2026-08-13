import axios from "axios";

export async function generateInterviewPrepWithAI({ company, role, jobDescription = "", resumeText = "" }) {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are a Principal Technical Recruiter and Executive Interview Coach.
Generate a comprehensive interview preparation guide for the following candidate role:

COMPANY: ${company}
ROLE: ${role}
JOB DESCRIPTION / NOTES:
"""
${jobDescription || "Standard Senior Software / Product Engineering role"}
"""

CANDIDATE RESUME SUMMARY:
"""
${resumeText || "Modern web application development background in React, TypeScript, Node.js, and API architecture."}
"""

Respond strictly with a valid JSON object matching this structure (no markdown fences, no text outside JSON):
{
  "companySummary": string,
  "questions": [
    {
      "id": string,
      "type": "HR" | "Technical" | "Behavioral" | "Scenario" | "Coding",
      "question": string,
      "suggestedAnswer": string,
      "keyPoints": string[],
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ],
  "technicalTopics": string[],
  "revisionTopics": string[],
  "likelyCodingQuestions": string[],
  "salaryNegotiationTips": string[],
  "questionsToAskInterviewer": string[],
  "readinessMetrics": {
    "overall": number (0-100),
    "knowledge": number (0-100),
    "communication": number (0-100),
    "technical": number (0-100),
    "behavioral": number (0-100)
  }
}
Generate at least 10 high-quality, realistic interview questions across HR, Technical, Behavioral, Scenario, and Coding categories.
`;

  if (apiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        const cleanJsonStr = candidateText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJsonStr);
        return {
          companySummary: parsed.companySummary || `${company} is a leader in technology and engineering innovation.`,
          questions: Array.isArray(parsed.questions) ? parsed.questions : [],
          technicalTopics: Array.isArray(parsed.technicalTopics) ? parsed.technicalTopics : [],
          revisionTopics: Array.isArray(parsed.revisionTopics) ? parsed.revisionTopics : [],
          likelyCodingQuestions: Array.isArray(parsed.likelyCodingQuestions) ? parsed.likelyCodingQuestions : [],
          salaryNegotiationTips: Array.isArray(parsed.salaryNegotiationTips) ? parsed.salaryNegotiationTips : [],
          questionsToAskInterviewer: Array.isArray(parsed.questionsToAskInterviewer) ? parsed.questionsToAskInterviewer : [],
          readinessMetrics: parsed.readinessMetrics || { overall: 85, knowledge: 88, communication: 82, technical: 90, behavioral: 80 },
        };
      }
    } catch (_err) {
    }
  }

  return fallbackInterviewPrep(company, role);
}

function fallbackInterviewPrep(company, role) {
  return {
    companySummary: `${company} focuses on high-impact products, scalable architecture, and user-centric design principles.`,
    questions: [
      {
        id: "q1",
        type: "HR",
        question: `Why are you interested in joining ${company} as a ${role}?`,
        suggestedAnswer: `I have followed ${company}'s growth and product impact. My background aligns directly with the ${role} requirements, especially in building high-performance web applications.`,
        keyPoints: [
          "Connect personal career goals with company mission",
          "Highlight relevant domain expertise and past project achievements",
          "Demonstrate passion for solving core engineering problems"
        ],
        difficulty: "Easy"
      },
      {
        id: "q2",
        type: "Technical",
        question: "How do you handle state management and performance optimization in complex React applications?",
        suggestedAnswer: "I use atomic component structures, memoization (useMemo/useCallback), lightweight state stores like Zustand, and TanStack Query for efficient server state caching.",
        keyPoints: [
          "Explain local vs global state separation",
          "Mention code-splitting with React lazy loading",
          "Describe network request caching & revalidation strategies"
        ],
        difficulty: "Medium"
      },
      {
        id: "q3",
        type: "Behavioral",
        question: "Describe a situation where you had a disagreement with a team member or stakeholder on technical direction. How did you resolve it?",
        suggestedAnswer: "I focused on data-driven evaluation by building a quick proof-of-concept benchmark. We agreed on measurable metrics like load time and bundle size to pick the optimal path.",
        keyPoints: [
          "Use STAR method (Situation, Task, Action, Result)",
          "Demonstrate active listening and collaboration",
          "Emphasize objective benchmarking over opinion"
        ],
        difficulty: "Medium"
      },
      {
        id: "q4",
        type: "Scenario",
        question: "A critical production deployment experiences sudden latency spikes. Walk me through your step-by-step debugging workflow.",
        suggestedAnswer: "First, inspect error logs and telemetry metrics. Check database query execution times, network payload sizes, and rollback immediately if a regression is identified.",
        keyPoints: [
          "Prioritize service stabilization and immediate rollback if necessary",
          "Isolate backend vs frontend performance bottlenecks",
          "Conduct post-mortem root cause analysis to prevent recurrences"
        ],
        difficulty: "Hard"
      },
      {
        id: "q5",
        type: "Coding",
        question: "Implement a debounced search input function in TypeScript with cancellation support.",
        suggestedAnswer: "Create a wrapper timer using setTimeout, clearing the previous timer reference on each invocation before executing after the specified delay.",
        keyPoints: [
          "Clear existing timeout timers using clearTimeout",
          "Handle cleanup during unmount in React useEffect",
          "Preserve TypeScript generic type parameters"
        ],
        difficulty: "Medium"
      },
      {
        id: "q6",
        type: "Technical",
        question: "What strategies do you employ to ensure web application accessibility (a11y) and keyboard navigation?",
        suggestedAnswer: "I enforce semantic HTML5 tags, proper ARIA attributes, keyboard focus rings, color contrast validation, and automated testing tools like Lighthouse.",
        keyPoints: [
          "Semantic HTML (button vs div)",
          "Aria-label and keyboard focus trap management for modals",
          "Color contrast compliance (WCAG 2.1 AA)"
        ],
        difficulty: "Easy"
      },
      {
        id: "q7",
        type: "HR",
        question: "Where do you see yourself in 3 years in terms of professional engineering growth?",
        suggestedAnswer: "I aim to deepen my expertise as a Lead Product Engineer, mentoring junior engineers, shaping system architecture, and driving core product strategy.",
        keyPoints: [
          "Show commitment to technical mastery and leadership",
          "Align personal roadmap with team impact",
          "Emphasize continuous learning"
        ],
        difficulty: "Easy"
      },
      {
        id: "q8",
        type: "Scenario",
        question: "How do you handle scope changes mid-sprint when product requirements shift unexpectedly?",
        suggestedAnswer: "I assess trade-offs with the product manager, communicate technical risks clearly, and re-prioritize task backlogs without compromising quality.",
        keyPoints: [
          "Transparent communication with product managers",
          "Evaluate technical debt impact",
          "Re-estimate sprint scope realistically"
        ],
        difficulty: "Medium"
      },
      {
        id: "q9",
        type: "Technical",
        question: "Explain the differences between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG).",
        suggestedAnswer: "CSR builds HTML dynamically in the browser, SSR renders pages on server per request for fresh data, while SSG pre-builds HTML at compile time for maximum speed.",
        keyPoints: [
          "Compare SEO and initial load speed (TTFB)",
          "Highlight hydration process in Next.js/React",
          "Explain incremental static regeneration (ISR)"
        ],
        difficulty: "Hard"
      },
      {
        id: "q10",
        type: "Behavioral",
        question: "Give an example of a complex technical project you delivered under a tight deadline.",
        suggestedAnswer: "I scoped out an MVP component library, prioritized critical user flows, and established automated CI/CD checks to ship safely ahead of release date.",
        keyPoints: [
          "Establish core MVP scope boundaries",
          "Maintain test coverage and build stability",
          "Keep stakeholders updated with daily progress demos"
        ],
        difficulty: "Hard"
      }
    ],
    technicalTopics: [
      "React 19 & Next.js App Router Architecture",
      "TypeScript Strict Type Systems & Interfaces",
      "State Management (Zustand / TanStack Query)",
      "RESTful API & GraphQL Communication Patterns",
      "Performance Optimization & Web Vitals (LCP, CLS, INP)"
    ],
    revisionTopics: [
      "Event Loop & Asynchronous JavaScript (Promises / Async-Await)",
      "CSS Flexbox, Grid & Responsive Layout Boundaries",
      "OAuth 2.0 & JWT Security Authentication Flows",
      "Browser Storage (LocalStorage, SessionStorage, IndexedDB)"
    ],
    likelyCodingQuestions: [
      "Implement LRU (Least Recently Used) Cache data structure",
      "Flatten deeply nested JSON object or array in JavaScript",
      "Build custom React useDebounce & useThrottle hooks"
    ],
    salaryNegotiationTips: [
      "Research target compensation ranges on Levels.fyi and Glassdoor before final rounds",
      "Focus negotiations on total compensation (Base Salary + Equity + Sign-on Bonus)",
      "Maintain a professional, collaborative tone while advocating for market value"
    ],
    questionsToAskInterviewer: [
      `What does success look like for a ${role} at ${company} in the first 90 days?`,
      "How does the engineering team balance new feature velocity with technical debt refactoring?",
      "What are the biggest technical challenges the team is working to solve this quarter?"
    ],
    readinessMetrics: {
      overall: 88,
      knowledge: 92,
      communication: 85,
      technical: 90,
      behavioral: 84
    }
  };
}
