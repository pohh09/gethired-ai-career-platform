import fetch from "node-fetch";
import { BaseProvider } from "./BaseProvider.js";
import { createSkillMatcher } from "../../utils/regexUtils.js";

export class JoobleProvider extends BaseProvider {
  constructor() {
    super("Jooble");
  }

  async queryApi(query, filters = {}) {
    const apiKey = process.env.JOOBLE_API_KEY ? process.env.JOOBLE_API_KEY.trim() : "";
    if (!apiKey) {
      throw new Error("JOOBLE_API_KEY is not configured in environment variables.");
    }

    const url = `https://jooble.org/api/${apiKey}`;
    const headers = { "Content-Type": "application/json", Accept: "application/json" };
    const body = JSON.stringify({
      keywords: query,
      location: filters.location || "India",
      page: String(filters.page || 1),
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });
    const status = response.status;

    if (!response.ok) {
      throw new Error(`Jooble HTTP ${status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload && Array.isArray(payload.jobs) ? payload.jobs : [];

    return { url, status, data, payload, headers };
  }

  normalizeJob(raw) {
    return normalizeJoobleJob(raw);
  }
}

export function normalizeJoobleJob(raw) {
  if (!raw) return null;

  const company = raw.company || "Tech Employer";
  const role = raw.title ? raw.title.replace(/<\/?[^>]+(>|$)/g, "") : "Software Engineer";
  const description = raw.snippet ? raw.snippet.replace(/<\/?[^>]+(>|$)/g, "") : `${role} role at ${company}.`;

  const isRemote = /remote/i.test(role) || /remote/i.test(description) || /remote/i.test(raw.location || "");
  const workplaceType = isRemote ? "Remote" : "Onsite";

  const location = raw.location || (isRemote ? "Remote India" : "India");
  const salaryText = raw.salary || "Competitive Salary";
  const skills = extractSkillsFromText(`${role} ${description}`);

  return {
    id: `jooble-${raw.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    provider: "Jooble",
    company,
    companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    role,
    location,
    workplaceType,
    employmentType: "Full-time",
    salary: null,
    salaryText,
    postedDate: raw.updated ? new Date(raw.updated).toLocaleDateString() : "Recently Posted",
    description,
    jobLink: raw.link || "https://jooble.org",
    skills,
    requirements: ["Relevant software engineering experience", "Strong technical background"],
    benefits: ["Competitive Compensation", "Flexible Working Environment"],
  };
}

function extractSkillsFromText(text = "") {
  const commonTech = [
    "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
    "PostgreSQL", "AWS", "Docker", "Next.js", "GraphQL", "Tailwind CSS",
    "MongoDB", "REST APIs", "Kubernetes", "C++", "C#", "Go", "Git"
  ];
  return commonTech.filter((tech) => {
    const matcher = createSkillMatcher(tech);
    return matcher ? matcher.test(text) : false;
  }).slice(0, 5);
}

export async function fetchFromJooble(filters = {}) {
  try {
    const provider = new JoobleProvider();
    const result = await provider.fetchJobs(filters);
    if (result && Array.isArray(result.jobs) && result.jobs.length > 0) {
      return result.jobs;
    }
  } catch (err) {
    console.warn(`[JoobleProvider] Live search failed: ${err.message}`);
  }
  return getJoobleFallbackJobs();
}

export function getJoobleFallbackJobs() {
  return [
    {
      id: "jooble-fb-1",
      provider: "Jooble",
      company: "Razorpay",
      companyLogo: "https://logo.clearbit.com/razorpay.com",
      role: "Full Stack Engineer (Node.js & React)",
      location: "Bangalore, KA / Hybrid",
      workplaceType: "Hybrid",
      employmentType: "Full-time",
      salary: 2400000,
      salaryText: "₹22,000,00 - ₹28,000,00 / yr",
      postedDate: "Just now",
      description: "Architect scalable payment gateway interfaces, merchant dashboards, and API microservices using React, Node.js, and PostgreSQL.",
      jobLink: "https://razorpay.com/jobs",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Microservices"],
      requirements: ["Experience with fintech or payment systems", "Proficiency in Node.js microservices"],
      benefits: ["Flexible Working Hours", "ESOP Grants", "Comprehensive Medical Cover"],
    },
    {
      id: "jooble-fb-2",
      provider: "Jooble",
      company: "Paytm",
      companyLogo: "https://logo.clearbit.com/paytm.com",
      role: "Backend Engineer (Java & Node.js)",
      location: "Noida, UP / Onsite",
      workplaceType: "Onsite",
      employmentType: "Full-time",
      salary: 2200000,
      salaryText: "₹20,000,00 - ₹25,000,00 / yr",
      postedDate: "1 day ago",
      description: "Build high-speed transaction processors, banking gateway integrations, and fraud prevention microservices.",
      jobLink: "https://paytm.com/careers",
      skills: ["Java", "Node.js", "Kafka", "MySQL", "Docker"],
      requirements: ["Solid computer science fundamentals", "Experience with high-throughput messaging queues"],
      benefits: ["Health Cover", "Performance Bonus", "Transport Facility"],
    },
    {
      id: "jooble-fb-3",
      provider: "Jooble",
      company: "Flipkart",
      companyLogo: "https://logo.clearbit.com/flipkart.com",
      role: "Senior React Developer",
      location: "Bangalore, KA / Remote India",
      workplaceType: "Remote",
      employmentType: "Full-time",
      salary: 2800000,
      salaryText: "₹25,000,00 - ₹32,000,00 / yr",
      postedDate: "2 days ago",
      description: "Build high-throughput e-commerce web applications and frontend systems using React and Next.js.",
      jobLink: "https://www.flipkartcareers.com",
      skills: ["React", "TypeScript", "Next.js", "Redux"],
      requirements: ["4+ years React development experience", "High performance web optimization"],
      benefits: ["Health Insurance", "Remote Work Allowance", "Wellness Perks"],
    },
  ];
}

