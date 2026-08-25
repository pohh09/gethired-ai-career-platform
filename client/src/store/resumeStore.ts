import { create } from "zustand";

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
  currentUserId: string | null;
  resumes: ResumeItem[];
  defaultResumeId: string | null;
  activeResumeText: string;
  activeResumeFileName: string;

  initUser: (userId: string | null) => void;
  reset: () => void;
  setActiveResume: (text: string, fileName?: string) => void;
  addResume: (
    resume: Omit<ResumeItem, "id" | "uploadDate" | "usedInApplicationsCount">,
  ) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, newName: string) => void;
  setDefaultResume: (id: string) => void;
  getDefaultResume: () => ResumeItem | undefined;
}

const getStorageKey = (userId: string | null) =>
  userId ? `gethired_resumes_${userId}` : "gethired_resumes_guest";

const loadResumesFromStorage = (userId: string | null): ResumeItem[] => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveResumesToStorage = (userId: string | null, resumes: ResumeItem[]) => {
  if (!userId) return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(resumes));
  } catch {}
};

export const useResumeStore = create<ResumeState>()((set, get) => ({
  currentUserId: null,
  resumes: [],
  defaultResumeId: null,
  activeResumeText: "",
  activeResumeFileName: "",

  initUser: (userId) => {
    const resumes = loadResumesFromStorage(userId);
    const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
    set({
      currentUserId: userId,
      resumes,
      defaultResumeId: defaultResume ? defaultResume.id : null,
      activeResumeText: defaultResume ? defaultResume.content : "",
      activeResumeFileName: defaultResume ? defaultResume.fileName : "",
    });
  },

  reset: () => {
    set({
      currentUserId: null,
      resumes: [],
      defaultResumeId: null,
      activeResumeText: "",
      activeResumeFileName: "",
    });
  },

  setActiveResume: (text: string, fileName?: string) => {
    set({
      activeResumeText: text,
      activeResumeFileName: fileName || "Extracted_Resume.pdf",
    });
  },

  addResume: (data) => {
    const { currentUserId, resumes } = get();
    const newId = `res-${Date.now()}`;
    const isFirst = resumes.length === 0;
    const newResume: ResumeItem = {
      ...data,
      id: newId,
      uploadDate: new Date().toISOString().split("T")[0],
      usedInApplicationsCount: 0,
      isDefault: data.isDefault || isFirst,
    };

    let updated = [...resumes];
    if (newResume.isDefault) {
      updated = updated.map((r) => ({ ...r, isDefault: false }));
    }
    updated = [newResume, ...updated];
    const newDefaultId = newResume.isDefault ? newId : get().defaultResumeId;

    saveResumesToStorage(currentUserId, updated);
    set({
      resumes: updated,
      defaultResumeId: newDefaultId,
      activeResumeText: newResume.content,
      activeResumeFileName: newResume.fileName,
    });
  },

  deleteResume: (id) => {
    const { currentUserId, resumes, defaultResumeId } = get();
    const filtered = resumes.filter((r) => r.id !== id);
    let newDefault = defaultResumeId;
    if (defaultResumeId === id) {
      if (filtered.length > 0) {
        filtered[0].isDefault = true;
        newDefault = filtered[0].id;
      } else {
        newDefault = null;
      }
    }
    saveResumesToStorage(currentUserId, filtered);
    const active = filtered.find((r) => r.id === newDefault);
    set({
      resumes: filtered,
      defaultResumeId: newDefault,
      activeResumeText: active ? active.content : "",
      activeResumeFileName: active ? active.fileName : "",
    });
  },

  renameResume: (id, newName) => {
    const { currentUserId, resumes } = get();
    const updated = resumes.map((r) =>
      r.id === id ? { ...r, name: newName } : r,
    );
    saveResumesToStorage(currentUserId, updated);
    set({ resumes: updated });
  },

  setDefaultResume: (id) => {
    const { currentUserId, resumes } = get();
    const updated = resumes.map((r) => ({
      ...r,
      isDefault: r.id === id,
    }));
    const active = updated.find((r) => r.id === id);
    saveResumesToStorage(currentUserId, updated);
    set({
      resumes: updated,
      defaultResumeId: id,
      activeResumeText: active ? active.content : get().activeResumeText,
      activeResumeFileName: active ? active.fileName : get().activeResumeFileName,
    });
  },

  getDefaultResume: () => {
    const { resumes, defaultResumeId } = get();
    return resumes.find((r) => r.id === defaultResumeId) || resumes[0];
  },
}));

