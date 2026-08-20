import api from "./api";

export async function parseResume(resumeText: string) {
  const res = await api.post("/ai/workspace/resume/parse", { resumeText });
  return res.data.data;
}

export async function calculateATSScore(
  resumeText: string,
  targetRole = "Software Engineer",
) {
  const res = await api.post("/ai/workspace/resume/ats-score", {
    resumeText,
    targetRole,
  });
  return res.data.data;
}

export async function analyzeResume(resumeText: string) {
  const res = await api.post("/ai/workspace/resume/analyze", { resumeText });
  return res.data.data;
}

export async function auditResume(resumeText: string, targetRole = "Software Engineer") {
  const res = await api.post("/ai/workspace/resume/audit", { resumeText, targetRole });
  return res.data.data;
}

export async function tailorResume(resumeText: string, jobDescription: string) {
  const res = await api.post("/ai/workspace/resume/tailor", {
    resumeText,
    jobDescription,
  });
  return res.data.data;
}

export async function generateResume(profileData: any) {
  const res = await api.post("/ai/workspace/resume/build", { profileData });
  return res.data.data;
}

export async function rewriteSTARBullet(bulletInput: string, resumeText = "", targetRole = "Software Engineer") {
  const res = await api.post("/ai/workspace/resume/star", { bulletInput, resumeText, targetRole });
  return res.data.data;
}

export async function optimizeBullets(bulletsText: string) {
  const res = await api.post("/ai/workspace/resume/optimize-bullets", {
    bulletsText,
  });
  return res.data.data;
}

export async function analyzeJobDescription(jobTextOrUrl: string) {
  const res = await api.post("/ai/workspace/job/analyze", { jobTextOrUrl });
  return res.data.data;
}

export async function explainJob(jobDescription: string) {
  const res = await api.post("/ai/workspace/job/explain", { jobDescription });
  return res.data.data;
}

export async function matchResumeWithJob(
  resumeText: string,
  jobDescription: string,
) {
  const res = await api.post("/ai/workspace/job/match", {
    resumeText,
    jobDescription,
  });
  return res.data.data;
}

export async function matchProfileFit(payload: {
  resumeText?: string;
  jobDescription: string;
}) {
  return matchResumeWithJob(payload.resumeText || "", payload.jobDescription);
}

export async function generateCoverLetter(
  resumeTextOrPayload: string | { targetRole?: string; companyName?: string; jobDescription: string; resumeText?: string },
  jobDescription?: string,
  companyName?: string,
  roleTitle?: string,
) {
  if (typeof resumeTextOrPayload === "object") {
    const payload = resumeTextOrPayload;
    const res = await api.post("/ai/workspace/job/cover-letter", {
      resumeText: payload.resumeText || "",
      jobDescription: payload.jobDescription || "",
      companyName: payload.companyName || "",
      roleTitle: payload.targetRole || "",
    });
    return res.data.data;
  }

  const res = await api.post("/ai/workspace/job/cover-letter", {
    resumeText: resumeTextOrPayload,
    jobDescription,
    companyName,
    roleTitle,
  });
  return res.data.data;
}

export async function estimateSalary(
  role: string,
  location: string,
  skills?: string[],
) {
  const res = await api.post("/ai/workspace/job/salary", {
    role,
    location,
    skills,
  });
  return res.data.data;
}

export async function getSalaryInsights(role: string, location: string, skills?: string[]) {
  return estimateSalary(role, location, skills);
}

export async function generateSkillGap(
  missingSkills: string[],
  targetRole?: string,
) {
  const res = await api.post("/ai/workspace/job/skill-gap", {
    missingSkills,
    targetRole,
  });
  return res.data.data;
}

export async function startInterviewSession(payload: {
  role: string;
  roundType: string;
  difficulty?: string;
  resumeText?: string;
  jobDescription?: string;
  company?: string;
  count?: number;
}) {
  const res = await api.post("/ai/workspace/interview/session", {
    ...payload,
    count: payload.count || 12,
  });
  return res.data.data;
}

export async function evaluateInterviewAnswer(payload: {
  question: string;
  userAnswer: string;
  role?: string;
  roundType?: string;
  difficulty?: string;
  expectedTopics?: string[];
  strongAnswerContains?: string;
  importantPoints?: string[];
  commonMistakes?: string[];
  scoringRubric?: any;
  resumeText?: string;
}) {
  const res = await api.post("/ai/workspace/interview/evaluate", payload);
  return res.data.data;
}

