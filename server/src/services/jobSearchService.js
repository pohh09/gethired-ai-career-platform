import { getActiveProviders } from "./providers/index.js";
import { jobCache } from "../utils/jobCache.js";
import { fuzzyMatchJob } from "../utils/regexUtils.js";

const INDIAN_TECH_HUBS = [
  "india", "mumbai", "pune", "bangalore", "bengaluru", "hyderabad",
  "chennai", "delhi", "noida", "gurgaon", "gurugram", "navi mumbai",
  "thane", "kolkata", "ahmedabad", "ncr", "remote india"
];

export async function fetchDiscoverJobs(filters = {}) {
  const cachedJobs = jobCache.get(filters);
  if (cachedJobs) {
    console.log(`[JobSearchService] Returning ${cachedJobs.length} jobs from 5-minute cache.`);
    return cachedJobs;
  }

  const providers = getActiveProviders();
  const providerReturns = [];

  const results = await Promise.allSettled(
    providers.map((provider) => provider.fetchJobs(filters))
  );

  results.forEach((res, idx) => {
    const providerName = providers[idx]?.name || `Provider-${idx}`;
    if (res.status === "fulfilled" && res.value) {
      const pRes = res.value;
      const count = Array.isArray(pRes.jobs) ? pRes.jobs.length : 0;
      providerReturns.push({
        provider: providerName,
        query: pRes.queryUsed || filters.query || "Software Engineer India",
        count,
        jobs: Array.isArray(pRes.jobs) ? pRes.jobs : [],
      });
    } else {
      providerReturns.push({
        provider: providerName,
        query: filters.query || "Software Engineer India",
        count: 0,
        jobs: [],
      });
    }
  });

  console.log(`\n========================================`);
  providerReturns.forEach((p, idx) => {
    console.log(`Provider: ${p.provider}`);
    if (idx === 0) {
      console.log(`Query: ${p.query}`);
    }
    console.log(`Returned: ${p.count}\n`);
  });

  const interleavedJobs = interleaveProviderJobs(providerReturns.map((p) => p.jobs));

  let workingSet = interleavedJobs;
  if (workingSet.length === 0) {
    console.warn("[JobSearchService] 0 live provider listings found. Loading quality fallbacks.");
    workingSet = getQualityIndiaFallbackJobs();
  }

  const { uniqueJobs, duplicatesRemoved } = deepDeduplicateJobs(workingSet);
  console.log(`Duplicates Removed: ${duplicatesRemoved}\n`);

  const scoredJobs = scoreAndRankJobs(uniqueJobs, filters);

  const finalJobs = applyDiversityFilter(scoredJobs);
  console.log(`Final Jobs: ${finalJobs.length}`);
  console.log(`========================================\n`);

  jobCache.set(filters, finalJobs);

  return finalJobs;
}

function interleaveProviderJobs(providerJobArrays = []) {
  const result = [];
  const maxLen = Math.max(...providerJobArrays.map((arr) => arr.length), 0);

  for (let i = 0; i < maxLen; i++) {
    for (const jobArr of providerJobArrays) {
      if (i < jobArr.length) {
        result.push(jobArr[i]);
      }
    }
  }
  return result;
}

