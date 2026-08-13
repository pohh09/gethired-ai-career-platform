import { evaluateInterviewResponse } from "./src/services/ai/interviewAIService.js";

async function testScoring() {
  console.log("=== TESTING DYNAMIC INTERVIEW ANSWER EVALUATION (NO HARDCODED 80%) ===\n");

  const q = "Explain how React 19 Server Components differ from Client Components in terms of execution context and bundle size.";

  console.log("1. Empty Input Test:");
  const resEmpty = await evaluateInterviewResponse(q, "");
  console.log("-> Overall Score:", resEmpty.overallScore, "(Expected: 0)");

  console.log("\n2. Gibberish Input Test ('asdfghjkl'):");
  const resGibberish = await evaluateInterviewResponse(q, "asdfghjkl qwerty 12345");
  console.log("-> Overall Score:", resGibberish.overallScore, "(Expected: 5-15)");

  console.log("\n3. Brief / Vague Input Test ('React is good for web'):");
  const resVague = await evaluateInterviewResponse(q, "React is good for web");
  console.log("-> Overall Score:", resVague.overallScore, "(Expected: 30-45)");

  console.log("\n4. Detailed STAR Technical Response Test:");
  const starAnswer = `React 19 Server Components execute exclusively on the Node server environment, meaning their dependencies contribute zero bytes to the client JavaScript bundle. Client components on the other hand run in the browser and handle interactivity. In my last project, moving data fetching to Server Components reduced our client bundle by 45KB and improved LCP by 38%.`;
  const resStar = await evaluateInterviewResponse(q, starAnswer);
  console.log("-> Overall Score:", resStar.overallScore, "(Expected: 80-95)");
}

testScoring();
