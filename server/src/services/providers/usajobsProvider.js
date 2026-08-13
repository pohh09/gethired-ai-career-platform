import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";

export class USAJobsProvider extends BaseProvider {
  constructor() {
    super("USAJobs");
  }

  async queryApi(query, filters = {}) {
    const apiKey = process.env.USAJOBS_API_KEY ? process.env.USAJOBS_API_KEY.trim() : "";
    const email = process.env.USAJOBS_EMAIL ? process.env.USAJOBS_EMAIL.trim() : "";

    if (!apiKey || !email) {
      throw new Error("USAJOBS_API_KEY or USAJOBS_EMAIL is not configured in environment variables.");
    }

    const url = `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(query)}&Page=${filters.page || 1}`;
    const headers = {
      "User-Agent": email,
      "Authorization-Key": apiKey,
      Accept: "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`USAJobs HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const items = payload?.SearchResult?.SearchResultItems || [];
    const data = items.map((i) => i.MatchedObjectDescriptor);

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    if (!raw) return null;

    const company = raw.OrganizationName || "US Public Sector";
    const role = raw.PositionTitle || "Software Engineer";
    const description = raw.UserArea?.Details?.JobSummary || `${role} opportunity at ${company}.`;

    return {
      id: `usajobs-${raw.PositionID || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      role,
      location: raw.PositionLocationDisplay || "United States",
      workplaceType: "Onsite",
      employmentType: "Full-time",
      salary: null,
      salaryText: "Public Service Pay Scale",
      postedDate: raw.PublicationStartDate || "Recently Posted",
      description,
      jobLink: raw.PositionURI || "https://www.usajobs.gov",
      skills: ["Engineering", "Public Tech"],
      requirements: ["US Public Service Eligibility"],
      benefits: ["Government Benefits", "Pension Plan"],
    };
  }
}

export const fetchFromUSAJobs = (filters) => new USAJobsProvider().fetchJobs(filters);
