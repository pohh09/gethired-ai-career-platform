export function escapeRegExp(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createSkillMatcher(skill = "") {
  if (!skill) return null;
  const escaped = escapeRegExp(skill.trim());
  return new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, "i");
}

export function normalizeSearchTerm(term = "") {
  let cleaned = term.toLowerCase().trim();
  if (cleaned === "reactjs" || cleaned === "react.js") return "react";
  if (cleaned === "nodejs" || cleaned === "node.js") return "node";
  if (cleaned === "vuejs" || cleaned === "vue.js") return "vue";
  if (cleaned === "nextjs" || cleaned === "next.js") return "next";
  if (cleaned === "expressjs" || cleaned === "express.js") return "express";
  return cleaned;
}

export function fuzzyMatchJob(job = {}, queryTerms = []) {
  if (!queryTerms || queryTerms.length === 0) return true;

  const haystackParts = [
    job.role || "",
    job.company || "",
    job.location || "",
    job.description || "",
    Array.isArray(job.skills) ? job.skills.join(" ") : "",
    job.workplaceType || "",
    job.employmentType || ""
  ];
  const haystack = haystackParts.join(" ").toLowerCase();

  return queryTerms.every((rawTerm) => {
    const term = normalizeSearchTerm(rawTerm);
    if (!term) return true;

    if (haystack.includes(term)) return true;

    const matcher = createSkillMatcher(term);
    if (matcher && matcher.test(haystack)) return true;

    if (term === "software" && (haystack.includes("developer") || haystack.includes("engineer") || haystack.includes("architect"))) {
      return true;
    }
    if (term === "react" && (haystack.includes("reactjs") || haystack.includes("frontend") || haystack.includes("mern"))) {
      return true;
    }
    if (term === "developer" && (haystack.includes("engineer") || haystack.includes("programmer") || haystack.includes("coder"))) {
      return true;
    }

    return false;
  });
}
