import dotenv from "dotenv";
dotenv.config();

import { JoobleProvider, fetchFromJooble, normalizeJoobleJob, getJoobleFallbackJobs } from "./src/services/providers/joobleProvider.js";
import { QueryBuilder } from "./src/services/providers/QueryBuilder.js";
import { logoCache } from "./src/utils/logoCache.js";
import { fetchDiscoverJobs } from "./src/services/jobSearchService.js";

async function runTests() {
  console.log("=================================================");
  console.log("Testing Phase 2 Discover Jobs Backend Engine");
  console.log("=================================================\n");


  console.log("--- Test 1: Jooble Provider Exports ---");
  const joobleInstance = new JoobleProvider();
  console.log("JoobleProvider name:", joobleInstance.name);

  const fallbackJobs = getJoobleFallbackJobs();
  console.log("getJoobleFallbackJobs count:", fallbackJobs.length);

  const normalized = normalizeJoobleJob({
    id: "12345",
    title: "React Developer",
    company: "Razorpay",
    location: "Bangalore",
    snippet: "Looking for a React developer with Node.js experience.",
    salary: "₹20,000,00 - ₹25,000,00",
    link: "https://razorpay.com/jobs/123"
  });
  console.log("Normalized Jooble Job role:", normalized?.role, "| provider:", normalized?.provider);

  console.log("\n--- Test 2: Smart Search Expansions ---");
  const reactQueries = QueryBuilder.buildQueries({ query: "React" });
  console.log("Query 'React' expansions:", reactQueries);

  const nodeQueries = QueryBuilder.buildQueries({ query: "Node" });
  console.log("Query 'Node' expansions:", nodeQueries);

  const mernQueries = QueryBuilder.buildQueries({ query: "MERN" });
  console.log("Query 'MERN' expansions:", mernQueries);

  const softwareQueries = QueryBuilder.buildQueries({ query: "Software" });
  console.log("Query 'Software' expansions:", softwareQueries);

 console.log("\n--- Test 3: Logo Resolution & Caching ---");
  const razorpayLogo = logoCache.getValidCompanyLogo("Razorpay", "");
  console.log("Razorpay logo derived:", razorpayLogo);

  logoCache.markLogoAsBroken("https://invalid-domain-1234567.com/logo.png");
  console.log("Is broken logo detected:", logoCache.isLogoBroken("https://invalid-domain-1234567.com/logo.png"));

  console.log("\n--- Test 4: Orchestrator fetchDiscoverJobs ---");
  const discoverJobs = await fetchDiscoverJobs({ query: "React" });
  console.log("Total Discover Jobs Returned:", discoverJobs.length);
  if (discoverJobs.length > 0) {
    console.log("Top ranked job:", discoverJobs[0].role, "at", discoverJobs[0].company, "(Location:", discoverJobs[0].location, ")");
  }

  console.log("\n=================================================");
  console.log("Phase 2 Backend Engine Verification Complete!");
  console.log("=================================================");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