export async function generateAdaptiveNextQuestion(payload: {
  previousQuestion: string;
  previousAnswer: string;
  previousScore: number;
  currentDifficulty: string;
  role?: string;
  type?: string;
  questionNumber?: number;
  totalQuestions?: number;
}) {
  const res = await api.post("/ai/workspace/interview/adaptive-next", payload);
  return res.data.data;
}

export async function generateFinalInterviewReport(payload: {
  sessionHistory: any[];
  role?: string;
  type?: string;
}) {
  const res = await api.post("/ai/workspace/interview/report", payload);
  return res.data.data;
}

export async function getInterviewQuestions(type: string, role?: string, company?: string) {
  return startInterviewSession({ role: role || "Full Stack Developer", roundType: type, company });
}

export async function evaluateInterview(question: string, userAnswer: string, role?: string) {
  return evaluateInterviewAnswer({ question, userAnswer, role });
}

export async function reviewPortfolio(input: string) {
  const res = await api.post("/ai/workspace/career/portfolio", { input });
  return res.data.data;
}

export async function reviewGitHub(input: string) {
  const res = await api.post("/ai/workspace/career/github", { input });
  return res.data.data;
}

export async function reviewLinkedIn(input: string) {
  const res = await api.post("/ai/workspace/career/linkedin", { input });
  return res.data.data;
}

export async function generateCareerRoadmap(
  currentRole: string,
  targetGoal: string,
) {
  const res = await api.post("/ai/workspace/career/roadmap", {
    currentRole,
    targetGoal,
  });
  return res.data.data;
}

export async function getCompanyDetails(name: string) {
  const res = await api.get(
    `/ai/workspace/company/details?name=${encodeURIComponent(name)}`,
  );
  return res.data.data;
}

export async function getAdminMetrics() {
  const res = await api.get("/ai/workspace/admin/metrics");
  return res.data.data;
}

export async function processChat(
  message: string,
  contextTab: string,
  history: any[] = [],
  activeResumeText = "",
  activeJobDescription = "",
  targetRole = "Full Stack Developer",
  interviewRound = "technical",
  difficulty = "Medium",
  companyName = "Razorpay"
) {
  const res = await api.post("/ai/workspace/chat", {
    message,
    contextTab,
    history,
    activeResumeText,
    activeJobDescription,
    targetRole,
    interviewRound,
    difficulty,
    companyName
  });
  return res.data.data;
}

export async function uploadAndParseDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/ai/workspace/document/parse", formData);
  return res.data.data;
}

export async function generateFollowUpEmail(
  companyNameOrPayload: string | { companyName?: string; roleTitle?: string; role?: string; candidateName?: string; emailType?: string },
  roleTitle?: string,
  candidateName = "Candidate",
  type = "after-application",
) {
  if (typeof companyNameOrPayload === "object") {
    const payload = companyNameOrPayload;
    const res = await api.post("/ai/workspace/job/follow-up-email", {
      companyName: payload.companyName || "",
      roleTitle: payload.roleTitle || payload.role || "",
      candidateName: payload.candidateName || "Candidate",
      type: payload.emailType || "after-application",
    });
    return res.data.data;
  }

  const res = await api.post("/ai/workspace/job/follow-up-email", {
    companyName: companyNameOrPayload,
    roleTitle,
    candidateName,
    type,
  });
  return res.data.data;
}

export async function researchCompany(companyName: string) {
  const res = await api.post("/ai/workspace/job/company", { companyName });
  return res.data.data;
}

export async function sendChatMessage(payload: {
  message: string;
  contextTab?: string;
  activeTab?: string;
  history?: any[];
  chatHistory?: any[];
  activeResumeText?: string;
  resumeText?: string;
  activeJobDescription?: string;
  targetRole?: string;
  interviewRound?: string;
  difficulty?: string;
  companyName?: string;
}) {
  const tab = payload.contextTab || payload.activeTab || "resume";
  return processChat(
    payload.message,
    tab,
    payload.chatHistory || payload.history || [],
    payload.activeResumeText || payload.resumeText || "",
    payload.activeJobDescription || "",
    payload.targetRole || "Full Stack Developer",
    payload.interviewRound || "technical",
    payload.difficulty || "Medium",
    payload.companyName || "Razorpay"
  );
}

export async function improveSection(payload: {
  section: string;
  content: string;
  targetRole?: string;
}) {
  const res = await api.post("/ai/workspace/resume/improve-section", payload);
  return res.data.data;
}
