import { processChatMessage } from "./src/services/ai/chatAIService.js";

const sampleResume = `John Doe
Senior Full Stack Engineer
Experience: 4 years building React, Node.js, and REST APIs. Managed PostgreSQL databases and deployed microservices on AWS ECS.
Education: B.S. Computer Science`;

const sampleJD = `Senior Full Stack Engineer at Razorpay
Requirements: 3+ years experience with React, TypeScript, Node.js, Express, Redis caching, Docker, and AWS microservices.`;

async function runChatSystemTests() {
  console.log("=================================================");
  console.log("  RUNNING AI CHAT SYSTEM DYNAMIC INTENT TESTS    ");
  console.log("=================================================\n");

  const testQueries = [
    { label: "1. Analyze Resume", msg: "Analyze my resume.", tab: "resume", expectedIntent: "resume_analysis" },
    { label: "2. Resume Weaknesses", msg: "What are my biggest weaknesses in my resume?", tab: "resume", expectedIntent: "resume_analysis" },
    { label: "3. Improve ATS Score", msg: "How can I improve my ATS score?", tab: "resume", expectedIntent: "ats_score" },
    { label: "4. Technical Advice (Docker)", msg: "Should I learn Docker for a Full Stack role?", tab: "career", expectedIntent: "general_chat" },
    { label: "5. Cover Letter", msg: "Write a cover letter for this job.", tab: "jobs", expectedIntent: "cover_letter" },
    { label: "6. Salary Target", msg: "What salary should I target?", tab: "jobs", expectedIntent: "salary_insights" },
    { label: "7. React Interview Question", msg: "Give me a React interview question.", tab: "interview", expectedIntent: "interview_question" },
    { label: "8. Evaluate Answer", msg: "Evaluate my answer: I use useEffect to fetch data on mount.", tab: "interview", expectedIntent: "interview_question" },
    { label: "9. Skill Gap / Next Steps", msg: "What should I learn next?", tab: "career", expectedIntent: "skill_gap" },
    { label: "10. Career Roadmap", msg: "Create a career roadmap.", tab: "career", expectedIntent: "career_roadmap" },
  ];

  const results = [];

  for (const t of testQueries) {
    console.log(`Testing: ${t.label} ("${t.msg}")`);
    try {
      const res = await processChatMessage({
        message: t.msg,
        contextTab: t.tab,
        activeResumeText: sampleResume,
        activeJobDescription: sampleJD,
        targetRole: "Senior Full Stack Engineer",
        interviewRound: "technical"
      });

      console.log(`   -> Detected Intent: ${res.intent || "general_chat"}`);
      console.log(`   -> Response Length: ${res.text?.length || 0} chars`);
      console.log(`   -> Snippet: "${(res.text || "").slice(0, 120).replace(/\n/g, " ")}..."\n`);
      results.push(res.text);
    } catch (err) {
      console.error(`   -> Error: ${err.message}\n`);
    }
  }

  // TEST 11: Multi-Turn Conversation Memory
  console.log("Testing Multi-Turn Memory (Follow-up Context Tracking):");
  try {
    const history = [
      { role: "user", text: "What skills am I missing for a Senior Full Stack role?" },
      { role: "model", text: "Based on the job posting, you are missing Docker containerization, Redis caching, and GraphQL APIs." }
    ];

    const followUpRes = await processChatMessage({
      message: "Which one should I learn first and why?",
      contextTab: "career",
      history,
      activeResumeText: sampleResume,
      targetRole: "Senior Full Stack Engineer"
    });

    console.log(`   -> Follow-Up Response Snippet: "${(followUpRes.text || "").slice(0, 180).replace(/\n/g, " ")}..."\n`);
  } catch (err) {
    console.error(`   -> Multi-turn Error: ${err.message}\n`);
  }

  // Verify uniqueness of all 10 responses
  const uniqueResponses = new Set(results);
  console.log(`=================================================`);
  console.log(`  UNIQUE RESPONSES VERIFICATION: ${uniqueResponses.size} / ${results.length}`);
  if (uniqueResponses.size === results.length) {
    console.log("  SUCCESS: ALL 10 RESPONSES WERE MATERIAL DIFFERENT! ");
  } else {
    console.log("  WARNING: Duplicate responses detected.");
  }
  console.log(`=================================================`);
}

runChatSystemTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
