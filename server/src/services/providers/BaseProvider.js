import { QueryBuilder } from "./QueryBuilder.js";
import { jobCache } from "../../utils/jobCache.js";
import { logoCache } from "../../utils/logoCache.js";

export class BaseProvider {
  constructor(name) {
    if (this.constructor === BaseProvider) {
      throw new Error("BaseProvider is abstract and cannot be instantiated directly.");
    }
    this.name = name;
  }

  async fetchJobs(filters = {}) {
    const startTime = Date.now();
    const isDebug = process.env.DEBUG_JOBS === "true";
    const queries = QueryBuilder.buildQueries(filters);

    let lastError = null;
    let finalStatusCode = 200;
    let finalUrl = "";
    let finalQueryUsed = queries[0] || "Software Engineer India";
    let rawJobs = [];
    let fallbackCount = 0;
    let apiLimits = null;

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (i > 0) fallbackCount++;

      try {
        const pagesToFetch = [1, 2, 3];
        const pageResults = await Promise.allSettled(
          pagesToFetch.map((p) =>
            this.executeWithRetry(() => this.queryApi(query, { ...filters, page: p }), 1, 400)
          )
        );

        let queryJobs = [];
        pageResults.forEach((pRes) => {
          if (pRes.status === "fulfilled" && pRes.value) {
            finalUrl = pRes.value.url || finalUrl;
            finalStatusCode = pRes.value.status || finalStatusCode;
            if (pRes.value.apiLimits) apiLimits = pRes.value.apiLimits;
            if (Array.isArray(pRes.value.data) && pRes.value.data.length > 0) {
              queryJobs.push(...pRes.value.data);
            }
          }
        });

        finalQueryUsed = query;

        if (isDebug) {
          console.log(`\n========================================`);
          console.log(`[${this.name.toUpperCase()} DEBUG MODE]`);
          console.log(`Provider: ${this.name}`);
          console.log(`Generated Query: "${query}"`);
          console.log(`Pages Fetched: 3`);
          console.log(`Returned Jobs (Raw): ${queryJobs.length}`);
          console.log(`Execution Time: ${Date.now() - startTime}ms`);
          console.log(`========================================\n`);
        }

        if (queryJobs.length > 0) {
          rawJobs = queryJobs;
          lastError = null;
          break;
        }
      } catch (err) {
        lastError = err.message || String(err);
        finalQueryUsed = query;
      }
    }

    const executionTimeMs = Date.now() - startTime;

    let normalizedJobs = [];
    try {
      normalizedJobs = rawJobs
        .map((raw) => {
          try {
            return this.normalizeAndValidate(raw);
          } catch (normErr) {
            return null;
          }
        })
        .filter(Boolean);
    } catch (normErr) {
      console.error(`[${this.name}] Normalization Error:`, normErr.message);
      lastError = normErr.message;
    }

    const indianJobsCount = normalizedJobs.filter((j) => isIndianLocation(j.location)).length;
    const foreignJobsCount = normalizedJobs.length - indianJobsCount;

    let status = "working";
    if (lastError && normalizedJobs.length === 0) {
      status = "error";
    } else if (normalizedJobs.length === 0) {
      status = "no_results";
    } else if (fallbackCount > 0) {
      status = "fallback_used";
    }

    const result = {
      provider: this.name,
      status,
      jobsReturned: normalizedJobs.length,
      indianJobs: indianJobsCount,
      foreignJobs: foreignJobsCount,
      fallbackCount,
      queryUsed: finalQueryUsed,
      requestUrl: finalUrl,
      statusCode: finalStatusCode,
      executionTimeMs,
      errorMessage: lastError,
      apiLimits,
      jobs: normalizedJobs,
    };

    jobCache.recordProviderMetric(this.name, result);
    return result;
  }

  async executeWithRetry(fn, retries = 1, delayMs = 400) {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt > retries) throw err;
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt - 1)));
      }
    }
  }

  normalizeAndValidate(raw) {
    const job = this.normalizeJob(raw);
    if (!job) return null;

    const company = (job.company || "Tech Company").trim();
    const role = (job.role || "Software Developer").trim();

    const companyLogo = logoCache.getValidCompanyLogo(company, job.companyLogo);

    return {
      id: job.id || `${this.name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: this.name,
      company,
      companyLogo,
      role,
      location: job.location || "Remote",
      workplaceType: job.workplaceType || "Remote",
      employmentType: job.employmentType || "Full-time",
      salary: typeof job.salary === "number" ? job.salary : null,
      salaryText: job.salaryText || "Competitive Salary",
      postedDate: job.postedDate || "Recently Posted",
      description: job.description || `${role} opportunity at ${company}.`,
      skills: Array.isArray(job.skills) && job.skills.length > 0 ? job.skills : ["Software Engineering"],
      requirements: Array.isArray(job.requirements) && job.requirements.length > 0 ? job.requirements : ["Strong technical capabilities"],
      benefits: Array.isArray(job.benefits) && job.benefits.length > 0 ? job.benefits : ["Competitive compensation package"],
      jobLink: job.jobLink || "https://google.com/search?q=" + encodeURIComponent(`${company} ${role}`),

      aiMatchScore: job.aiMatchScore || null,
      skillGaps: job.skillGaps || [],
      jobFitPercentage: job.jobFitPercentage || null,
    };
  }

  async queryApi(_query, _filters) {
    throw new Error(`queryApi() must be implemented by subclass ${this.name}`);
  }

  normalizeJob(_raw) {
    throw new Error(`normalizeJob() must be implemented by subclass ${this.name}`);
  }
}

function isIndianLocation(location = "") {
  const locLower = (location || "").toLowerCase();
  const indianKeywords = [
    "india", "mumbai", "pune", "bangalore", "bengaluru", "hyderabad",
    "chennai", "delhi", "noida", "gurgaon", "gurugram", "navi mumbai",
    "thane", "kolkata", "ahmedabad", "ncr"
  ];
  return indianKeywords.some((k) => locLower.includes(k));
}
