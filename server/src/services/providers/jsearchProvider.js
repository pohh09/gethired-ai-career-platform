import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";
import { createSkillMatcher } from "../../utils/regexUtils.js";

export class JSearchProvider extends BaseProvider {
  constructor() {
    super("JSearch");
  }

  async queryApi(query, filters = {}) {
    const apiKey = process.env.JSEARCH_API_KEY ? process.env.JSEARCH_API_KEY.trim() : "";
    if (!apiKey) {
      throw new Error("JSEARCH_API_KEY is not configured in environment variables.");
    }

    const params = new URLSearchParams({
      query: query,
      page: String(filters.page || 1),
      num_pages: "1",
      date_posted: filters.datePosted || "all",
    });

    if (filters.remoteOnly || filters.workplaceType === "Remote") {
      params.append("remote_jobs_only", "true");
    }

    if (filters.employmentType && filters.employmentType !== "All") {
      const empTypeMap = {
        "Full-time": "FULLTIME",
        "Full Time": "FULLTIME",
        "Part-time": "PARTTIME",
        "Part Time": "PARTTIME",
        Contract: "CONTRACTOR",
        Internship: "INTERN",
      };
      const mapped = empTypeMap[filters.employmentType] || filters.employmentType.toUpperCase();
      params.append("employment_types", mapped);
    }

    const url = `https://jsearch.p.rapidapi.com/search?${params.toString()}`;
    const headers = {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      Accept: "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    const remainingRequests = response.headers.get("x-ratelimit-requests-remaining");
    const totalLimit = response.headers.get("x-ratelimit-requests-limit");
    const apiLimits = remainingRequests
      ? { remaining: parseInt(remainingRequests, 10), limit: parseInt(totalLimit || "0", 10) }
      : null;

    if (!response.ok) {
      throw new Error(`JSearch HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload && Array.isArray(payload.data) ? payload.data : [];

    return { url, status, data, payload, headers, apiLimits };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.employer_name || "Tech Employer";
    const role = raw.job_title || "Software Engineer";
    const isRemote = Boolean(raw.job_is_remote);

    let location = "Remote";
    if (raw.job_city || raw.job_state || raw.job_country) {
      const parts = [raw.job_city, raw.job_state, raw.job_country].filter(Boolean);
      location = `${parts.join(", ")}${isRemote ? " / Remote" : ""}`;
    }

    let salaryText = "Competitive Salary";
    let salary = null;
    if (raw.job_min_salary || raw.job_max_salary) {
      const min = raw.job_min_salary ? Math.round(raw.job_min_salary) : null;
      const max = raw.job_max_salary ? Math.round(raw.job_max_salary) : null;
      salary = max || min;
      if (min && max) {
        salaryText = `$${min.toLocaleString()} - $${max.toLocaleString()} / yr`;
      } else if (min) {
        salaryText = `From $${min.toLocaleString()} / yr`;
      } else if (max) {
        salaryText = `Up to $${max.toLocaleString()} / yr`;
      }
    }

    const employmentType = raw.job_employment_type
      ? raw.job_employment_type.charAt(0).toUpperCase() + raw.job_employment_type.slice(1).toLowerCase()
      : "Full-time";

    const workplaceType = isRemote ? "Remote" : "Onsite";

    const qualifications = raw.job_highlights?.Qualifications || [];
    const benefits = raw.job_highlights?.Benefits || [];
    const description = raw.job_description || `${role} opportunity at ${company}.`;

    const skills = Array.isArray(raw.job_required_skills) && raw.job_required_skills.length > 0
      ? raw.job_required_skills
      : extractSkillsFromText(`${role} ${description}`);

    return {
      id: `jsearch-${raw.job_id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: "JSearch",
      company,
      companyLogo: raw.employer_logo || `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location,
      workplaceType,
      employmentType,
      salary,
      salaryText,
      postedDate: raw.job_posted_at_datetime_utc
        ? new Date(raw.job_posted_at_datetime_utc).toLocaleDateString()
        : "Recently Posted",
      description,
      jobLink: raw.job_apply_link || raw.job_google_link || `https://google.com/search?q=${encodeURIComponent(`${company} ${role}`)}`,
      skills,
      requirements: qualifications.length > 0 ? qualifications : ["Strong proficiency in web technologies"],
      benefits: benefits.length > 0 ? benefits : ["Competitive Health Care", "Remote Work Stipend"],
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

export const fetchFromJSearch = (filters) => new JSearchProvider().fetchJobs(filters);
