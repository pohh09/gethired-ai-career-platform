import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class ArbeitnowProvider extends BaseProvider {
  constructor() {
    super("Arbeitnow");
  }

  async queryApi(_query, filters = {}) {
    const page = filters.page || 1;
    const url = `https://www.arbeitnow.com/api/job-board-api?page=${page}`;
    const headers = { Accept: "application/json" };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`Arbeitnow HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload && Array.isArray(payload.data) ? payload.data : [];

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.company_name || "Tech Partner";
    const role = raw.title || "Software Developer";
    const description = raw.description
      ? raw.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 500)
      : `${role} opportunity at ${company}.`;

    const isRemote = Boolean(raw.remote);
    const location = raw.location
      ? `${raw.location}${isRemote ? " / Remote" : ""}`
      : isRemote
      ? "Remote"
      : "Germany / Europe";

    const workplaceType = isRemote ? "Remote" : "Onsite";
    const skills = Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags.slice(0, 5) : ["Tech", "Engineering"];

    return {
      id: `arbeitnow-${raw.slug || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location,
      workplaceType,
      employmentType: "Full-time",
      salary: null,
      salaryText: "Competitive Compensation",
      postedDate: raw.created_at
        ? new Date(raw.created_at * 1000).toLocaleDateString()
        : "Recently Posted",
      description,
      jobLink: raw.url || "https://www.arbeitnow.com",
      skills,
      requirements: ["Professional software engineering background"],
      benefits: ["EU Relocation / Remote Flexibility", "Comprehensive Benefits"],
    };
  }
}

export const fetchFromArbeitnow = (filters) => new ArbeitnowProvider().fetchJobs(filters);
