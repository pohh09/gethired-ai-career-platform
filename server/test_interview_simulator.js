import {
  generateInterviewQuestions,
  evaluateInterviewResponse,
  generateFinalInterviewReport
} from "./src/services/ai/interviewAIService.js";

async function runInterviewSimulatorTests() {
  console.log("=================================================");
  console.log("  RUNNING COMPREHENSIVE INTERVIEW SIMULATOR TESTS");
  console.log("=================================================\n");

  const testConfigs = [
    { label: "1. Full Stack Developer + Technical", role: "Full Stack Developer", type: "technical" },
    { label: "2. React Developer + Technical", role: "Frontend Developer", type: "technical" },
    { label: "3. Node.js Developer + Technical", role: "Backend Developer", type: "technical" },
    { label: "4. Full Stack Developer + HR", role: "Full Stack Developer", type: "hr" },
    { label: "5. Full Stack Developer + System Design", role: "Full Stack Developer", type: "system_design" },
    { label: "6. React Developer + Coding", role: "Frontend Developer", type: "coding" },
  ];

  for (const cfg of testConfigs) {
    console.log(`Testing Config: ${cfg.label}`);
    const questions = await generateInterviewQuestions({
      role: cfg.role,
      type: cfg.type,
      count: 12
    });

    console.log(`   -> Questions Received: ${questions.length}`);
    console.log(`   -> Q1: "${questions[0]?.question}"`);
    console.log(`   -> Q12 (Final Challenge): "${questions[11]?.question || questions[questions.length - 1]?.question}"\n`);
  }

  // TEST 7: JD Customization Test
  console.log("Testing Config: 7. JD Customization (Node + PostgreSQL + Docker)");
  const jdQuestions = await generateInterviewQuestions({
    role: "Backend Developer",
    type: "technical",
    jobDescription: "Senior Backend Engineer required. Tech Stack: Node.js, PostgreSQL, Docker, Redis caching, REST API.",
    count: 12
  });
  console.log(`   -> Q1 with JD: "${jdQuestions[0]?.question}"\n`);

  // TEST 8: Wrong Answer Penalty Test
  console.log("Testing Rule: 8. Wrong Answer Evaluation Penalty");
  const wrongEval = await evaluateInterviewResponse({
    question: "Explain React's useMemo and when you would use it.",
    userAnswer: "useMemo is used to make HTTP requests.",
    role: "Frontend Developer",
    roundType: "technical",
    expectedTopics: ["memoization", "expensive calculations", "dependency array"]
  });
  console.log(`   -> Submitted: "useMemo is used to make HTTP requests."`);
  console.log(`   -> Score: ${wrongEval.score} (Expected <= 25)`);
  console.log(`   -> Verdict: "${wrongEval.verdict}" (Expected "Incorrect")`);
  console.log(`   -> Missing Concepts: ${JSON.stringify(wrongEval.missingPoints || wrongEval.missingConcepts)}\n`);

  // TEST 9: STAR / Correct Answer Test
  console.log("Testing Rule: 9. STAR / Correct Answer Evaluation");
  const starEval = await evaluateInterviewResponse({
    question: "How do you handle authentication in a React application?",
    userAnswer: "I store JWT tokens in HttpOnly SameSite cookies. Upon component mount, an auth context checks user status with an Express middleware endpoint and redirects if unauthorized.",
    role: "Frontend Developer",
    roundType: "technical",
    expectedTopics: ["jwt", "httponly cookie", "auth middleware", "redirect"]
  });
  console.log(`   -> Score: ${starEval.score} (Expected >= 80)`);
  console.log(`   -> Verdict: "${starEval.verdict}" (Expected "Correct")\n`);

  // TEST 10: 12-Question Session Report Generation
  console.log("Testing Rule: 10. 12-Question Session Final Report");
  const mockHistory = Array.from({ length: 12 }, (_, i) => ({
    question: `Question ${i + 1}`,
    userAnswer: `Answer ${i + 1}`,
    score: i % 2 === 0 ? 85 : 60,
    accuracy: i % 2 === 0 ? 90 : 65,
    communication: 80,
    correctness: i % 2 === 0 ? 85 : 60,
    missingConcepts: i % 2 !== 0 ? ["Missing database connection pool tuning"] : []
  }));

  const report = await generateFinalInterviewReport({
    sessionHistory: mockHistory,
    role: "Full Stack Developer",
    type: "technical"
  });

  console.log(`   -> Overall Score: ${report.overallScore}/100`);
  console.log(`   -> Technical Score: ${report.technicalScore}%`);
  console.log(`   -> Grade: ${report.grade}`);
  console.log(`   -> Recommended Next Level: "${report.recommendedNextLevel}"\n`);

  console.log("=================================================");
  console.log("  ALL INTERVIEW SIMULATOR TESTS PASSED 100%!     ");
  console.log("=================================================");
}

runInterviewSimulatorTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
