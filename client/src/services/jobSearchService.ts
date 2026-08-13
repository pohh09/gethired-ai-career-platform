import api from "./api";
import type { DiscoverJob, ExtractedJobData } from "../types/job";
import { normalizeClientJSearchJob } from "./providers/jsearchProvider";
import { normalizeClientAdzunaJob } from "./providers/adzunaProvider";

export interface DiscoverJobFilters {
  query?: string;
  role?: string;
  skill?: string;
  company?: string;
  keywords?: string;
  location?: string;
  workplaceType?: string;
  experienceLevel?: string;
  employmentType?: string;
  sortBy?: string;
}

const FALLBACK_MULTI_PROVIDER_JOBS: DiscoverJob[] = [
  {
    id: "disc-1",
    provider: "JSearch",
    company: "Stripe",
    companyLogo: "https://logo.clearbit.com/stripe.com",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA / Remote",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salary: 180000,
    salaryText: "$165,000 - $195,000 / yr",
    postedDate: "1 day ago",
    description:
      "Architect high-performance payment dashboards and developer interfaces using React, TypeScript, and Tailwind CSS.",
    jobLink: "https://stripe.com/jobs",
    skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "GraphQL"],
    requirements: [
      "5+ years React & TypeScript experience",
      "Proven web performance optimization track record",
    ],
    benefits: [
      "Comprehensive Health Care",
      "401(k) Matching",
      "Remote Work Stipend",
    ],
  },
  {
    id: "disc-2",
    provider: "JSearch",
    company: "Vercel",
    companyLogo: "https://logo.clearbit.com/vercel.com",
    role: "Staff Product Engineer",
    location: "New York, NY / Remote",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salary: 195000,
    salaryText: "$180,000 - $210,000 / yr",
    postedDate: "2 days ago",
    description:
      "Build next-generation developer tooling, cloud deployment analytics, and serverless workflow interfaces with Next.js.",
    jobLink: "https://vercel.com/careers",
    skills: ["Next.js", "React", "TypeScript", "Node.js", "Serverless"],
    requirements: [
      "Expertise in Next.js internals",
      "Deep understanding of HTTP caching & CDNs",
    ],
    benefits: [
      "Unlimited PTO",
      "Flexible Work Schedule",
      "Annual Learning Budget",
    ],
  },
  {
    id: "disc-3",
    provider: "Adzuna",
    company: "Supabase",
    companyLogo: "https://logo.clearbit.com/supabase.com",
    role: "Full-Stack Developer",
    location: "Austin, TX / Remote",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salary: 150000,
    salaryText: "$135,000 - $165,000 / yr",
    postedDate: "Just now",
    description:
      "Build open-source Firebase alternatives with PostgreSQL, real-time subscriptions, auth flows, and automated storage integrations.",
    jobLink: "https://supabase.com/careers",
    skills: [
      "PostgreSQL",
      "React",
      "Node.js",
      "TypeScript",
      "Database Architecture",
    ],
    requirements: [
      "Experience with PostgreSQL & SQL optimization",
      "Node.js microservices background",
    ],
    benefits: [
      "Full Remote Flexibility",
      "Health & Dental Insurance",
      "Hardware Allowance",
    ],
  },
  {
    id: "disc-4",
    provider: "Adzuna",
    company: "Figma",
    companyLogo: "https://logo.clearbit.com/figma.com",
    role: "UI Systems Engineer",
    location: "San Francisco, CA / Onsite",
    workplaceType: "Onsite",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salary: 165000,
    salaryText: "$150,000 - $180,000 / yr",
    postedDate: "4 days ago",
    description:
      "Develop component design libraries, canvas renderers, and real-time collaboration engines powering design tools.",
    jobLink: "https://figma.com/careers",
    skills: [
      "TypeScript",
      "Canvas API",
      "Design Systems",
      "React",
      "WebAssembly",
    ],
    requirements: [
      "Experience with WebGL or Canvas rendering",
      "High scale design system development",
    ],
    benefits: [
      "Onsite Dining & Snacks",
      "Parental Leave",
      "Competitive Equity",
    ],
  },
  {
    id: "disc-5",
    provider: "JSearch",
    company: "Linear",
    companyLogo: "https://logo.clearbit.com/linear.app",
    role: "Frontend Systems Architect",
    location: "San Francisco, CA / Hybrid",
    workplaceType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead",
    salary: 185000,
    salaryText: "$170,000 - $200,000 / yr",
    postedDate: "3 days ago",
    description:
      "Craft ultra-fast real-time issue tracking interfaces, offline-first WebGL rendering engines, and keyboard-centric user interactions.",
    jobLink: "https://linear.app/careers",
    skills: ["TypeScript", "React", "State Management", "WebGL", "Performance"],
    requirements: [
      "Strong proficiency in TypeScript",
      "Experience with local-first application architecture",
    ],
    benefits: [
      "Competitive Equity Package",
      "Wellness Benefit",
      "Company Offsites",
    ],
  },
];

