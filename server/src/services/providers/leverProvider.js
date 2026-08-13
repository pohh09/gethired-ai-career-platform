import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class LeverProvider extends BaseProvider {
  constructor() {
    super("Lever");
  }

  async queryApi(query, filters = {}) {
    const siteToken = filters.companySite || process.env.LEVER_DEFAULT_SITE || "netflix";
    const url = `https://api.lever.co/v0/postings/${siteToken}?mode=json`;
    const headers = { Accept: "application/json" };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`Lever HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    let jobs = Array.isArray(payload) ? payload : [];

    if (query) {
      const qLower = query.toLowerCase();
      jobs = jobs.filter((j) => (j.text || "").toLowerCase().includes(qLower));
    }

    return { url, status, data: jobs, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = "Lever Partner";
    const role = raw.text || "Software Developer";

    return {
      id: `lever-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location: raw.categories?.location || "India / Remote",
      workplaceType: raw.workplaceType || "Remote",
      employmentType: raw.categories?.commitment || "Full-time",
      salary: null,
      salaryText: "Competitive Compensation",
      postedDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : "Recently Posted",
      description: raw.descriptionPlain || `${role} opening posted on Lever.`,
      jobLink: raw.hostedUrl || "https://lever.co",
      skills: ["Software Engineering"],
      requirements: ["Relevant software development background"],
      benefits: ["Health Care", "Parental Leave"],
    };
  }
}

export const fetchFromLever = (filters) => new LeverProvider().fetchJobs(filters);
