export async function getCompanyDetails(companyName = "Razorpay") {
  const name = companyName || "Tech Company";

  return {
    name,
    tagline: "Leading Digital Payment & Financial Technology Platform",
    industry: "Financial Technology (FinTech)",
    founded: "2014",
    employees: "2,500+",
    headquarters: "Bangalore, Karnataka, India",
    website: `https://www.${name.toLowerCase().replace(/\s+/g, "")}.com`,
    rating: 4.4,
    reviewCount: 1250,
    overview: `${name} is one of India's premier fintech leaders, building developer-first payment gateway solutions, banking suites, and automated payroll systems processing billions in annual GMV.`,
    techStack: ["React 19", "TypeScript", "Node.js", "Go", "AWS", "Kafka", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
    benefits: [
      "Competitive Compensation & ESOP Equity",
      "Comprehensive Health & Dental Insurance",
      "Flexible Remote / Hybrid Work Policy",
      "₹50,000 Annual Learning & Upskilling Budget",
      "Wellness Days & Unlimited Paid Time Off",
    ],
    hiringProcess: [
      { step: 1, title: "HR Screening Call (30 mins)", detail: "Overview of past achievements, background, and compensation alignment." },
      { step: 2, title: "Technical Machine Coding (90 mins)", detail: "Hands-on coding exercise building a full-stack component or API." },
      { step: 3, title: "System Design & Architecture (60 mins)", detail: "Distributed system design round focusing on scalability & caching." },
      { step: 4, title: "Engineering Leadership & Culture Fit (45 mins)", detail: "Behavioral STAR questions with VP of Engineering." },
    ],
    salaryRanges: [
      { role: "Software Engineer (SDE-1)", range: "₹14,00,000 - ₹20,00,000 / yr" },
      { role: "Senior Software Engineer (SDE-2)", range: "₹24,00,000 - ₹36,00,000 / yr" },
      { role: "Engineering Manager / Lead", range: "₹45,00,000 - ₹65,00,000 / yr" },
    ],
    officeLocations: ["Bangalore (HQ)", "Mumbai", "Delhi NCR", "Remote - India"],
    interviewExperience: {
      difficulty: "Medium - Hard",
      keyTopics: ["React 19", "TypeScript", "System Design", "Distributed Caching", "Node.js Microservices"],
      positiveRating: "86% Positive Experience",
    },
    latestNews: [
      { title: `${name} Expands International Payment Infrastructure in Southeast Asia`, date: "2 weeks ago" },
      { title: `${name} Launches AI-Powered Automated Payroll & Invoicing Suite`, date: "1 month ago" },
    ],
    similarCompanies: ["Paytm", "PhonePe", "Pine Labs", "Stripe", "CRED"],
  };
}