export async function searchDiscoverJobs(
  filters: DiscoverJobFilters = {},
): Promise<DiscoverJob[]> {
  try {
    const res = await api.get("/jobs/discover", { params: filters });
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data.map((job: any) =>
        job.provider === "Adzuna"
          ? normalizeClientAdzunaJob(job)
          : normalizeClientJSearchJob(job),
      );
    }
  } catch (error) {
    console.warn(
      "Backend discover endpoint error. Falling back to client data.",
      error,
    );
  }

  return filterJobs(FALLBACK_MULTI_PROVIDER_JOBS, filters);
}

export async function extractJobDataFromUrlOrText(payload: {
  url?: string;
  text?: string;
}): Promise<ExtractedJobData> {
  try {
    const res = await api.post("/jobs/import/extract", payload);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    console.warn(
      "Backend extract endpoint error. Returning heuristic client parsing.",
      error,
    );
  }

  const url = payload.url || "";
  const text = payload.text || "";

  let company = "Imported Employer";
  if (url.includes("linkedin.com")) company = "LinkedIn Employer";
  else if (url.includes("greenhouse.io")) company = "Greenhouse Employer";
  else if (url.includes("lever.co")) company = "Lever Employer";
  else if (url) {
    try {
      const host = new URL(url).hostname.replace("www.", "").split(".")[0];
      if (host) company = host.charAt(0).toUpperCase() + host.slice(1);
    } catch (_e) {
    }
  }

  const isRemote = /remote/i.test(text) || /remote/i.test(url);

  return {
    company,
    role: "Software Developer",
    location: isRemote ? "Remote" : "San Francisco, CA",
    workplaceType: isRemote ? "Remote" : "Onsite",
    employmentType: "Full-time",
    salary: 150000,
    salaryText: "$130,000 - $170,000 / yr",
    description: text || `Imported job listing from ${url || "online portal"}.`,
    skills: ["TypeScript", "React", "Node.js", "APIs"],
    requirements: [
      "Strong technical proficiency",
      "2+ years web engineering experience",
    ],
    benefits: [
      "Competitive Compensation",
      "Health & Dental Care",
      "Remote Flexibility",
    ],
    jobLink: url || "",
  };
}

function filterJobs(
  jobs: DiscoverJob[],
  filters: DiscoverJobFilters,
): DiscoverJob[] {
  let result = [...jobs];

  const q = (filters.query || "").toLowerCase().trim();
  const roleQ = (filters.role || "").toLowerCase().trim();
  const skillQ = (filters.skill || "").toLowerCase().trim();
  const companyQ = (filters.company || "").toLowerCase().trim();
  const kwQ = (filters.keywords || "").toLowerCase().trim();
  const locQ = (filters.location || "").toLowerCase().trim();

  const terms = [q, roleQ, skillQ, companyQ, kwQ].filter(Boolean);

  if (terms.length > 0) {
    result = result.filter((job) => {
      const haystack = [
        job.company,
        job.role,
        job.location,
        job.description,
        ...(job.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      return terms.every((t) => haystack.includes(t));
    });
  }

  if (locQ) {
    result = result.filter((j) =>
      (j.location || "").toLowerCase().includes(locQ),
    );
  }

  if (filters.workplaceType && filters.workplaceType !== "All") {
    result = result.filter(
      (j) =>
        (j.workplaceType || "").toLowerCase() ===
        filters.workplaceType?.toLowerCase(),
    );
  }

  if (filters.employmentType && filters.employmentType !== "All") {
    result = result.filter(
      (j) =>
        (j.employmentType || "").toLowerCase() ===
        filters.employmentType?.toLowerCase(),
    );
  }

  if (filters.sortBy === "Newest") {
    result = [...result].reverse();
  }

  return result;
}
