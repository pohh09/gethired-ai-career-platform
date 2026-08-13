import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";
import { createSkillMatcher } from "../../utils/regexUtils.js";

export class AdzunaProvider extends BaseProvider {
  constructor() {
    super("Adzuna");
  }

  async queryApi(query, filters = {}) {
    const appId = process.env.ADZUNA_APP_ID ? process.env.ADZUNA_APP_ID.trim() : "";
    const appKey = process.env.ADZUNA_APP_KEY ? process.env.ADZUNA_APP_KEY.trim() : "";

    if (!appId || !appKey) {
      throw new Error("ADZUNA_APP_ID or ADZUNA_APP_KEY is not configured in environment variables.");
    }

    const locLower = (filters.location || "").toLowerCase();
    const countryCode = locLower.includes("us") || locLower.includes("usa") ? "us" : "in";
    const where = filters.location || "India";
    const page = filters.page || 1;

    const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}?app_id=${encodeURIComponent(
      appId
    )}&app_key=${encodeURIComponent(appKey)}&results_per_page=20&what=${encodeURIComponent(
      query
    )}&where=${encodeURIComponent(where)}`;

    const headers = { Accept: "application/json" };
    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`Adzuna HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload && Array.isArray(payload.results) ? payload.results : [];

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.company?.display_name || "Tech Company";
    const role = raw.title ? raw.title.replace(/<\/?[^>]+(>|$)/g, "") : "Software Engineer";
    const description = raw.description ? raw.description.replace(/<\/?[^>]+(>|$)/g, "") : `${role} role at ${company}.`;

    const isRemote = /remote/i.test(role) || /remote/i.test(description) || /remote/i.test(raw.location?.display_name || "");
    const workplaceType = isRemote ? "Remote" : "Onsite";

    let location = raw.location?.display_name || "India";
    if (isRemote && !location.toLowerCase().includes("remote")) {
      location += " / Remote";
    }

    let salary = null;
    let salaryText = "Competitive Salary";
    if (raw.salary_min || raw.salary_max) {
      const min = raw.salary_min ? Math.round(raw.salary_min) : null;
      const max = raw.salary_max ? Math.round(raw.salary_max) : null;
      salary = max || min;
      if (min && max) {
        salaryText = `₹${min.toLocaleString()} - ₹${max.toLocaleString()} / yr`;
      } else if (min) {
        salaryText = `From ₹${min.toLocaleString()} / yr`;
      } else if (max) {
        salaryText = `Up to ₹${max.toLocaleString()} / yr`;
      }
    }

    let employmentType = "Full-time";
    if (raw.contract_type === "permanent") employmentType = "Full-time";
    else if (raw.contract_type === "contract") employmentType = "Contract";
    else if (raw.contract_time === "part_time") employmentType = "Part-time";

    const skills = extractSkillsFromText(`${role} ${description}`);

    return {
      id: `adzuna-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location,
      workplaceType,
      employmentType,
      salary,
      salaryText,
      postedDate: raw.created ? new Date(raw.created).toLocaleDateString() : "Recently Posted",
      description,
      jobLink: raw.redirect_url || `https://google.com/search?q=${encodeURIComponent(`${company} ${role}`)}`,
      skills,
      requirements: [
        "Proficiency with modern programming languages & frameworks",
        "Strong problem-solving and technical communication skills",
      ],
      benefits: ["Comprehensive Health Care", "Flexible Work Environment", "Performance Bonus"],
    };
  }
}

function extractSkillsFromText(text = "") {
  const commonTech = [
    "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
    "PostgreSQL", "AWS", "Docker", "Next.js", "GraphQL", "Tailwind CSS",
    "MongoDB", "REST APIs", "Kubernetes", "C++", "C#", "Go", "Git"
  ];
  return commonTech.filter((tech) => {
    const matcher = createSkillMatcher(tech);
    return matcher ? matcher.test(text) : false;
  }).slice(0, 5);
}

export const fetchFromAdzuna = (filters) => new AdzunaProvider().fetchJobs(filters);
