import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class GreenhouseProvider extends BaseProvider {
  constructor() {
    super("Greenhouse");
  }

  async queryApi(query, filters = {}) {
    const boardToken = filters.companyBoard || process.env.GREENHOUSE_DEFAULT_BOARD || "stripe";
    const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
    const headers = { Accept: "application/json" };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`Greenhouse HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    let jobs = payload && Array.isArray(payload.jobs) ? payload.jobs : [];

    if (query) {
      const qLower = query.toLowerCase();
      jobs = jobs.filter((j) => (j.title || "").toLowerCase().includes(qLower));
    }

    return { url, status, data: jobs, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = "Greenhouse Partner";
    const role = raw.title || "Software Developer";

    return {
      id: `greenhouse-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location: raw.location?.name || "India / Remote",
      workplaceType: (raw.location?.name || "").toLowerCase().includes("remote") ? "Remote" : "Onsite",
      employmentType: "Full-time",
      salary: null,
      salaryText: "Competitive Compensation",
      postedDate: raw.updated_at ? new Date(raw.updated_at).toLocaleDateString() : "Recently Posted",
      description: `${role} opening posted on Greenhouse.`,
      jobLink: raw.absolute_url || "https://greenhouse.io",
      skills: ["Software Engineering"],
      requirements: ["Professional web engineering background"],
      benefits: ["Health Care", "Equity"],
    };
  }
}

export const fetchFromGreenhouse = (filters) => new GreenhouseProvider().fetchJobs(filters);
