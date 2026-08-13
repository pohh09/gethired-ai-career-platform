import type { DiscoverJob } from "../../types/job";

export function normalizeClientAdzunaJob(raw: any): DiscoverJob {
  const company = raw.company || "Tech Company";
  const role = raw.role || "Software Engineer";
  const isRemote = Boolean(
    raw.workplaceType === "Remote" || /remote/i.test(role),
  );

  return {
    id:
      raw.id ||
      `adzuna-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    provider: "Adzuna",
    company,
    companyLogo:
      raw.companyLogo ||
      `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    role,
    location: raw.location || (isRemote ? "Remote" : "New York, NY"),
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
      : ["TypeScript", "Python", "SQL"],
    requirements: Array.isArray(raw.requirements)
      ? raw.requirements
      : ["Strong engineering background"],
    benefits: Array.isArray(raw.benefits)
      ? raw.benefits
      : ["Competitive Equity", "Unlimited PTO"],
  };
}
