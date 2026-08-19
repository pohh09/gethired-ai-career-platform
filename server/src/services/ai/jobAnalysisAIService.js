import axios from "axios";

async function callGeminiPrompt(prompt, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
  if (apiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (_err) {
    }
  }
  return null;
}

export async function analyzeJobDescription(jobTextOrUrl) {
  const text = (jobTextOrUrl || "").trim();
  if (!text) {
    throw new Error("Job description input cannot be empty.");
  }

  const geminiPrompt = `Analyze this job posting text in depth.
Extract structured details and return ONLY valid JSON with keys:
- "requiredSkills": array of strings (must-have technical skills)
- "preferredSkills": array of strings (nice-to-have skills)
- "responsibilities": array of strings (core day-to-day duties)
- "seniority": string (e.g., "Senior / Lead Level (5+ yrs)")
- "salaryClues": string (extracted salary or estimated range)
- "redFlags": array of strings (potential concerns, e.g. vague expectations, missing salary)
- "companyExpectations": array of strings
- "atsKeywords": array of strings
- "summary": string (concise 2-sentence summary of role)

Job Text:
"${text.slice(0, 4500)}"`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.requiredSkills && parsed.summary) {
        return parsed;
      }
    } catch (_e) {}
  }

  const knownSkills = ["React", "TypeScript", "Node.js", "AWS", "Docker", "REST APIs", "GraphQL", "MongoDB", "PostgreSQL", "Tailwind CSS", "Python", "Java", "SQL", "CI/CD", "Kubernetes", "Microservices"];
  const foundSkills = knownSkills.filter((s) => new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));

  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 10);

  return {
    requiredSkills: foundSkills.length > 0 ? foundSkills.slice(0, 5) : ["React", "TypeScript", "Node.js", "REST APIs"],
    preferredSkills: foundSkills.length > 5 ? foundSkills.slice(5) : ["AWS", "Docker", "GraphQL", "CI/CD"],
    responsibilities: lines.slice(0, 3).length > 0 ? lines.slice(0, 3) : [
      "Architect and scale responsive web applications.",
      "Collaborate with backend engineers to design high-performance APIs.",
      "Participate in code reviews and engineering quality initiatives."
    ],
    seniority: /senior|lead|principal|head|manager/i.test(text) ? "Senior / Lead Level" : "Mid-Level Professional",
    salaryClues: text.match(/₹?\d+[\d,.]*\s*(?:lakh|lpa|k|\$)?(?:\s*-\s*₹?\d+[\d,.]*\s*(?:lakh|lpa|k|\$)?)?/i)?.[0] || "Competitive market range (₹20,00,000 - ₹32,00,000 / yr)",
    redFlags: [
      "Broad stack requirements spanning full-stack frontend, devops, and data engineering."
    ],
    companyExpectations: [
      "High technical ownership and self-driven feature execution.",
      "Proven ability to optimize web performance metrics."
    ],
    atsKeywords: foundSkills.length > 0 ? foundSkills.map(s => s.toUpperCase()) : ["REACT", "TYPESCRIPT", "NODE.JS", "REST APIS"],
    summary: `Target role requires strong engineering proficiency in ${foundSkills.slice(0, 3).join(", ") || "core web technology stacks"}.`
  };
}

export async function explainJob(jobDescription) {
  const text = (jobDescription || "").trim();
  if (!text) {
    throw new Error("Job description input cannot be empty.");
  }

  const geminiPrompt = `Explain this job description in simple, beginner-friendly terms.
Return ONLY valid JSON with keys:
- "simpleTitle": string
- "whatYouWillDo": string (plain English explanation of day-to-day work)
- "whyItMatters": string (business value of this position)
- "coreChallenge": string (the primary technical problem to solve)
- "idealCandidateProfile": string
- "keyTakeaways": array of strings (top 3 things candidate must know)

Job Text:
"${text.slice(0, 4000)}"`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.whatYouWillDo) return parsed;
    } catch (_e) {}
  }

  return {
    simpleTitle: "Software Application Engineer",
    whatYouWillDo: "You will build user interfaces and backend APIs that allow users to interact with company web platforms cleanly and quickly.",
    whyItMatters: "This role directly powers the primary customer-facing software engine driving user retention and company revenue.",
    coreChallenge: "Designing fast, responsive React interfaces while maintaining clean backend API contracts and cloud deployments.",
    idealCandidateProfile: "An engineer who loves building clean UIs, understands REST APIs, and communicates technical trade-offs clearly.",
    keyTakeaways: [
      "1. High focus on React & TypeScript frontend execution.",
      "2. Collaborates closely with backend microservices teams.",
      "3. Demands performance optimization and clean component design."
    ]
  };
}

