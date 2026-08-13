import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class RemotiveProvider extends BaseProvider {
  constructor() {
    super("Remotive");
  }

  async queryApi(query, filters = {}) {
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (filters.limit) params.append("limit", String(filters.limit));

    const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;
    const headers = { Accept: "application/json" };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`Remotive HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload && Array.isArray(payload.jobs) ? payload.jobs : [];

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.company_name || "Remote Employer";
    const role = raw.title || "Software Engineer";
    const description = raw.description
      ? raw.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 500)
      : `${role} opportunity at ${company}.`;

    const location = raw.candidate_required_location
      ? `${raw.candidate_required_location} / Remote`
      : "Remote";

    const employmentType = raw.job_type
      ? raw.job_type.charAt(0).toUpperCase() + raw.job_type.slice(1).replace(/_/g, "-")
      : "Full-time";

    const salaryText = raw.salary || "Competitive Salary";
    const skills = Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags.slice(0, 5) : ["Remote", "Software"];

    return {
      id: `remotive-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: raw.company_logo || `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location,
      workplaceType: "Remote",
      employmentType,
      salary: null,
      salaryText,
      postedDate: raw.publication_date
        ? new Date(raw.publication_date).toLocaleDateString()
        : "Recently Posted",
      description,
      jobLink: raw.url || "https://remotive.com",
      skills,
      requirements: ["Full remote working capability", "Strong software engineering skills"],
      benefits: ["100% Remote Position", "Flexible Hours"],
    };
  }
}

export const fetchFromRemotive = (filters) => new RemotiveProvider().fetchJobs(filters);
