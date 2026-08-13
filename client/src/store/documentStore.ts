import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AIDocumentCategory =
  | "Cover Letter"
  | "Resume Analysis"
  | "Resume Optimization"
  | "Interview Prep"
  | "Job Analysis"
  | "Career Coach";

export interface AIDocumentItem {
  id: string;
  title: string;
  category: AIDocumentCategory;
  company?: string;
  role?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentState {
  documents: AIDocumentItem[];
  addDocument: (
    doc: Omit<AIDocumentItem, "id" | "createdAt" | "updatedAt">,
  ) => void;
  deleteDocument: (id: string) => void;
  updateDocumentContent: (id: string, content: string) => void;
}

const INITIAL_DOCUMENTS: AIDocumentItem[] = [
  {
    id: "doc-1",
    title: "Cover Letter - Senior Frontend Engineer at Stripe",
    category: "Cover Letter",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
    content: `Dear Hiring Manager at Stripe,

I am writing to express my enthusiastic interest in the Senior Frontend Engineer role. With over 6 years of experience building high-performance web applications using React, TypeScript, and modern component systems, I have followed Stripe's technical engineering blog and developer toolings closely.

In my current role at TechScale, I architected dashboard components that reduced page load latencies by 42% for over 150,000 active daily business users. I would welcome the opportunity to bring my passion for developer experience and design system scaling to Stripe.

Thank you for your time and consideration.

Best regards,
Alex Morgan`,
  },
  {
    id: "doc-2",
    title: "Resume Match Report - Staff Product Engineer at Vercel",
    category: "Resume Analysis",
    company: "Vercel",
    role: "Staff Product Engineer",
    createdAt: "2026-07-28",
    updatedAt: "2026-07-28",
    content: `ATS Match Score: 92%

Matching Keywords: Next.js, React, TypeScript, Node.js, Performance Tuning, Edge Runtime.

Strengths:
- Strong match on frontend framework architecture and TypeScript typing rigor.
- Proven experience optimizing web vital metrics and bundle chunking.

Recommendations:
- Highlight micro-frontend deployment experience in executive summary bullets.`,
  },
  {
    id: "doc-3",
    title: "Interview Prep Guide - Linear Frontend Systems",
    category: "Interview Prep",
    company: "Linear",
    role: "Frontend Systems Engineer",
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    content: `Top Technical Interview Preparation Topics:
1. Keyboard Navigation & Accessibility: Explain canvas event listeners and focus traps.
2. Real-Time State Sync: Compare WebSockets vs WebRTC data channels for collaborative state.
3. System Design: Design a local-first issue tracking client with offline IndexedDB sync.`,
  },
];

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: INITIAL_DOCUMENTS,

      addDocument: (doc) => {
        const now = new Date().toISOString().split("T")[0];
        const newDoc: AIDocumentItem = {
          ...doc,
          id: `doc-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          documents: [newDoc, ...state.documents],
        }));
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));
      },

      updateDocumentContent: (id, content) => {
        const now = new Date().toISOString().split("T")[0];
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, content, updatedAt: now } : d,
          ),
        }));
      },
    }),
    {
      name: "jobflow_document_store_v1",
    },
  ),
);
