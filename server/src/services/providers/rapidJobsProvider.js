import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class RapidJobsProvider extends BaseProvider {
  constructor() {
    super("RapidJobs");
  }

  async queryApi(query, filters = {}) {
    const apiKey = process.env.RAPIDAPI_KEY ? process.env.RAPIDAPI_KEY.trim() : "";
    if (!apiKey) {
      throw new Error("RAPIDAPI_KEY is not configured in environment variables.");
    }

    const params = new URLSearchParams({
      query,
      location: filters.location || "India",
      page: String(filters.page || 1),
    });

    const url = `https://rapid-jobs-search.p.rapidapi.com/search?${params.toString()}`;
    const headers = {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "rapid-jobs-search.p.rapidapi.com",
      Accept: "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`RapidJobs HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload && Array.isArray(payload.data) ? payload.data : [];

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.company_name || "Tech Employer";
    const role = raw.job_title || "Software Developer";
    const description = raw.description || `${role} role at ${company}.`;

    return {
      id: `rapidjobs-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: raw.logo || `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location: raw.location || "India",
      workplaceType: raw.remote ? "Remote" : "Onsite",
      employmentType: "Full-time",
      salary: null,
      salaryText: "Competitive Compensation",
      postedDate: raw.posted_date || "Recently Posted",
      description,
      jobLink: raw.job_link || "https://google.com",
      skills: ["Software Engineering", "APIs"],
      requirements: ["Relevant industry experience"],
      benefits: ["Health Care", "Flexible Schedule"],
    };
  }
}

export const fetchFromRapidJobs = (filters) => new RapidJobsProvider().fetchJobs(filters);
