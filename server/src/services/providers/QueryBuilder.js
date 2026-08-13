const FOREIGN_COUNTRIES = [
  "usa", "united states", "us", "uk", "united kingdom", "canada",
  "germany", "australia", "singapore", "japan", "france", "netherlands",
  "dubai", "uae", "switzerland", "ireland"
];

export class QueryBuilder {
  static detectTargetCountry(rawLoc = "") {
    const locLower = (rawLoc || "").toLowerCase().trim();
    if (!locLower) return "India";

    for (const country of FOREIGN_COUNTRIES) {
      if (locLower.includes(country)) {
        return country.toUpperCase();
      }
    }
    return "India";
  }

  static buildQueries(filters = {}) {
    const rawQuery = (filters.query || "").trim();
    const rawRole = (filters.role || "").trim();
    const rawSkill = (filters.skill || filters.keywords || "").trim();
    const rawLoc = (filters.location || "").trim();

    const targetCountry = this.detectTargetCountry(rawLoc);
    const isIndiaDefault = targetCountry === "India";

    let locationSuffix = "";
    if (rawLoc) {
      if (isIndiaDefault && !rawLoc.toLowerCase().includes("india")) {
        locationSuffix = `${rawLoc} India`;
      } else {
        locationSuffix = rawLoc;
      }
    } else if (isIndiaDefault) {
      locationSuffix = "India";
    }

    const formatQuery = (baseRole) => {
      const roleText = baseRole.trim();
      return locationSuffix ? `${roleText} ${locationSuffix}`.trim() : roleText;
    };

    const inputTerm = (rawQuery || rawRole || rawSkill || "Software").toLowerCase().trim();
    const queries = [];

    if (inputTerm.includes("react")) {
      queries.push(formatQuery("React Developer"));
      queries.push(formatQuery("React JS Developer"));
      queries.push(formatQuery("Frontend Developer"));
      queries.push(formatQuery("Frontend Engineer"));
      queries.push(formatQuery("Software Engineer React"));
    } else if (inputTerm.includes("node") || inputTerm.includes("express")) {
      queries.push(formatQuery("Node.js Developer"));
      queries.push(formatQuery("Backend Developer"));
      queries.push(formatQuery("Backend Engineer"));
      queries.push(formatQuery("Express.js Developer"));
    } else if (inputTerm.includes("mern")) {
      queries.push(formatQuery("MERN Stack Developer"));
      queries.push(formatQuery("Full Stack Developer"));
      queries.push(formatQuery("React Node Developer"));
    } else if (inputTerm.includes("software")) {
      queries.push(formatQuery("Software Engineer"));
      queries.push(formatQuery("Software Developer"));
      queries.push(formatQuery("Application Developer"));
    } else if (inputTerm.includes("python")) {
      queries.push(formatQuery("Python Developer"));
      queries.push(formatQuery("Python Software Engineer"));
      queries.push(formatQuery("Backend Python Developer"));
    } else if (inputTerm.includes("java")) {
      queries.push(formatQuery("Java Developer"));
      queries.push(formatQuery("Java Software Engineer"));
      queries.push(formatQuery("Full Stack Java Developer"));
    } else if (inputTerm.includes("ai") || inputTerm.includes("machine")) {
      queries.push(formatQuery("AI Engineer"));
      queries.push(formatQuery("Machine Learning Engineer"));
      queries.push(formatQuery("Data Scientist AI"));
    } else {
      const baseRole = rawQuery || rawRole || "Software Engineer";
      queries.push(formatQuery(baseRole));
      queries.push(formatQuery(`${baseRole} Developer`));
    }

    queries.push(formatQuery("Frontend Developer"));
    queries.push(formatQuery("Software Engineer"));
    queries.push(formatQuery("Software Developer"));
    queries.push(formatQuery("Developer"));

    const uniqueQueries = [];
    const seen = new Set();
    for (const q of queries) {
      const clean = q.trim();
      if (clean && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        uniqueQueries.push(clean);
      }
    }

    return uniqueQueries;
  }
}

