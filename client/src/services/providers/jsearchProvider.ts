import type { DiscoverJob } from "../../types/job";

export function normalizeClientJSearchJob(raw: any): DiscoverJob {
  const company = raw.company || raw.employer_name || "Tech Employer";
  const role = raw.role || raw.job_title || "Software Engineer";
  const isRemote = Boolean(raw.workplaceType === "Remote" || raw.job_is_remote);

  return {
    id:
      raw.id ||
      `jsearch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    provider: "JSearch",
    company,
    companyLogo:
      raw.companyLogo ||
      raw.employer_logo ||
      `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    role,
    location: raw.location || (isRemote ? "Remote" : "San Francisco, CA"),
    workplaceType: raw.workplaceType || (isRemote ? "Remote" : "Onsite"),
    employmentType: raw.employmentType || "Full-time",
    experienceLevel: raw.experienceLevel || "Mid Level",
    salary: raw.salary || null,
    salaryText: raw.salaryText || "Competitive Salary",
    postedDate: raw.postedDate || "Recently Posted",
    description: raw.description || `${role} opportunity at ${company}.`,
    jobLink:
      raw.jobLink ||
      `https://google.com/search?q=${encodeURIComponent(`${company} ${role}`)}`,
    skills: Array.isArray(raw.skills)
      ? raw.skills
      : ["React", "TypeScript", "Node.js"],
    requirements: Array.isArray(raw.requirements)
      ? raw.requirements
      : ["Solid software engineering experience"],
    benefits: Array.isArray(raw.benefits)
      ? raw.benefits
      : ["Health Insurance", "Remote Flexibility"],
  };
}
