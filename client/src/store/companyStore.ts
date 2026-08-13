import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Company,
  Recruiter,
  CommunicationLog,
  CompanyNote,
  CompanyAttachment,
  CompanyFilterOptions,
} from "../types/company";

interface CompanyState {
  companies: Company[];
  filters: CompanyFilterOptions;
  isLoading: boolean;

  setSearchQuery: (query: string) => void;
  setIndustryFilter: (industry: string) => void;
  setSizeFilter: (size: string) => void;
  setWorkplaceFilter: (workplace: string) => void;
  setStatusFilter: (status: string) => void;
  setTagFilter: (tag: string) => void;
  resetFilters: () => void;

  addCompany: (companyData: Partial<Company>) => Company;
  updateCompany: (id: string, companyData: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  addRecruiter: (companyId: string, recruiter: Partial<Recruiter>) => void;
  updateRecruiter: (
    companyId: string,
    recruiterId: string,
    data: Partial<Recruiter>,
  ) => void;
  deleteRecruiter: (companyId: string, recruiterId: string) => void;

  addCommunicationLog: (
    companyId: string,
    log: Partial<CommunicationLog>,
  ) => void;
  deleteCommunicationLog: (companyId: string, logId: string) => void;

  addNote: (
    companyId: string,
    content: string,
    isPinned?: boolean,
    author?: string,
  ) => void;
  togglePinNote: (companyId: string, noteId: string) => void;
  deleteNote: (companyId: string, noteId: string) => void;

  addAttachment: (
    companyId: string,
    attachment: Partial<CompanyAttachment>,
  ) => void;
  deleteAttachment: (companyId: string, attachmentId: string) => void;
}

const DEFAULT_FILTERS: CompanyFilterOptions = {
  searchQuery: "",
  industry: "All Industries",
  size: "All Sizes",
  workplaceType: "All Models",
  relationshipStatus: "All Statuses",
  selectedTag: "All Tags",
};

const SEED_COMPANIES: Company[] = [
  {
    _id: "comp-1",
    name: "Stripe",
    industry: "Fintech & Payments",
    website: "https://stripe.com",
    size: "5,000+ employees",
    headquarters: "San Francisco, CA",
    workplaceType: "Remote",
    tags: ["Dream Company", "MNC", "Remote", "Priority"],
    totalApplications: 3,
    activeJobsCount: 2,
    lastActivity: "2 hours ago",
    description:
      "Financial infrastructure for the internet. Stripe builds payment processing, global banking APIs, and revenue tools.",
    recruiters: [
      {
        id: "rec-1",
        companyId: "comp-1",
        name: "Sarah Connor",
        role: "Lead Technical Recruiter",
        email: "sarah@stripe.com",
        linkedIn: "https://linkedin.com/in/sarah-connor",
        phone: "+1 (555) 234-5678",
        relationshipStatus: "Active",
        notes:
          "Primary point of contact for Senior Frontend & Systems engineering roles. Prefers email follow-ups.",
        lastContactDate: "Aug 2, 2026",
      },
      {
        id: "rec-2",
        companyId: "comp-1",
        name: "Alex Rivers",
        role: "Engineering Talent Partner",
        email: "alex@stripe.com",
        linkedIn: "https://linkedin.com/in/alex-rivers",
        relationshipStatus: "Referral",
        notes:
          "Internal employee referral contact in Connect Infrastructure group.",
        lastContactDate: "Jul 28, 2026",
      },
    ],
    logs: [
      {
        id: "log-1",
        companyId: "comp-1",
        recruiterName: "Sarah Connor",
        type: "Interview",
        date: "Aug 2, 2026",
        notes:
          "Completed 45-min Technical Screening with Sarah Connor. Discussed front-end architecture expectations and system design.",
      },
      {
        id: "log-2",
        companyId: "comp-1",
        recruiterName: "Alex Rivers",
        type: "LinkedIn Message",
        date: "Jul 28, 2026",
        notes:
          "Alex submitted employee referral for Senior Frontend Engineer role in Payments.",
      },
      {
        id: "log-3",
        companyId: "comp-1",
        recruiterName: "Sarah Connor",
        type: "Email",
        date: "Jul 20, 2026",
        notes:
          "Initial outreach email received from Sarah regarding new openings on Connect Web UI team.",
      },
    ],
    companyNotes: [
      {
        id: "note-1",
        companyId: "comp-1",
        content:
          "Spoke with Lead Recruiter Sarah Connor. Stripe is expanding frontend infrastructure team headcount by 12 engineers in Q3.",
        isPinned: true,
        createdAt: "Aug 2, 2026",
        author: "Puja Das",
      },
      {
        id: "note-2",
        companyId: "comp-1",
        content:
          "Referral submitted by Alex Rivers. Tech stack relies on React, TypeScript, Next.js, and custom design systems.",
        isPinned: false,
        createdAt: "Jul 28, 2026",
        author: "Puja Das",
      },
    ],
    applications: [
      {
        id: "app-1",
        companyId: "comp-1",
        roleTitle: "Senior Frontend Engineer — Payments",
        stage: "Interview",
        appliedDate: "Aug 1, 2026",
        location: "Remote",
        salaryRange: "$180,000 - $220,000",
      },
      {
        id: "app-2",
        companyId: "comp-1",
        roleTitle: "Staff Product Engineer — Connect",
        stage: "Screening",
        appliedDate: "Jul 25, 2026",
        location: "Remote",
        salaryRange: "$210,000 - $250,000",
      },
    ],
    attachments: [
      {
        id: "att-1",
        companyId: "comp-1",
        fileName: "Stripe_Senior_Frontend_Resume.pdf",
        fileSize: "1.2 MB",
        fileType: "PDF",
        uploadedAt: "Aug 1, 2026",
      },
    ],
  },
  {
    _id: "comp-2",
    name: "Vercel",
    industry: "Developer Tools",
    website: "https://vercel.com",
    size: "200 - 1,000 employees",
    headquarters: "San Francisco, CA",
    workplaceType: "Remote",
    tags: ["Dream Company", "Startup", "Remote"],
    totalApplications: 2,
    activeJobsCount: 1,
    lastActivity: "1 day ago",
    description:
      "Frontend cloud platform for Next.js, AI SDK, and edge compute serverless deployments.",
    recruiters: [
      {
        id: "rec-3",
        companyId: "comp-2",
        name: "Marcus Vance",
        role: "Senior Tech Talent Specialist",
        email: "marcus@vercel.com",
        linkedIn: "https://linkedin.com/in/marcus-vance",
        relationshipStatus: "Active",
        notes: "Recruiting lead for DX and Next.js Core team.",
        lastContactDate: "Aug 1, 2026",
      },
    ],
    logs: [
      {
        id: "log-4",
        companyId: "comp-2",
        recruiterName: "Marcus Vance",
        type: "Call",
        date: "Aug 1, 2026",
        notes:
          "Recruiter introductory call with Marcus. Scheduled take-home assignment presentation for next week.",
      },
    ],
    companyNotes: [
      {
        id: "note-3",
        companyId: "comp-2",
        content:
          "Emphasis on deep React Server Components knowledge and edge runtime optimization during interviews.",
        isPinned: true,
        createdAt: "Aug 1, 2026",
        author: "Puja Das",
      },
    ],
    applications: [
      {
        id: "app-3",
        companyId: "comp-2",
        roleTitle: "Staff Software Engineer — Next.js",
        stage: "Screening",
        appliedDate: "Jul 29, 2026",
        location: "Remote",
        salaryRange: "$195,000 - $240,000",
      },
    ],
    attachments: [],
  },
  {
    _id: "comp-3",
    name: "Linear",
    industry: "Software / SaaS",
    website: "https://linear.app",
    size: "50 - 200 employees",
    headquarters: "San Francisco, CA",
    workplaceType: "Remote",
    tags: ["Dream Company", "Startup", "Remote", "Priority"],
    totalApplications: 2,
    activeJobsCount: 1,
    lastActivity: "3 days ago",
    description:
      "Linear is a purpose-built issue tracking tool for high-performance software development teams.",
    recruiters: [
      {
        id: "rec-4",
        companyId: "comp-3",
        name: "Elena Rostova",
        role: "Head of People & Talent",
        email: "elena@linear.app",
        linkedIn: "https://linkedin.com/in/elena-rostova",
        relationshipStatus: "Warm",
        notes:
          "Connected via Twitter / X DM. Expressed strong interest in product engineering background.",
        lastContactDate: "Jul 30, 2026",
      },
    ],
    logs: [
      {
        id: "log-5",
        companyId: "comp-3",
        recruiterName: "Elena Rostova",
        type: "Meeting",
        date: "Jul 30, 2026",
        notes:
          "Informal chat with Elena regarding team culture, craftsmanship standards, and sync-engine design.",
      },
    ],
    companyNotes: [
      {
        id: "note-4",
        companyId: "comp-3",
        content:
          "Linear values high UI craftsmanship, fast keyboard shortcuts, offline-first sync architecture, and micro-interactions.",
        isPinned: true,
        createdAt: "Jul 30, 2026",
        author: "Puja Das",
      },
    ],
    applications: [
      {
        id: "app-4",
        companyId: "comp-3",
        roleTitle: "Product Engineer — Core Application",
        stage: "Applied",
        appliedDate: "Jul 28, 2026",
        location: "Remote",
        salaryRange: "$185,000 - $225,000",
      },
    ],
    attachments: [],
  },
  {
    _id: "comp-4",
    name: "Notion",
    industry: "Software / SaaS",
    website: "https://notion.so",
    size: "1,000 - 5,000 employees",
    headquarters: "San Francisco, CA",
    workplaceType: "Hybrid",
    tags: ["MNC", "Priority"],
    totalApplications: 1,
    activeJobsCount: 1,
    lastActivity: "5 days ago",
    description:
      "The connected workspace where better, faster work happens with docs, wikis, and AI integration.",
    recruiters: [
      {
        id: "rec-5",
        companyId: "comp-4",
        name: "David Kim",
        role: "Senior Staff Recruiter",
        email: "david.kim@notion.so",
        relationshipStatus: "Cold",
        notes:
          "Awaiting response to follow-up email sent regarding Senior Frontend Engineer opening.",
        lastContactDate: "Jul 26, 2026",
      },
    ],
    logs: [
      {
        id: "log-6",
        companyId: "comp-4",
        recruiterName: "David Kim",
        type: "Email",
        date: "Jul 26, 2026",
        notes:
          "Sent cold outreach email highlighting experience building block editors and real-time collaboration tools.",
      },
    ],
    companyNotes: [],
    applications: [
      {
        id: "app-5",
        companyId: "comp-4",
        roleTitle: "Senior Frontend Engineer — AI Editor",
        stage: "Applied",
        appliedDate: "Jul 26, 2026",
        location: "San Francisco, CA (Hybrid)",
        salaryRange: "$175,000 - $215,000",
      },
    ],
    attachments: [],
  },
  {
    _id: "comp-5",
    name: "Google",
    industry: "AI / Machine Learning",
    website: "https://google.com",
    size: "5,000+ employees",
    headquarters: "Mountain View, CA",
    workplaceType: "Hybrid",
    tags: ["MNC", "Referral"],
    totalApplications: 4,
    activeJobsCount: 2,
    lastActivity: "1 week ago",
    description:
      "Multinational technology leader focusing on search, cloud infrastructure, AI models, and consumer devices.",
    recruiters: [
      {
        id: "rec-6",
        companyId: "comp-5",
        name: "Priya Sharma",
        role: "Senior Recruiter — Core UX",
        email: "psharma@google.com",
        relationshipStatus: "Referral",
        notes: "Referral contact from Google Cloud frontend engineering group.",
        lastContactDate: "Jul 22, 2026",
      },
    ],
    logs: [
      {
        id: "log-7",
        companyId: "comp-5",
        recruiterName: "Priya Sharma",
        type: "Referral",
        date: "Jul 22, 2026",
        notes: "Employee referral submitted into internal Google HR portal.",
      },
    ],
    companyNotes: [
      {
        id: "note-5",
        companyId: "comp-5",
        content:
          "Prepare data structure fundamentals and system design for high-scale web client architectures.",
        isPinned: true,
        createdAt: "Jul 22, 2026",
        author: "Puja Das",
      },
    ],
    applications: [
      {
        id: "app-6",
        companyId: "comp-5",
        roleTitle: "Staff Software Engineer — Cloud Console",
        stage: "Screening",
        appliedDate: "Jul 20, 2026",
        location: "Mountain View, CA",
      },
    ],
    attachments: [],
  },
];

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companies: SEED_COMPANIES,
      filters: DEFAULT_FILTERS,
      isLoading: false,

