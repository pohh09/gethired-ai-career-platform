import axios from "axios";
import fetch from "node-fetch";

export async function extractJobData({ url, text }) {
  let contentToAnalyze = text || "";
  let sourceUrl = url || "";

  if (url && !contentToAnalyze) {
    try {
      const fetchedText = await fetchPageContent(url);
      if (fetchedText) {
        contentToAnalyze = fetchedText;
      }
    } catch (err) {
      console.warn(`Could not fetch HTML directly from URL: ${url}. Proceeding with URL string analysis.`);
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `
You are an expert Job Posting Metadata Extractor and AI Talent Acquisition Assistant.
Extract structured job details from the provided job posting URL or job description text.

SOURCE URL: ${sourceUrl || "N/A"}
JOB POSTING CONTENT / TEXT:
"""
${contentToAnalyze || sourceUrl}
"""

OUTPUT FORMAT:
Respond strictly with a valid JSON object matching this exact schema (no markdown formatting, no extra text):
{
  "company": "string (Company Name, e.g. Stripe, Greenhouse, Vercel)",
  "role": "string (Job Title, e.g. Senior Frontend Engineer)",
  "location": "string (City, State, Country or 'Remote')",
  "workplaceType": "Remote" | "Hybrid" | "Onsite",
  "employmentType": "Full-time" | "Part-time" | "Contract" | "Internship",
  "salary": number or null (e.g. 165000),
  "salaryText": "string (e.g. '$150,000 - $180,000 / yr' or 'Competitive')",
  "description": "string (Full or summary job description text)",
  "skills": ["string", "string", "string"],
  "requirements": ["string", "string"],
  "benefits": ["string", "string"],
  "jobLink": "string (Source URL if available)"
}
`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        const cleanJsonStr = candidateText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const parsed = JSON.parse(cleanJsonStr);

        return {
          company: parsed.company || inferCompanyFromUrl(sourceUrl) || "Target Employer",
          role: parsed.role || "Software Engineer",
          location: parsed.location || "Remote",
          workplaceType: parsed.workplaceType || "Remote",
          employmentType: parsed.employmentType || "Full-time",
          salary: typeof parsed.salary === "number" ? parsed.salary : null,
          salaryText: parsed.salaryText || "Competitive Salary",
          description: parsed.description || contentToAnalyze || "Imported job posting details.",
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : ["React", "TypeScript", "Node.js"],
          requirements: Array.isArray(parsed.requirements) ? parsed.requirements : ["Bachelor's degree or equivalent experience"],
          benefits: Array.isArray(parsed.benefits) ? parsed.benefits : ["Competitive Compensation", "Flexible Work"],
          jobLink: sourceUrl || parsed.jobLink || "",
        };
      }
    } catch (err) {
      console.warn("Gemini AI job extraction failed, falling back to heuristic parsing:", err.message);
    }
  }

  return fallbackHeuristicExtract(sourceUrl, contentToAnalyze);
}

async function fetchPageContent(targetUrl) {
  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 8000,
    });

    if (res.ok) {
      const html = await res.text();
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 4000);
    }
  } catch (_e) {
  }
  return null;
}

function inferCompanyFromUrl(url = "") {
  try {
    if (!url) return "";
    const hostname = new URL(url).hostname.replace("www.", "");
    
    if (hostname.includes("linkedin.com")) return "LinkedIn Employer";
    if (hostname.includes("greenhouse.io")) return url.split("/")[3] || "Greenhouse Employer";
    if (hostname.includes("lever.co")) return url.split("/")[3] || "Lever Employer";
    if (hostname.includes("workday.com")) return "Workday Partner";
    
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      const name = parts[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  } catch (_e) {
  }
  return "";
}

function fallbackHeuristicExtract(url, text) {
  const company = inferCompanyFromUrl(url) || extractCompanyFromText(text) || "Imported Employer";
  const role = extractRoleFromText(text) || "Software Developer";
  const isRemote = /remote/i.test(text) || /remote/i.test(url);
  const workplaceType = isRemote ? "Remote" : "Onsite";

  const skills = ["React", "TypeScript", "JavaScript", "Node.js", "Python", "AWS", "SQL"]
    .filter((s) => new RegExp(`\\b${s}\\b`, "i").test(text || role))
    .slice(0, 5);

  return {
    company,
    role,
    location: isRemote ? "Remote" : "San Francisco, CA",
    workplaceType,
    employmentType: "Full-time",
    salary: 150000,
    salaryText: "$130,000 - $170,000 / yr",
    description: text || `Job posting imported from ${url || "online portal"}.`,
    skills: skills.length > 0 ? skills : ["TypeScript", "React", "APIs"],
    requirements: [
      "2+ years software development experience",
      "Proficiency with modern web frameworks",
    ],
    benefits: ["Health Insurance", "Paid Time Off", "Remote Flexibility"],
    jobLink: url || "",
  };
}

function extractCompanyFromText(text = "") {
  const match = text.match(/(?:at|company:?|employer:?)\s+([A-Z][A-Za-z0-9\s&]{2,20})/i);
  return match ? match[1].trim() : "";
}

function extractRoleFromText(text = "") {
  const match = text.match(/(?:role:?|title:?|position:?)\s+([A-Z][A-Za-z0-9\s-]{3,30})/i);
  return match ? match[1].trim() : "";
}