function deepDeduplicateJobs(jobs = []) {
  const map = new Map();
  let duplicatesRemoved = 0;

  for (const job of jobs) {
    const normCompany = (job.company || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const normRole = (job.role || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const normLoc = (job.location || "").split("/")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    const normLink = (job.jobLink || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const descHash = (job.description || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 80);

    const dedupeKey = `${normCompany}|${normRole}|${normLoc}|${normLink.slice(-30)}|${descHash}`;

    if (!map.has(dedupeKey)) {
      map.set(dedupeKey, job);
    } else {
      duplicatesRemoved++;
      const existing = map.get(dedupeKey);
      if (calculateDateScore(job.postedDate) > calculateDateScore(existing.postedDate)) {
        map.set(dedupeKey, job);
      }
    }
  }

  return { uniqueJobs: Array.from(map.values()), duplicatesRemoved };
}

function scoreAndRankJobs(jobs = [], filters = {}) {
  const queryTerm = (filters.query || filters.role || "").toLowerCase().trim();

  const FOREIGN_LOCATIONS = [
    "usa", "united states", "us", "uk", "united kingdom", "canada",
    "germany", "australia", "singapore", "japan", "france", "netherlands",
    "dubai", "uae", "switzerland", "ireland"
  ];

  const scored = jobs.map((job) => {
    let score = 0;
    const locLower = (job.location || "").toLowerCase();
    const titleLower = (job.role || "").toLowerCase();

    const isIndianHub = INDIAN_TECH_HUBS.some((hub) => locLower.includes(hub));
    if (isIndianHub) score += 25;

    if (locLower.includes("remote") && (locLower.includes("india") || isIndianHub)) {
      score += 20;
    }

    if (queryTerm && titleLower.includes(queryTerm)) {
      score += 20;
    }

    const dateScore = calculateDateScore(job.postedDate);
    const ageMs = Date.now() - dateScore;
    if (dateScore > 0 && ageMs <= 3 * 86400000) {
      score += 15;
    } else if (dateScore > 0 && ageMs <= 7 * 86400000) {
      score += 10;
    }

    if (job.salary || (job.salaryText && !job.salaryText.toLowerCase().includes("competitive"))) {
      score += 10;
    }

    if (job.companyLogo && !job.companyLogo.includes("ui-avatars.com")) {
      score += 10;
    }

    const isForeign = FOREIGN_LOCATIONS.some((f) => locLower.includes(f)) && !locLower.includes("india");
    if (isForeign) {
      score -= 30;
    }

    if (dateScore > 0 && ageMs > 30 * 86400000) {
      score -= 15;
    }

    return { job, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((item) => item.job);
}


function applyDiversityFilter(jobs = []) {
  const result = [];
  const companyCounts = new Map();

  for (const job of jobs) {
    const key = (job.company || "Unknown").toLowerCase().trim();
    const count = companyCounts.get(key) || 0;

    if (count < 3) {
      companyCounts.set(key, count + 1);
      result.push(job);
    }
  }

  return result;
}

function calculateDateScore(dateStr = "") {
  if (!dateStr) return 0;
  const lower = dateStr.toLowerCase();
  if (lower.includes("just now") || lower.includes("recently")) return Date.now();
  if (lower.includes("day ago") || lower.includes("1 day")) return Date.now() - 86400000;
  if (lower.includes("days ago")) {
    const match = lower.match(/(\d+)\s*days?/);
    if (match) return Date.now() - parseInt(match[1], 10) * 86400000;
  }
  const parsed = new Date(dateStr).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

export function getJobSearchDebugStats() {
  return jobCache.getHealthReport();
}

function getQualityIndiaFallbackJobs() {
  return [
    {
      id: "disc-ind-1",
      provider: "Jooble",
      company: "Flipkart",
      companyLogo: "https://logo.clearbit.com/flipkart.com",
      role: "Senior Frontend Developer",
      location: "Bangalore, KA / Remote India",
      workplaceType: "Remote",
      employmentType: "Full-time",
      salary: 2800000,
      salaryText: "₹25,000,00 - ₹32,000,00 / yr",
      postedDate: "1 day ago",
      description: "Build high-throughput e-commerce web applications, high-performance checkout flows, and design systems using React, TypeScript, and Next.js.",
      jobLink: "https://www.flipkartcareers.com",
      skills: ["React", "TypeScript", "Next.js", "Redux", "REST APIs"],
      requirements: ["4+ years React & web performance experience", "Strong algorithms & system design skills"],
      benefits: ["Health & Dental Insurance", "Annual Wellness Stipend", "Remote Work Flexibility"],
    },
    {
      id: "disc-ind-2",
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
      id: "disc-ind-3",
      provider: "JSearch",
      company: "Zomato",
      companyLogo: "https://logo.clearbit.com/zomato.com",
      role: "React JS Lead Developer",
      location: "Gurgaon, HR / Hybrid",
      workplaceType: "Hybrid",
      employmentType: "Full-time",
      salary: 3200000,
      salaryText: "₹30,000,00 - ₹36,000,00 / yr",
      postedDate: "2 days ago",
      description: "Lead frontend engineering teams building real-time order tracking dashboards, customer portals, and web design systems.",
      jobLink: "https://www.zomato.com/careers",
      skills: ["React", "JavaScript", "Webpack", "Tailwind CSS", "GraphQL"],
      requirements: ["5+ years building consumer web apps", "Experience leading engineering pods"],
      benefits: ["Unlimited PTO", "Free Onsite Meals", "Parental Leave"],
    },
    {
      id: "disc-ind-4",
      provider: "Adzuna",
      company: "Swiggy",
      companyLogo: "https://logo.clearbit.com/swiggy.in",
      role: "Software Development Engineer II",
      location: "Bangalore, KA / Remote India",
      workplaceType: "Remote",
      employmentType: "Full-time",
      salary: 2600000,
      salaryText: "₹24,000,00 - ₹30,000,00 / yr",
      postedDate: "3 days ago",
      description: "Develop real-time logistics analytics, dispatch consoles, and vendor management web tools with React and Node.js.",
      jobLink: "https://careers.swiggy.com",
      skills: ["React", "Node.js", "AWS", "Redis", "TypeScript"],
      requirements: ["Proven experience in distributed systems", "High proficiency in React & TypeScript"],
      benefits: ["Remote Work Allowance", "Health Insurance", "Learning Budget"],
    },
    {
      id: "disc-ind-5",
      provider: "Jooble",
      company: "Paytm",
      companyLogo: "https://logo.clearbit.com/paytm.com",
      role: "Backend Engineer (Java & Node.js)",
      location: "Noida, UP / Onsite",
      workplaceType: "Onsite",
      employmentType: "Full-time",
      salary: 2200000,
      salaryText: "₹20,000,00 - ₹25,000,00 / yr",
      postedDate: "4 days ago",
      description: "Build high-speed transaction processors, banking gateway integrations, and fraud prevention microservices.",
      jobLink: "https://paytm.com/careers",
      skills: ["Java", "Node.js", "Kafka", "MySQL", "Docker"],
      requirements: ["Solid computer science fundamentals", "Experience with high-throughput messaging queues"],
      benefits: ["Health Cover", "Performance Bonus", "Transport Facility"],
    },
  ];
}
