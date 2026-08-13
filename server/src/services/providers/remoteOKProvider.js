import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class RemoteOKProvider extends BaseProvider {
  constructor() {
    super("RemoteOK");
  }

  async queryApi(query, _filters = {}) {
    const tag = query ? encodeURIComponent(query.toLowerCase().split(/\s+/)[0]) : "dev";
    const url = `https://remoteok.com/api?tag=${tag}`;
    const headers = {
      "User-Agent": "GetHired-Aggregator/1.0",
      Accept: "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`RemoteOK HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = Array.isArray(payload)
      ? payload.filter((item) => item && typeof item === "object" && item.id && item.position)
      : [];

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.company || "RemoteOK Employer";
    const role = raw.position || "Software Developer";
    const description = raw.description
      ? raw.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 500)
      : `${role} opportunity at ${company}.`;

    const location = raw.location ? `${raw.location} / Remote` : "Remote";
    const salaryText = raw.salary_min || raw.salary_max
      ? `$${(raw.salary_min || 0).toLocaleString()} - $${(raw.salary_max || 0).toLocaleString()} / yr`
      : "Competitive Salary";

    const skills = Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags.slice(0, 5) : ["Remote", "Software"];

    return {
      id: `remoteok-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: raw.company_logo || `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location,
      workplaceType: "Remote",
      employmentType: "Full-time",
      salary: raw.salary_max || raw.salary_min || null,
      salaryText,
      postedDate: raw.date ? new Date(raw.date).toLocaleDateString() : "Recently Posted",
      description,
      jobLink: raw.url || "https://remoteok.com",
      skills,
      requirements: ["Strong remote communication", "Technical expertise in engineering stack"],
      benefits: ["100% Remote Position", "Flexible Working Hours"],
    };
  }
}

export const fetchFromRemoteOK = (filters) => new RemoteOKProvider().fetchJobs(filters);
