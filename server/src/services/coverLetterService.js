import axios from "axios";

export async function generateCoverLetterWithAI({
  company,
  role,
  jobDescription = "",
  resumeText = "",
  style = "Professional",
  experienceLevel = "Senior",
  length = "Medium",
  userName = "",
  userEmail = "",
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  const wordTarget =
    length === "Short"
      ? "around 200 words (concise and direct)"
      : length === "Long"
      ? "around 500 words (detailed and thorough)"
      : "around 350 words (balanced standard)";

  const candidateName = userName || "[Your Name]";
  const candidateContact = userEmail ? `${userEmail} | [Your Phone]` : "[Your Email] | [Your Phone]";

  const prompt = `
You are an expert executive cover letter writer and ATS resume strategist.
Generate a high-converting, personalized cover letter for:

CANDIDATE NAME: ${candidateName}
COMPANY: ${company}
ROLE / JOB TITLE: ${role}
TONE / STYLE: ${style} (Options: Professional, Friendly, Formal, Startup, Corporate, Concise, Detailed, Confident, Enthusiastic)
EXPERIENCE LEVEL: ${experienceLevel} (Options: Fresher, Junior, Mid-Level, Senior)
TARGET LENGTH: ${wordTarget}

JOB DESCRIPTION / REQUIREMENTS:
"""
${jobDescription || "Software engineering position focusing on modern web applications, scalable APIs, teamwork, and product leadership."}
"""

CANDIDATE RESUME / PROFILE BACKGROUND:
"""
${resumeText || "Proven engineering background with skills in full-stack web development, TypeScript, React, Node.js, and product delivery."}
"""

OUTPUT FORMAT:
Respond strictly with a valid JSON object matching this exact schema (no markdown formatting code blocks, no text outside JSON):
{
  "coverLetterText": "string (the full text of the cover letter including date, recipient greeting, paragraphs, sign-off with ${candidateName})",
  "highlightedSkills": ["string", "string", "string", "string"],
  "keywordsUsed": ["string", "string", "string", "string"],
  "atsTips": ["string", "string", "string"]
}
`;

  if (apiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { "Content-Type": "application/json" }, timeout: 25000 }
      );

      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        const cleanJsonStr = candidateText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const parsed = JSON.parse(cleanJsonStr);
        return {
          coverLetterText:
            parsed.coverLetterText ||
            fallbackLetterText(company, role, style, experienceLevel, candidateName, candidateContact),
          highlightedSkills: Array.isArray(parsed.highlightedSkills) && parsed.highlightedSkills.length > 0
            ? parsed.highlightedSkills
            : ["React & TypeScript", "RESTful API Integration", "System Architecture", "Cross-Functional Collaboration"],
          keywordsUsed: Array.isArray(parsed.keywordsUsed) && parsed.keywordsUsed.length > 0
            ? parsed.keywordsUsed
            : ["Full-Stack Engineering", "Scalability", "Agile Execution", "Product Engineering"],
          atsTips: Array.isArray(parsed.atsTips) && parsed.atsTips.length > 0
            ? parsed.atsTips
            : [
                `Explicitly state '${role}' in your opening paragraph for top ATS matching.`,
                "Include quantifiable metric outcomes from past projects.",
                "Keep standard paragraph spacing and avoid unparsed graphical tables."
              ],
        };
      }
    } catch (_err) {
    }
  }

  return {
    coverLetterText: fallbackLetterText(company, role, style, experienceLevel, candidateName, candidateContact),
    highlightedSkills: ["React 19 & TypeScript", "Node.js Services", "System Architecture", "UI Design Systems"],
    keywordsUsed: ["Product Engineering", "Performance Optimization", "Scalable Infrastructure", "Full-Stack Development"],
    atsTips: [
      `Include '${role}' explicitly in the opening line to pass initial ATS filters.`,
      "Highlight 2-3 metric-driven achievements aligned with key job responsibilities.",
      "Maintain clean, scannable paragraph formatting without graphics or heavy tables."
    ],
  };
}

function fallbackLetterText(company, role, style, experienceLevel, candidateName, candidateContact) {
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (style === "Startup" || style === "Enthusiastic" || style === "Friendly") {
    return `${dateStr}

Hiring Team at ${company},

I am thrilled to submit my application for the ${role} position at ${company}. Having closely followed ${company}'s fast-paced innovation and product growth, I am excited about the opportunity to bring my ${experienceLevel.toLowerCase()}-level expertise to your high-impact team.

Throughout my career, I have specialized in building robust, performant web applications with modern architectures. In my recent work, I spearheaded key product initiatives that improved application speed and user engagement by over 35%. I thrive in energetic, collaborative environments where shipping clean, user-centric solutions rapidly is prioritized.

What excites me most about ${company} is your commitment to solving complex problems at scale. I would welcome the opportunity to discuss how my technical skills, adaptability, and product-focused mindset can contribute to your upcoming milestones.

Warm regards,

${candidateName}
${candidateContact}`;
  }

  return `${dateStr}

Hiring Manager
${company}

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} opportunity at ${company}. As a ${experienceLevel} professional with a proven track record of delivering scalable solutions and modern user experiences, I am confident in my ability to make an immediate, positive contribution to your team.

My technical background includes extensive experience in modern web development, API integration, and user interface architecture. In my recent roles, I led key engineering improvements that streamlined workflows and delivered reliable software to active users. My approach combines technical standards with a sharp focus on business outcomes and user satisfaction.

${company}'s commitment to excellence aligns perfectly with my professional values. I am eager to leverage my expertise to help drive ${company}'s engineering initiatives forward.

Thank you for your time and consideration. I look forward to discussing how my experience and qualifications meet your needs.

Sincerely,

${candidateName}
${candidateContact}`;
}
