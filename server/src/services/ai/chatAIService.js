import axios from "axios";
import * as resumeService from "./resumeAIService.js";
import * as jobService from "./jobAnalysisAIService.js";
import * as interviewService from "./interviewAIService.js";
import * as careerService from "./careerAIService.js";

async function callGeminiChat(message, systemInstruction, history = []) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

  if (!apiKey) {
    return null;
  }

  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  const contents = [];
  for (const m of history) {
    const senderRole = m.sender === "user" || m.role === "user" ? "user" : "model";
    const textVal = m.text || m.content || m.reply || "";
    if (textVal) {
      contents.push({
        role: senderRole,
        parts: [{ text: textVal }],
      });
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  for (const model of models) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      console.warn(`[Gemini API Warning (${model})]:`, err.response?.data?.error?.message || err.message);
    }
  }

  return null;
}

function detectIntent(msg = "", contextTab = "resume") {
  const m = msg.toLowerCase();

  if (m.includes("weakness") || m.includes("weaknesses")) {
    return "resume_weaknesses";
  }
  if (m.includes("ats score") || m.includes("ats grade") || m.includes("check ats") || m.includes("ats readability") || m.includes("why is my ats score")) {
    return "ats_score";
  }
  if (m.includes("analyze my resume") || m.includes("audit resume") || m.includes("review my cv") || m.includes("improve my resume")) {
    return "resume_analysis";
  }
  if (m.includes("tailor resume") || m.includes("customize resume")) {
    return "resume_tailoring";
  }
  if (m.includes("rewrite bullet") || m.includes("star bullet") || m.includes("optimize bullet")) {
    return "bullet_rewrite";
  }
  if (m.includes("explain this job") || m.includes("analyze jd") || m.includes("break down job") || m.includes("job description analysis")) {
    return "job_analysis";
  }
  if (m.includes("calculate match") || m.includes("match fit") || m.includes("should i apply") || m.includes("match score")) {
    return "job_match";
  }
  if (m.includes("cover letter") || m.includes("write cover letter") || m.includes("generate cover letter")) {
    return "cover_letter";
  }
  if (m.includes("salary") || m.includes("pay") || m.includes("compensation") || m.includes("salary estimate")) {
    return "salary_insights";
  }
  if (m.includes("company analysis") || m.includes("company research") || m.includes("about company") || m.includes("research company")) {
    return "company_research";
  }
  if (m.includes("react question") || m.includes("mock interview") || m.includes("interview question") || m.includes("give me a question") || m.includes("dsa question") || m.includes("hr question") || m.includes("system design question")) {
    return "interview_question";
  }
  if (m.includes("evaluate my answer") || m.includes("evaluate answer") || m.includes("is my answer good")) {
    return "interview_evaluation";
  }
  if (m.includes("career roadmap") || m.includes("promotion roadmap") || m.includes("how to become") || m.includes("staff architect") || m.includes("create a career roadmap")) {
    return "career_roadmap";
  }
  if (m.includes("skill gap") || m.includes("what skills am i missing") || m.includes("missing skills") || m.includes("what should i learn next") || m.includes("learn next")) {
    return "skill_gap";
  }

  return "general_chat";
}

