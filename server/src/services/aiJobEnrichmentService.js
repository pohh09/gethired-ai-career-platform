export async function enrichJobsWithAI(jobs = [], userProfile = {}) {
  if (!Array.isArray(jobs) || jobs.length === 0) return [];

  const userSkills = (userProfile.skills || ["React", "TypeScript", "Node.js", "JavaScript"]).map(s => s.toLowerCase());

  return jobs.map((job) => {
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());
    
    const matchedSkills = jobSkills.filter(s => userSkills.some(us => us.includes(s) || s.includes(us)));
    const skillGaps = jobSkills.filter(s => !matchedSkills.includes(s));

    const fitScore = jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 85;

    return {
      ...job,
      aiMatchScore: fitScore,
      skillGaps: skillGaps.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      jobFitPercentage: Math.max(fitScore, 70), // Baseline fit percentage range
      aiTailoringSuggestions: [
        `Highlight experience with ${job.skills[0] || 'core technologies'} in your summary`,
        `Emphasize project leadership for ${job.role}`
      ],
      aiCoverLetterPrompt: `Generate a cover letter for ${job.role} at ${job.company}`,
      aiInterviewPrepTopics: [
        `Behavioral questions tailored for ${job.company}`,
        `Technical deep dive on ${job.skills.slice(0, 3).join(", ") || 'system architecture'}`
      ]
    };
  });
}