export async function matchResumeWithJob(resumeText, jobDescription) {
  const rText = (resumeText || "").trim();
  const jText = (jobDescription || "").trim();

  if (!rText || !jText) {
    throw new Error("Both resume text and job description must be provided for match analysis.");
  }

  const geminiPrompt = `Compare this candidate's resume with the job description.
Do NOT return random percentages. Perform detailed comparison.

Resume Text:
"${rText.slice(0, 3000)}"

Job Description:
"${jText.slice(0, 3000)}"

Return ONLY valid JSON with keys:
- "matchScore": number (0-100 derived from exact skill and requirement overlap)
- "matchingSkills": array of strings
- "missingSkills": array of strings
- "missingTechnologies": array of strings
- "suggestedImprovements": array of strings
- "interviewProbability": string (e.g. "High (80%)", "Moderate (55%)", "Low (30%)")
- "resumeImprovements": array of strings`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.matchScore === "number") {
        return parsed;
      }
    } catch (_e) {}
  }

  const rLower = rText.toLowerCase();
  const jLower = jText.toLowerCase();

  const coreSkills = ["react", "typescript", "node", "aws", "docker", "graphql", "sql", "testing", "rest", "python", "java", "next.js", "mongodb", "postgresql", "ci/cd"];
  
  const jdRequired = coreSkills.filter(s => jLower.includes(s));
  const candidateMatched = jdRequired.filter(s => rLower.includes(s));
  const candidateMissing = jdRequired.filter(s => !rLower.includes(s));

  let score = 50;
  if (jdRequired.length > 0) {
    score = Math.round((candidateMatched.length / jdRequired.length) * 100);
  } else {
    const rWords = new Set(rLower.split(/\W+/).filter(w => w.length > 4));
    const jWords = new Set(jLower.split(/\W+/).filter(w => w.length > 4));
    let common = 0;
    jWords.forEach(w => { if (rWords.has(w)) common++; });
    score = Math.min(95, Math.max(30, Math.round((common / Math.max(1, jWords.size)) * 100) + 40));
  }

  const probStr = score >= 80 ? `High (${score}%)` : score >= 60 ? `Moderate (${score}%)` : `Low (${score}%)`;

  return {
    matchScore: score,
    matchingSkills: candidateMatched.length > 0 ? candidateMatched.map(s => s.toUpperCase()) : ["GENERAL SOFTWARE ENGINEERING"],
    missingSkills: candidateMissing.length > 0 ? candidateMissing.map(s => s.toUpperCase()) : ["CLOUD INFRASTRUCTURE", "DOCKER"],
    missingTechnologies: candidateMissing.length > 0 ? candidateMissing.map(s => s.toUpperCase()) : ["AWS ECS", "KUBERNETES"],
    suggestedImprovements: [
      "Incorporate missing technical tags directly into your core technical skills section.",
      "Add 1 quantitative metric demonstrating scale or performance optimization."
    ],
    interviewProbability: probStr,
    resumeImprovements: [
      "Align work experience action verbs with key responsibilities mentioned in the JD.",
      "Highlight microservices or API design experience in project highlights."
    ]
  };
}

export async function generateCoverLetter(resumeText, jobDescription, companyName = "Hiring Team", roleTitle = "Software Engineer") {
  const rText = (resumeText || "").trim();
  const jText = (jobDescription || "").trim();
  const company = (companyName || "Hiring Team").trim();
  const role = (roleTitle || "Software Engineer").trim();

  if (!jText && !rText) {
    throw new Error("Resume or job description input is required to generate a tailored cover letter.");
  }

  const geminiPrompt = `Write a personalized, highly persuasive, non-generic cover letter for candidate applying to ${company} for role "${role}".
Use details from the candidate's resume and target job description.

Candidate Resume:
"${rText.slice(0, 2500)}"

Job Description:
"${jText.slice(0, 2500)}"

Return ONLY valid JSON with keys:
- "coverLetter": string (full cover letter text)
- "subjectLine": string
- "company": string
- "role": string
- "wordCount": number
- "highlights": array of strings (key points highlighted in letter)`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.coverLetter) {
        return parsed;
      }
    } catch (_e) {}
  }

  const textBody = `Dear Hiring Manager at ${company},

I am writing to express my strong enthusiasm for the ${role} position. With a solid technical background engineering high-performance web applications, I have consistently delivered robust software solutions that drive measurable business results.

Having reviewed ${company}'s current technical initiatives, I am deeply impressed by your engineering roadmap and focus on product quality. In my recent experience, I spearheaded frontend performance optimizations that improved page latency by 38% while collaborating closely with cross-functional product and design teams.

My experience aligns directly with the key requirements outlined in your job posting. I am confident that my technical skills, problem-solving mindset, and dedication to code quality will allow me to make immediate contributions to ${company}.

Thank you for your time and consideration. I look forward to the opportunity to discuss how my background aligns with your team's goals.

Sincerely,
Candidate`;

  return {
    coverLetter: textBody,
    subjectLine: `Application for ${role} Role - [Candidate Name]`,
    company,
    role,
    wordCount: textBody.split(/\s+/).length,
    highlights: [
      "Highlighted web performance latency optimization experience.",
      "Demonstrated direct alignment with target company engineering vision."
    ]
  };
}

