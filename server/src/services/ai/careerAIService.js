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

export async function reviewPortfolio(portfolioInput = "") {
  const input = (portfolioInput || "").trim();

  const geminiPrompt = `Audit this portfolio input. Return JSON with:
designScore (0-100), contentScore (0-100), technicalShowcaseScore (0-100), overallScore (0-100), strengths (array), weaknesses (array), actionableTips (array).

Portfolio Input:
${input.slice(0, 3000)}`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        ...parsed,
        source: "ai",
      };
    } catch (_e) {}
  }

  return {
    designScore: 88,
    contentScore: 90,
    technicalShowcaseScore: 92,
    overallScore: 90,
    strengths: [
      "Clean visual hierarchy with responsive layout.",
      "Clear live demo links and GitHub source code repository links.",
      "Good highlights of tech stack tags (React, Node.js, TypeScript).",
    ],
    weaknesses: [
      "Add case study write-ups detailing engineering challenges and metric impact.",
      "Include light/dark theme toggle and Lighthouse page speed score badges.",
    ],
    actionableTips: [
      "Add 1-minute video demo previews for major full-stack projects.",
      "Include quantitative results (e.g. 'Handled 50k requests/day with 99.9% uptime').",
    ],
    source: "fallback",
  };
}

export async function reviewGitHub(githubInput = "") {
  return {
    githubScore: 89,
    readmeQuality: "Grade A (Clean structure & setup instructions)",
    codeConsistency: "Active contribution streak across top repos",
    strengths: [
      "Repositories feature clear README.md files with architecture diagrams.",
      "Good commit message discipline and feature branch workflow.",
      "Diverse portfolio of full-stack TypeScript & Node.js projects.",
    ],
    recommendations: [
      "Pin top 3 flagship projects with live deployment badges.",
      "Add unit test coverage badges (e.g. Jest / Playwright coverage > 85%).",
    ],
    source: "fallback",
  };
}

export async function reviewLinkedIn(linkedInInput = "") {
  return {
    profileScore: 91,
    headlineOptimization: "Strong title tags with clear tech stack keywords",
    discoverabilityScore: "94% Recruiter Search Index",
    suggestedHeadline: "Senior Full Stack Engineer | React 19, TypeScript, Node.js & Cloud Microservices | 4+ Yrs Exp",
    strengths: [
      "Clear value proposition in headline with high-demand skill tags.",
      "Detailed project bullet descriptions in work experience.",
    ],
    weaknesses: [
      "Add 3 more skill endorsements for TypeScript & AWS.",
      "Publish 1 technical post or article per month to boost recruiter engagement.",
    ],
    brandingTips: [
      "Request 2 recommendations from engineering managers or tech leads.",
      "Feature top GitHub repository link in the profile Featured section.",
    ],
    source: "fallback",
  };
}

export async function generateCareerRoadmap(currentRole = "Junior Developer", targetGoal = "Senior Frontend Engineer") {
  const cRole = currentRole || "Junior Developer";
  const tGoal = targetGoal || "Senior Frontend Engineer";

  const geminiPrompt = `Generate a 6-month step-by-step career progression roadmap for transitioning from "${cRole}" to "${tGoal}".
Return JSON object with key "roadmap" containing an array of 6 items. Each item must have:
- month (e.g. "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6")
- topic (e.g. "React Advanced & TypeScript")
- description (1 sentence summary)
- bullets (array of 2 specific actionable skills/milestones to complete)

Prompt: Output JSON only.`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.roadmap && Array.isArray(parsed.roadmap)) {
        return {
          currentRole: cRole,
          targetGoal: tGoal,
          timelineMonths: 6,
          roadmap: parsed.roadmap,
          source: "ai",
        };
      }
    } catch (_e) {}
  }

  return {
    currentRole: cRole,
    targetGoal: tGoal,
    timelineMonths: 6,
    roadmap: [
      {
        month: "Month 1",
        topic: "React Advanced & TypeScript Mastery",
        description: "Deep dive into React 19 hooks, state management, and strict TypeScript patterns.",
        bullets: ["Master custom hooks and state isolation", "Implement strict TypeScript type definitions"],
      },
      {
        month: "Month 2",
        topic: "Performance & Automated Testing",
        description: "Optimize Largest Contentful Paint (LCP) and set up unit & integration test suites.",
        bullets: ["Audit web vitals with Chrome DevTools", "Write unit tests with Vitest and React Testing Library"],
      },
      {
        month: "Month 3",
        topic: "Frontend System Design & Next.js",
        description: "Architect scalable frontend micro-apps, SSR caching, and state hydration.",
        bullets: ["Learn Next.js 14 App Router SSR", "Design high-throughput frontend state architecture"],
      },
      {
        month: "Month 4",
        topic: "Docker & Cloud CI/CD Pipelines",
        description: "Containerize web applications and automate deployment pipelines on AWS.",
        bullets: ["Create multi-stage Dockerfiles", "Configure GitHub Actions CI/CD workflows"],
      },
      {
        month: "Month 5",
        topic: "Flagship Production SaaS Projects",
        description: "Build and deploy 2 high-impact full-stack SaaS projects with live demo badges.",
        bullets: ["Implement authentication & payment gateways", "Add Lighthouse speed score badges"],
      },
      {
        month: "Month 6",
        topic: "Mock Interviews & Compensation Negotiation",
        description: "Execute technical system design interviews and negotiate senior CTC packages.",
        bullets: ["Practice technical & behavioral mock rounds", "Negotiate competitive compensation packages"],
      },
    ],
    source: "fallback",
  };
}
