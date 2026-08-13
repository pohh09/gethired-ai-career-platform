import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ResumeItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "docx";
  uploadDate: string;
  isDefault: boolean;
  content: string;
  usedInApplicationsCount: number;
}

interface ResumeState {
  resumes: ResumeItem[];
  defaultResumeId: string | null;
  activeResumeText: string;
  activeResumeFileName: string;
  setActiveResume: (text: string, fileName?: string) => void;
  addResume: (
    resume: Omit<ResumeItem, "id" | "uploadDate" | "usedInApplicationsCount">,
  ) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, newName: string) => void;
  setDefaultResume: (id: string) => void;
  getDefaultResume: () => ResumeItem | undefined;
}

const INITIAL_RESUMES: ResumeItem[] = [
  {
    id: "res-1",
    name: "Senior Software Engineer Resume 2026",
    fileName: "Alex_Morgan_Senior_Engineer_2026.pdf",
    fileSize: "245 KB",
    fileType: "pdf",
    uploadDate: "2026-07-15",
    isDefault: true,
    content: `ALEX MORGAN
Senior Full-Stack Software Engineer
San Francisco, CA | alex.morgan@email.com | github.com/alexmorgan | linkedin.com/in/alexmorgan

SUMMARY:
Results-driven Senior Full-Stack Engineer with 6+ years of experience engineering high-throughput web applications, microservices, and design systems using React, TypeScript, Node.js, and PostgreSQL.

SKILLS:
Frontend: React 19, TypeScript, Next.js, Tailwind CSS, Redux/Zustand, GraphQL
Backend: Node.js, Express, Python, PostgreSQL, Redis, REST APIs, Docker, AWS
Tools: Git, Jest, Cypress, Vite, CI/CD, System Architecture

EXPERIENCE:
Senior Frontend Engineer | TechScale Inc. (2023 - Present)
- Architected core dashboard rendering engine using React and TypeScript, boosting load speed by 42%.
- Led team of 5 engineers delivering high-availability component library consumed by 12 micro-frontends.

Full-Stack Developer | CloudMatrix (2020 - 2023)
- Built automated API data synchronization pipelines handling 2.5M daily webhook payload events.
- Engineered PostgreSQL database schemas and optimized indexing strategy reducing query latency by 65%.`,
    usedInApplicationsCount: 8,
  },
  {
    id: "res-2",
    name: "Full-Stack Specialist CV",
    fileName: "Alex_Morgan_FullStack_CV.docx",
    fileSize: "180 KB",
    fileType: "docx",
    uploadDate: "2026-06-20",
    isDefault: false,
    content: `ALEX MORGAN - FULL STACK SPECIALIST
Contact: alex.morgan@email.com | Portfolio: alexmorgan.dev

Targeting Lead & Staff Engineering positions in high-growth SaaS environments. Expertise in React, Node.js, Docker, Kubernetes, and Cloud Data Architecture.`,
    usedInApplicationsCount: 3,
  },
];

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: INITIAL_RESUMES,
      defaultResumeId: "res-1",
      activeResumeText: INITIAL_RESUMES[0].content,
      activeResumeFileName: INITIAL_RESUMES[0].fileName,

      setActiveResume: (text: string, fileName?: string) => {
        set({
          activeResumeText: text,
          activeResumeFileName: fileName || "Extracted_Resume.pdf",
        });
      },

      addResume: (data) => {
        const newId = `res-${Date.now()}`;
        const isFirst = get().resumes.length === 0;
        const newResume: ResumeItem = {
          ...data,
          id: newId,
          uploadDate: new Date().toISOString().split("T")[0],
          usedInApplicationsCount: 0,
          isDefault: data.isDefault || isFirst,
        };

        set((state) => {
          let updated = [...state.resumes];
          if (newResume.isDefault) {
            updated = updated.map((r) => ({ ...r, isDefault: false }));
          }
          return {
            resumes: [newResume, ...updated],
            defaultResumeId: newResume.isDefault
              ? newId
              : state.defaultResumeId,
          };
        });
      },

      deleteResume: (id) => {
        set((state) => {
          const filtered = state.resumes.filter((r) => r.id !== id);
          let newDefault = state.defaultResumeId;
          if (state.defaultResumeId === id) {
            if (filtered.length > 0) {
              filtered[0].isDefault = true;
              newDefault = filtered[0].id;
            } else {
              newDefault = null;
            }
          }
          return { resumes: filtered, defaultResumeId: newDefault };
        });
      },

      renameResume: (id, newName) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, name: newName } : r,
          ),
        }));
      },

      setDefaultResume: (id) => {
        set((state) => ({
          resumes: state.resumes.map((r) => ({
            ...r,
            isDefault: r.id === id,
          })),
          defaultResumeId: id,
        }));
      },

      getDefaultResume: () => {
        const { resumes, defaultResumeId } = get();
        return resumes.find((r) => r.id === defaultResumeId) || resumes[0];
      },
    }),
    {
      name: "jobflow_resume_store_v1",
    },
  ),
);