      setSearchQuery: (searchQuery: string) =>
        set((state) => ({ filters: { ...state.filters, searchQuery } })),

      setIndustryFilter: (industry: string) =>
        set((state) => ({ filters: { ...state.filters, industry } })),

      setSizeFilter: (size: string) =>
        set((state) => ({ filters: { ...state.filters, size } })),

      setWorkplaceFilter: (workplaceType: string) =>
        set((state) => ({ filters: { ...state.filters, workplaceType } })),

      setStatusFilter: (relationshipStatus: string) =>
        set((state) => ({ filters: { ...state.filters, relationshipStatus } })),

      setTagFilter: (selectedTag: string) =>
        set((state) => ({ filters: { ...state.filters, selectedTag } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      addCompany: (companyData: Partial<Company>) => {
        const newCompany: Company = {
          _id: `comp-${Date.now()}`,
          name: companyData.name || "New Company",
          industry: companyData.industry || "Software / SaaS",
          website: companyData.website,
          size: companyData.size || "50 - 200 employees",
          headquarters: companyData.headquarters || "San Francisco, CA",
          workplaceType: companyData.workplaceType || "Remote",
          tags: companyData.tags || ["Priority"],
          totalApplications: 0,
          activeJobsCount: 0,
          lastActivity: "Just now",
          description: companyData.description || "",
          recruiters: [],
          logs: [],
          companyNotes: [],
          applications: [],
          attachments: [],
        };

        set((state) => ({
          companies: [newCompany, ...state.companies],
        }));

        return newCompany;
      },

      updateCompany: (id: string, companyData: Partial<Company>) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c._id === id
              ? { ...c, ...companyData, lastActivity: "Just now" }
              : c,
          ),
        }));
      },

      deleteCompany: (id: string) => {
        set((state) => ({
          companies: state.companies.filter((c) => c._id !== id),
        }));
      },

      addRecruiter: (companyId: string, recruiterData: Partial<Recruiter>) => {
        const newRecruiter: Recruiter = {
          id: `rec-${Date.now()}`,
          companyId,
          name: recruiterData.name || "New Contact",
          role: recruiterData.role || "Recruiter",
          email: recruiterData.email,
          linkedIn: recruiterData.linkedIn,
          phone: recruiterData.phone,
          relationshipStatus: recruiterData.relationshipStatus || "Active",
          notes: recruiterData.notes,
          lastContactDate: recruiterData.lastContactDate || "Today",
        };

        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            const updatedRecruiters = [newRecruiter, ...(c.recruiters || [])];
            return {
              ...c,
              recruiters: updatedRecruiters,
              lastActivity: "Just now",
            };
          }),
        }));
      },

      updateRecruiter: (
        companyId: string,
        recruiterId: string,
        data: Partial<Recruiter>,
      ) => {
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            const updatedRecruiters = (c.recruiters || []).map((r) =>
              r.id === recruiterId ? { ...r, ...data } : r,
            );
            return {
              ...c,
              recruiters: updatedRecruiters,
              lastActivity: "Just now",
            };
          }),
        }));
      },

      deleteRecruiter: (companyId: string, recruiterId: string) => {
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              recruiters: (c.recruiters || []).filter(
                (r) => r.id !== recruiterId,
              ),
            };
          }),
        }));
      },

      addCommunicationLog: (
        companyId: string,
        logData: Partial<CommunicationLog>,
      ) => {
        const newLog: CommunicationLog = {
          id: `log-${Date.now()}`,
          companyId,
          recruiterName: logData.recruiterName,
          type: logData.type || "Call",
          date: logData.date || "Today",
          notes: logData.notes || "",
        };

        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              logs: [newLog, ...(c.logs || [])],
              lastActivity: "Just now",
            };
          }),
        }));
      },

      deleteCommunicationLog: (companyId: string, logId: string) => {
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              logs: (c.logs || []).filter((l) => l.id !== logId),
            };
          }),
        }));
      },

      addNote: (
        companyId: string,
        content: string,
        isPinned = false,
        author = "Puja Das",
      ) => {
        const newNote: CompanyNote = {
          id: `note-${Date.now()}`,
          companyId,
          content: content.trim(),
          isPinned,
          createdAt: "Just now",
          author,
        };

        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              companyNotes: [newNote, ...(c.companyNotes || [])],
              lastActivity: "Just now",
            };
          }),
        }));
      },

      togglePinNote: (companyId: string, noteId: string) => {
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            const updatedNotes = (c.companyNotes || []).map((n) =>
              n.id === noteId ? { ...n, isPinned: !n.isPinned } : n,
            );
            return { ...c, companyNotes: updatedNotes };
          }),
        }));
      },

      deleteNote: (companyId: string, noteId: string) => {
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              companyNotes: (c.companyNotes || []).filter(
                (n) => n.id !== noteId,
              ),
            };
          }),
        }));
      },

      addAttachment: (
        companyId: string,
        attachmentData: Partial<CompanyAttachment>,
      ) => {
        const newAtt: CompanyAttachment = {
          id: `att-${Date.now()}`,
          companyId,
          fileName: attachmentData.fileName || "Document.pdf",
          fileSize: attachmentData.fileSize || "1.0 MB",
          fileType: attachmentData.fileType || "PDF",
          uploadedAt: "Just now",
          url: attachmentData.url,
        };

        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              attachments: [newAtt, ...(c.attachments || [])],
              lastActivity: "Just now",
            };
          }),
        }));
      },

      deleteAttachment: (companyId: string, attachmentId: string) => {
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c._id !== companyId) return c;
            return {
              ...c,
              attachments: (c.attachments || []).filter(
                (a) => a.id !== attachmentId,
              ),
            };
          }),
        }));
      },
    }),
    {
      name: "jobflow-company-crm-store",
      partialize: (state) => ({
        companies: state.companies,
      }),
    },
  ),
);
