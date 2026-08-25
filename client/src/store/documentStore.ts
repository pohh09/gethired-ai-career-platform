import { create } from "zustand";

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
  currentUserId: string | null;
  documents: AIDocumentItem[];
  initUser: (userId: string | null) => void;
  reset: () => void;
  addDocument: (
    doc: Omit<AIDocumentItem, "id" | "createdAt" | "updatedAt">,
  ) => void;
  deleteDocument: (id: string) => void;
  updateDocumentContent: (id: string, content: string) => void;
}

const getDocumentStorageKey = (userId: string | null) =>
  userId ? `gethired_documents_${userId}` : "gethired_documents_guest";

const loadDocumentsFromStorage = (userId: string | null): AIDocumentItem[] => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getDocumentStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveDocumentsToStorage = (
  userId: string | null,
  docs: AIDocumentItem[],
) => {
  if (!userId) return;
  try {
    localStorage.setItem(getDocumentStorageKey(userId), JSON.stringify(docs));
  } catch {}
};

export const useDocumentStore = create<DocumentState>()((set, get) => ({
  currentUserId: null,
  documents: [],

  initUser: (userId) => {
    const documents = loadDocumentsFromStorage(userId);
    set({
      currentUserId: userId,
      documents,
    });
  },

  reset: () => {
    set({
      currentUserId: null,
      documents: [],
    });
  },

  addDocument: (doc) => {
    const { currentUserId, documents } = get();
    const now = new Date().toISOString().split("T")[0];
    const newDoc: AIDocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newDoc, ...documents];
    saveDocumentsToStorage(currentUserId, updated);
    set({ documents: updated });
  },

  deleteDocument: (id) => {
    const { currentUserId, documents } = get();
    const updated = documents.filter((d) => d.id !== id);
    saveDocumentsToStorage(currentUserId, updated);
    set({ documents: updated });
  },

  updateDocumentContent: (id, content) => {
    const { currentUserId, documents } = get();
    const now = new Date().toISOString().split("T")[0];
    const updated = documents.map((d) =>
      d.id === id ? { ...d, content, updatedAt: now } : d,
    );
    saveDocumentsToStorage(currentUserId, updated);
    set({ documents: updated });
  },
}));

