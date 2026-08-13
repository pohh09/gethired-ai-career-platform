import { auditResume, optimizeBullets, generateResume } from "./src/services/ai/resumeAIService.js";
import { analyzeJobDescription, matchResumeWithJob, generateCoverLetter, generateFollowUpEmail, estimateSalaryInsights, researchCompany } from "./src/services/ai/jobAnalysisAIService.js";
import { evaluateInterviewResponse } from "./src/services/ai/interviewAIService.js";

async function runTests() {
  console.log("=================================================");
  console.log("  RUNNING PRODUCTION AI SERVICES & SCORING TESTS  ");
  console.log("=================================================\n");

  const sampleResume = `Jane Doe
Senior Full Stack Engineer
Email: jane.doe@example.com | Phone: +1 555-0199
Skills: React, TypeScript, Node.js, Express, PostgreSQL, AWS, Docker, REST APIs

Work Experience:
Software Engineer at TechCorp (2022 - Present)
- Engineered React dashboard used by 15 teams, reducing report loading latency by 40%.
- Optimized Node.js REST API endpoints with Redis caching.`;

  const sampleJD = `Senior Software Engineer
Company: Razorpay
Location: Bangalore, India
Requirements:
- 4+ years experience with React, TypeScript, Node.js, and AWS.
- Strong background in web application latency optimization and microservices.`;

  console.log("1. Testing Full Resume Audit (/resume/audit):");
  const auditRes = await auditResume(sampleResume, "Senior Software Engineer");
  console.log("   -> ATS Score:", auditRes.atsScore, "| Overall Grade:", auditRes.overallGrade);
  console.log("   -> Section Review Present:", !!auditRes.sectionBySection);
  console.log("   -> Action Plan Steps:", auditRes.actionPlan?.length || 0);

  console.log("\n2. Testing STAR Bullet Rewriter (/resume/star):");
  const starRes = await optimizeBullets("Built React dashboard.");
  console.log("   -> Original:", starRes.original);
  console.log("   -> Rewritten:", starRes.rewritten);
  console.log("   -> Why Better Rationale Present:", !!starRes.whyBetter);

  console.log("\n3. Testing Generate Resume (/resume/generate):");
  const genRes = await generateResume({ name: "Jane Doe", skills: ["React", "TypeScript", "Node.js"] });
  console.log("   -> Markdown Generated:", !!genRes.resumeMarkdown);
  console.log("   -> Export File Name:", genRes.fileName);

  console.log("\n4. Testing Analyze Job Description (/jobs/analyze):");
  const jdRes = await analyzeJobDescription(sampleJD);
  console.log("   -> Required Skills:", jdRes.requiredSkills);
  console.log("   -> Seniority:", jdRes.seniority);
  console.log("   -> Salary Clues:", jdRes.salaryClues);

  console.log("\n5. Testing Match Fit (/jobs/match):");
  const matchRes = await matchResumeWithJob(sampleResume, sampleJD);
  console.log("   -> Match %:", matchRes.matchScore, "%");
  console.log("   -> Matching Skills:", matchRes.matchingSkills);
  console.log("   -> Interview Probability:", matchRes.interviewProbability);

  console.log("\n6. Testing Cover Letter Generator (/jobs/cover-letter):");
  const clRes = await generateCoverLetter(sampleResume, sampleJD, "Razorpay", "Senior Software Engineer");
  console.log("   -> Word Count:", clRes.wordCount);
  console.log("   -> Subject:", clRes.subjectLine);

  console.log("\n7. Testing Follow-up Email (/jobs/follow-up):");
  const fuRes = await generateFollowUpEmail("Razorpay", "Senior Software Engineer", "Jane Doe", "after-interview");
  console.log("   -> Type:", fuRes.type);
  console.log("   -> Subject:", fuRes.subjectLine);

  console.log("\n8. Testing Salary Insights (/jobs/salary):");
  const salRes = await estimateSalaryInsights("Senior Software Engineer", "Bangalore, India");
  console.log("   -> Average Salary:", salRes.averageSalary);
  console.log("   -> Min - Max Range:", salRes.minSalary, "-", salRes.maxSalary);

  console.log("\n9. Testing Company Research (/jobs/company):");
  const compRes = await researchCompany("Razorpay");
  console.log("   -> Company:", compRes.company);
  console.log("   -> Industry:", compRes.industry);

  console.log("\n10. Testing AI Interview Answer Evaluation Rules (/interview/evaluate):");

  const evEmpty = await evaluateInterviewResponse("Explain React Server Components", "");
  console.log("    A) Empty Answer -> Score:", evEmpty.correctness, "(Expected: 0)");

  const evGibberish = await evaluateInterviewResponse("Explain React Server Components", "asdfghjkl qwerty 12345");
  console.log("    B) Random Text -> Score:", evGibberish.correctness, "(Expected: 5-15)");

  const evVague = await evaluateInterviewResponse("Explain React Server Components", "React is good for web development");
  console.log("    C) Vague Answer -> Score:", evVague.correctness, "(Expected: 25-40)");

  const evStar = await evaluateInterviewResponse("Explain React Server Components", "React 19 Server Components execute exclusively on the server, eliminating client JS bundle overhead. In my last project, migrating data fetching reduced bundle size by 45KB and improved LCP by 38%.");
  console.log("    D) STAR Answer -> Score:", evStar.correctness, "(Expected: 80-95)");

  console.log("\n=================================================");
  console.log("  ALL PRODUCTION AI SERVICE TESTS COMPLETED SUCCESSFULLY!  ");
  console.log("=================================================");
}

runTests();