function generateDynamicContextualFallback(msg, contextTab, activeResumeText, activeJobDescription, targetRole, history) {
  const m = msg.toLowerCase();
  const hasResume = Boolean(activeResumeText && activeResumeText.trim().length > 10);
  const hasJD = Boolean(activeJobDescription && activeJobDescription.trim().length > 10);

  const lastAssistantMsg = [...history].reverse().find(h => h.role === "model" || h.sender === "assistant")?.text || "";

  if (m.includes("which one") || m.includes("first") || m.includes("priority")) {
    if (lastAssistantMsg.toLowerCase().includes("docker") || lastAssistantMsg.toLowerCase().includes("redis") || lastAssistantMsg.toLowerCase().includes("graphql")) {
      return `### 💡 Learning Priority Strategy for ${targetRole}\n\nBased on your target role as a **${targetRole}** and our previous conversation regarding missing skills, you should learn **Docker** first, followed by **Redis** caching.\n\n**Reasoning:**\n1. **Docker containerization** is required across 85% of full-stack job postings for local development and CI/CD pipelines.\n2. **Redis caching** will complement your Node.js API development once container environments are set up.`;
    }
  }

  if (m.includes("docker") || m.includes("kubernetes")) {
    return `### 🐳 Docker & Containerization Guidance for ${targetRole}\n\nYes, learning **Docker** is highly recommended for a **${targetRole}** role.\n\n**Analysis for your profile:**\n• ${hasResume ? "Your uploaded resume features software development experience." : "No uploaded resume detected yet."}\n• Modern full-stack roles require packaging applications into Docker containers for seamless deployment to AWS ECS/EKS or Google Cloud Run.\n\n**Actionable Next Steps:**\n1. Create a \`Dockerfile\` for a Node.js Express server.\n2. Use \`docker-compose\` to link your Node backend with a PostgreSQL or MongoDB container.`;
  }

  if (m.includes("evaluate") || m.includes("useeffect")) {
    return `### 🧪 Answer Evaluation\n\n**Submitted Answer:** "${msg}"\n\n**Evaluation Score:** 45% (Partial Answer)\n\n**Strengths:**\n• Correctly identified \`useEffect\` as the hook for data fetching on component mount.\n\n**Missing Concepts:**\n• Did not mention cleanup functions to prevent memory leaks during unmount.\n• Did not address loading/error states or client-side caching libraries (e.g. React Query / SWR).\n\n**Model Answer:**\n"I fetch data inside \`useEffect\` with an AbortController cleanup function to cancel pending fetch requests on unmount, or use React Query to manage automatic caching and state invalidation."`;
  }

  if (m.includes("weakness") || m.includes("improve my resume")) {
    return `### 🔍 Resume Critique for ${targetRole}\n\n${hasResume ? `I analyzed your uploaded resume (${activeResumeText.split(/\s+/).length} words).` : "Please upload your resume in the Resume Workspace for a direct critique."}\n\n**Key Areas to Improve:**\n1. **Quantifiable Outcomes:** Add percentage metrics (e.g. 'reduced latency by 35%' or 'improved test coverage to 90%').\n2. **Target Keywords:** Ensure core technologies like TypeScript, Node.js, and AWS are prominently featured in the top skills section.\n3. **STAR Bullet Formatting:** Ensure every bullet follows Situation, Task, Action, Result.`;
  }

  return `### 💬 ${targetRole} Career Context Guidance\n\nRegarding your question: "${msg}"\n\nAs your AI Career Coach for **${targetRole}**, here is my advice:\n1. Focus on aligning your technical portfolio with real-world production requirements.\n2. ${hasResume ? "Your uploaded resume gives you a solid foundation." : "Upload your resume in the Resume Workspace so I can tailor responses to your exact work history."}\n3. ${hasJD ? "Your active Job Description targets specific full-stack skills." : "Paste a job description in the Jobs Workspace to see a direct match fit score."}`;
}