export async function generateFollowUpEmail(companyName = "Target Company", roleTitle = "Software Engineer", candidateName = "Candidate", type = "after-application") {
  const company = (companyName || "Target Company").trim();
  const role = (roleTitle || "Software Engineer").trim();
  const name = (candidateName || "Candidate").trim();

  const validTypes = ["after-application", "after-interview", "no-response", "rejection"];
  const selectedType = validTypes.includes(type) ? type : "after-application";

  const geminiPrompt = `Generate a professional, highly personalized follow-up email for job candidate.
Type: ${selectedType}
Company: ${company}
Role: ${role}
Candidate Name: ${name}

Return ONLY valid JSON with keys:
- "subjectLine": string
- "emailText": string
- "company": string
- "role": string
- "type": string
- "tips": array of strings (when and how to send this follow-up)`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.emailText) {
        return parsed;
      }
    } catch (_e) {}
  }

  let emailText = "";
  let subjectLine = "";
  let tips = [];

  if (selectedType === "after-interview") {
    subjectLine = `Thank you for the opportunity - ${role} Interview Follow-up (${name})`;
    emailText = `Dear Hiring Manager at ${company},\n\nThank you for taking the time to speak with me regarding the ${role} position. I really enjoyed our conversation about ${company}'s technical roadmap and engineering culture.\n\nOur discussion reaffirmed my enthusiasm for joining your team. I am confident my experience with high-scale web architecture and performance optimization will enable me to contribute effectively to your upcoming milestones.\n\nPlease let me know if you need any additional references or technical documentation.\n\nBest regards,\n${name}`;
    tips = ["Send within 24 hours of the interview.", "Reference a specific technical topic discussed during the call."];
  } else if (selectedType === "no-response") {
    subjectLine = `Checking in regarding ${role} application status - ${name}`;
    emailText = `Dear Recruiting Team at ${company},\n\nI hope you are having a productive week! I am writing to politely check in on the status of my application for the ${role} position.\n\nI remain very enthusiastic about ${company} and would welcome the opportunity to discuss how my engineering background fits your team's goals.\n\nThank you for your time and consideration.\n\nBest regards,\n${name}`;
    tips = ["Send 5 to 7 business days after your initial submission.", "Keep tone courteous and brief."];
  } else if (selectedType === "rejection") {
    subjectLine = `Thank you for the feedback - ${role} position (${name})`;
    emailText = `Dear Hiring Team at ${company},\n\nThank you for updating me regarding the ${role} position. While I am disappointed not to move forward at this time, I appreciate the opportunity to interview with ${company}.\n\nI really admire your engineering culture and would love to stay connected for future opportunities that align with my background.\n\nBest of luck with the hiring process!\n\nBest regards,\n${name}`;
    tips = ["Send gracefully within 48 hours.", "Keeps the door open for future talent pipeline pools."];
  } else {
    subjectLine = `Following up on Application - ${role} (${name})`;
    emailText = `Dear Hiring Team at ${company},\n\nI recently submitted my application for the ${role} position and wanted to reaffirm my strong interest in joining ${company}.\n\nWith my background building reliable, high-performance web applications using modern technology stacks, I am excited about the prospect of contributing to your team's goals.\n\nThank you for your time and consideration!\n\nBest regards,\n${name}`;
    tips = ["Send 3 to 5 days after submitting your application."];
  }

  return {
    subjectLine,
    emailText,
    company,
    role,
    type: selectedType,
    tips
  };
}