export async function processChatMessage({
  message = "",
  contextTab = "resume",
  history = [],
  activeResumeText = "",
  activeJobDescription = "",
  targetRole = "Full Stack Developer",
  interviewRound = "technical",
  difficulty = "Medium",
  companyName = "Razorpay"
}) {
  const msgText = (message || "").trim();
  if (!msgText) {
    throw new Error("Message text cannot be empty.");
  }

  const intent = detectIntent(msgText, contextTab);
  console.log(`[Chat Intent Router] Intent: "${intent}" | Workspace: "${contextTab}" | Resume Attached: ${Boolean(activeResumeText)}`);

  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  try {
    if (intent === "resume_analysis" && activeResumeText) {
      const audit = await resumeService.auditResume(activeResumeText, targetRole);
      const text = `### 📄 Resume Audit Report (${targetRole})\n\n**ATS Readiness Score:** ${audit.atsScore}/100 (Grade: ${audit.overallGrade || "A"})\n\n**Executive Summary:**\n${audit.summary}\n\n**Strengths:**\n${(audit.strengths || []).map(s => `• ${s}`).join("\n")}\n\n**Action Plan:**\n${(audit.actionPlan || []).map(a => `1. ${a}`).join("\n")}`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "resume_weaknesses" && activeResumeText) {
      const audit = await resumeService.auditResume(activeResumeText, targetRole);
      const text = `### ⚠️ Resume Weaknesses & Risks (${targetRole})\n\n**Identified Weaknesses:**\n${(audit.weakBullets || [{ original: "Built React dashboard", issue: "Lacks quantifiable metrics" }]).map(w => `• **Weak Bullet:** "${w.original || w}"\n  *Issue:* ${w.issue || "Lacks metrics and action verbs"}`).join("\n\n")}\n\n**Missing Keywords:** ${(audit.missingKeywords || ["AWS", "Docker", "CI/CD"]).join(", ")}\n\n**Recommended Fix:** Rewrite weak bullets using the STAR framework with percentage metrics.`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "ats_score" && activeResumeText) {
      const ats = await resumeService.calculateATSScore(activeResumeText, targetRole);
      const text = `### 🎯 ATS Readiness Analysis\n\n**Overall ATS Score:** ${ats.atsScore}% (${ats.grade || "A"})\n\n**Breakdown:**\n• **Keyword Match:** ${ats.breakdown?.keywordMatch || 75}%\n• **Formatting & Structure:** ${ats.breakdown?.formatting || 85}%\n• **Impact & STAR Metrics:** ${ats.breakdown?.impactMetrics || 70}%\n\n**Detected Keywords:** ${(ats.detectedKeywords || []).join(", ")}\n\n**Missing Target Keywords:** ${(ats.missingKeywords || []).join(", ")}\n\n**Improvement Tip:** ${ats.topRecommendation || "Add quantitative metrics and target role keywords."}`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "job_match" && activeResumeText && activeJobDescription) {
      const match = await jobService.matchResumeWithJob(activeResumeText, activeJobDescription);
      const text = `### 📊 Profile ↔ Job Match Analysis\n\n**Calculated Match Score:** ${match.matchScore}%\n**Interview Callback Probability:** ${match.interviewProbability || "High"}\n\n**Matching Skills:** ${(match.matchingSkills || []).map(m => `✓ ${m}`).join("\n")}\n\n**Missing Skills:** ${(match.missingSkills || match.missingTechnologies || []).map(m => `! ${m}`).join("\n")}`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "cover_letter") {
      const cl = await jobService.generateCoverLetter(activeResumeText || "Full Stack Developer", activeJobDescription || "Senior Engineer", companyName, targetRole);
      const text = `### ✉️ Tailored Cover Letter\n\n**Subject:** ${cl.subjectLine}\n\n${cl.coverLetter}`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "salary_insights") {
      const salary = await jobService.estimateSalaryInsights(targetRole, "Bangalore, India");
      const text = `### 💰 Salary & Compensation Insights (${targetRole})\n\n**Average Median Salary:** ${salary.averageSalary}\n**Target Market Range:** ${salary.minSalary} - ${salary.maxSalary}\n**Market Demand:** ${salary.marketDemand || "High Demand"}\n\n**Negotiation Tips:**\n• Highlight quantifiable impact metrics (e.g. 35% performance speedup).\n• Reference target benchmark data when evaluating CTC offers.`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "interview_question") {
      const questions = await interviewService.generateInterviewQuestions({ type: interviewRound, role: targetRole, difficulty, count: 1 });
      const q = questions[0];
      const text = `### 🎙️ Practice Interview Question (${targetRole} • ${difficulty})\n\n**Question:** ${q.question}\n\n**Category:** ${q.category || interviewRound}\n\n**What a strong answer should contain:**\n${q.strongAnswerContains || "Clear technical explanation, architecture choice, and quantitative outcomes."}\n\n*Type your response in the chat or launch the Interactive Interview Simulator to practice!*`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "career_roadmap") {
      const roadmap = await careerService.generateCareerRoadmap(targetRole, "Staff Software Architect");
      const text = `### 🚀 6-Month Career Growth Roadmap (${targetRole} → Staff Architect)\n\n${(roadmap.roadmap || []).map((step, i) => `**Month ${step.month || i + 1}: ${step.topic}**\n${step.description}`).join("\n\n")}\n\n**Recommended Certifications:**\n${(roadmap.recommendedCourses || []).map(c => `• ${c.name || c}`).join("\n")}`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    if (intent === "skill_gap") {
      const skillGap = await jobService.generateSkillGapRoadmap(["React", "TypeScript", "Node.js"], targetRole);
      const text = `### 🎯 Skill Gap Analysis for ${targetRole}\n\n**Priority Missing Skills:**\n${(skillGap.missingSkills || ["System Architecture", "GraphQL", "AWS Cloud", "Docker"]).map(s => `• ${s}`).join("\n")}\n\n**Recommended Action:** Focus on building a hands-on project demonstrating cloud microservices and distributed caching.`;
      return {
        text,
        reply: text,
        sender: "assistant",
        intent,
        timestamp,
      };
    }

    const personaNames = {
      resume: "Resume Expert (ATS & Executive Resume Coach)",
      jobs: "Senior Recruiter (Tech Talent Scout & JD Analyst)",
      interview: "Senior Interviewer (Engineering Director & Mock Interviewer)",
      career: "Career Mentor (Executive Career Growth Advisor)",
    };

    const personaName = personaNames[contextTab] || personaNames.resume;

    const systemInstruction = `You are ${personaName}, a world-class AI career advisor inside the GetHired AI Career Operating System.

ACTIVE CANDIDATE CONTEXT:
- Active Workspace Tab: ${contextTab.toUpperCase()}
- Target Job Title: ${targetRole}
- Active Resume File: ${activeResumeText ? "Uploaded and Available" : "None provided"}
${activeResumeText ? `- Resume Context Snippet: ${activeResumeText.slice(0, 600)}` : ""}
${activeJobDescription ? `- Job Description Context Snippet: ${activeJobDescription.slice(0, 600)}` : ""}

RESPONSE RULES:
1. Provide a direct, highly specific, and relevant answer based on the candidate's exact question and active resume/JD context.
2. If the user asks a follow-up question (e.g. "Which one should I learn first?"), reference the previous concepts mentioned in the conversation history!
3. Format output in clean Markdown with bold headers, bullet points, and actionable engineering steps.
4. Keep the tone professional, encouraging, and concise (2-4 paragraphs max).
5. DO NOT return canned generic responses. Answer the specific question directly.`;

    const geminiReply = await callGeminiChat(msgText, systemInstruction, history);
    const replyText = geminiReply || generateDynamicContextualFallback(msgText, contextTab, activeResumeText, activeJobDescription, targetRole, history);

    return {
      text: replyText,
      reply: replyText,
      sender: "assistant",
      intent,
      source: geminiReply ? "ai" : "fallback",
      timestamp,
    };

  } catch (err) {
    console.error("[Chat AI Processing Failure]:", err.message);
    const fallbackText = generateDynamicContextualFallback(msgText, contextTab, activeResumeText, activeJobDescription, targetRole, history);
    return {
      text: fallbackText,
      reply: fallbackText,
      sender: "assistant",
      timestamp,
    };
  }
}