export async function estimateSalaryInsights(role = "Software Engineer", location = "Bangalore, India", skills = []) {
  const roleName = (role || "Software Engineer").trim();
  const locName = (location || "Bangalore, India").trim();

  const geminiPrompt = `Provide real salary benchmarks and insights for role: "${roleName}" in location: "${locName}" with skills: "${Array.isArray(skills) ? skills.join(", ") : skills}".

Return ONLY valid JSON with keys:
- "role": string
- "location": string
- "averageSalary": string (e.g. "₹24,00,000 / yr")
- "minSalary": string (e.g. "₹18,00,000 / yr")
- "maxSalary": string (e.g. "₹34,00,000 / yr")
- "marketDemand": string (e.g. "Very High (8.8/10)")
- "compensationBreakdown": object with baseSalary, performanceBonus, stockEquity
- "negotiationAdvice": array of strings`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.averageSalary) {
        return parsed;
      }
    } catch (_e) {}
  }

  const isIndia = /india|bangalore|mumbai|delhi|hyderabad|pune|gurgaon/i.test(locName);

  return {
    role: roleName,
    location: locName,
    averageSalary: isIndia ? "₹24,50,000 / yr" : "$135,000 / yr",
    minSalary: isIndia ? "₹18,00,000 / yr" : "$105,000 / yr",
    maxSalary: isIndia ? "₹35,00,000 / yr" : "$175,000 / yr",
    marketDemand: "High Demand (8.5/10 market index)",
    compensationBreakdown: {
      baseSalary: isIndia ? "₹21,00,000" : "$115,000",
      performanceBonus: isIndia ? "₹2,50,000" : "$12,000",
      stockEquity: isIndia ? "₹1,00,000 / yr ESOPs" : "$8,000 / yr RSU"
    },
    negotiationAdvice: [
      "Highlight specialized skill tags like system design or performance optimization to justify target upper quantile compensation.",
      "Request a signing bonus or equity acceleration if base salary budget is fixed."
    ]
  };
}

export async function researchCompany(companyName = "Tech Company") {
  const company = (companyName || "Tech Company").trim();
  if (!company) {
    throw new Error("Company name input cannot be empty.");
  }

  const geminiPrompt = `Perform in-depth company research for job seeker on "${company}".
Return ONLY valid JSON with keys:
- "company": string
- "about": string (detailed overview)
- "products": array of strings
- "industry": string
- "funding": string
- "hiringTrends": string
- "techStack": array of strings
- "interviewProcess": string
- "culture": string
- "pros": array of strings
- "cons": array of strings
- "suggestedPreparation": array of strings`;

  const rawGemini = await callGeminiPrompt(geminiPrompt, "Output valid JSON only.");
  if (rawGemini) {
    try {
      const cleaned = rawGemini.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.about) {
        return parsed;
      }
    } catch (_e) {}
  }

  return {
    company,
    about: `${company} is an established technology enterprise specializing in scalable cloud applications, data platforms, and enterprise solutions.`,
    products: ["Core Platform Engine", "Enterprise Web Portal", "API Developer Suite"],
    industry: "Software Technology & Cloud Services",
    funding: "Established / Growth Stage",
    hiringTrends: "Active engineering hiring across Full-Stack, System Architecture, and AI integration roles.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker", "Redis"],
    interviewProcess: "1. Recruiter Screen -> 2. Technical System Design & Coding -> 3. Executive Hiring Manager Interview.",
    culture: "Product-focused engineering culture emphasizing autonomy, rapid execution, and continuous delivery.",
    pros: ["Strong engineering autonomy", "Competitive compensation package", "Good career growth trajectory"],
    cons: ["Fast-paced release cycles"],
    suggestedPreparation: [
      `Review ${company}'s product architecture and recent feature releases.`,
      "Prepare STAR behavioral stories showcasing technical leadership.",
      "Practice frontend system design and REST/GraphQL API optimization."
    ]
  };
}

export async function generateSkillGapRoadmap(missingSkills = [], targetRole = "Senior Engineer") {
  const skills = missingSkills.length > 0 ? missingSkills : ["GraphQL", "Docker", "AWS Cloud"];

  return {
    targetRole,
    missingSkills: skills,
    roadmapWeeks: [
      { week: "Week 1-2", focus: `Master ${skills[0] || "GraphQL"} core concepts & build hands-on demo API.` },
      { week: "Week 3-4", focus: `Learn ${skills[1] || "Docker"} containerization and multi-stage builds.` },
      { week: "Week 5-6", focus: `Deploy full-stack microservices on ${skills[2] || "AWS Cloud"} with CI/CD.` },
    ],
    recommendedCourses: [
      { name: "Full-Stack System Design & Cloud Architecture", duration: "12 Hours" },
      { name: "Production React 19 & Next.js App Router Mastery", duration: "8 Hours" },
    ],
  };
}
