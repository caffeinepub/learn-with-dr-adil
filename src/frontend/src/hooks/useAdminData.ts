import { createContext, useCallback, useContext, useState } from "react";

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Module {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Archived";
  icon: string;
}

export interface MCQ {
  id: string;
  subjectId: string;
  moduleId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface EssayTopic {
  id: string;
  title: string;
  done: boolean;
}

export interface EssayModule {
  id: string;
  name: string;
  topics: EssayTopic[];
}

// ─── The shape of everything the context provides ──────────────────────────
export interface AdminDataContextValue {
  subjects: Subject[];
  modules: Module[];
  mcqs: MCQ[];
  essayModules: EssayModule[];
  shortEssayModules: EssayModule[];
  shortNoteModules: EssayModule[];

  addSubject: (data: Omit<Subject, "id">) => void;
  updateSubject: (id: string, data: Partial<Omit<Subject, "id">>) => void;
  deleteSubject: (id: string) => void;

  addModule: (data: Omit<Module, "id">) => void;
  updateModule: (id: string, data: Partial<Omit<Module, "id">>) => void;
  deleteModule: (id: string) => void;

  addMCQ: (data: Omit<MCQ, "id">) => void;
  updateMCQ: (id: string, data: Partial<Omit<MCQ, "id">>) => void;
  deleteMCQ: (id: string) => void;

  addEssayModule: (name: string) => void;
  deleteEssayModule: (id: string) => void;
  addEssayTopic: (moduleId: string, title: string) => void;
  deleteEssayTopic: (moduleId: string, topicId: string) => void;
  toggleEssayTopic: (moduleId: string, topicId: string) => void;

  addShortEssayModule: (name: string) => void;
  deleteShortEssayModule: (id: string) => void;
  addShortEssayTopic: (moduleId: string, title: string) => void;
  deleteShortEssayTopic: (moduleId: string, topicId: string) => void;
  toggleShortEssayTopic: (moduleId: string, topicId: string) => void;

  addShortNoteModule: (name: string) => void;
  deleteShortNoteModule: (id: string) => void;
  addShortNoteTopic: (moduleId: string, title: string) => void;
  deleteShortNoteTopic: (moduleId: string, topicId: string) => void;
  toggleShortNoteTopic: (moduleId: string, topicId: string) => void;
}

// ─── Context — null sentinel so we can detect missing provider ───────────
export const AdminDataContext = createContext<AdminDataContextValue | null>(
  null,
);

// ─── Hook — consumed by any component that needs admin data ───────────────
export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return ctx;
}

// ─── Provider — instantiate state once at the app root ────────────────────
// Returns the JSX-compatible provider element; usage: <AdminDataProvider> children </AdminDataProvider>
export function useAdminDataStore(): AdminDataContextValue {
  // All state lives here — ONE source of truth for the entire app.
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [essayModules, setEssayModules] = useState<EssayModule[]>([]);
  const [shortEssayModules, setShortEssayModules] = useState<EssayModule[]>([]);
  const [shortNoteModules, setShortNoteModules] = useState<EssayModule[]>([]);

  // ─── Subject CRUD ────────────────────────────────────────────────────────
  const addSubject = useCallback((data: Omit<Subject, "id">) => {
    const id = `s${Date.now()}`;
    setSubjects((prev) => [...prev, { ...data, id }]);
  }, []);

  const updateSubject = useCallback(
    (id: string, data: Partial<Omit<Subject, "id">>) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
      );
    },
    [],
  );

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setModules((prev) => prev.filter((m) => m.subjectId !== id));
    setMcqs((prev) => prev.filter((q) => q.subjectId !== id));
  }, []);

  // ─── Module CRUD ──────────────────────────────────────────────────────────
  const addModule = useCallback((data: Omit<Module, "id">) => {
    const id = `m${Date.now()}`;
    setModules((prev) => [...prev, { ...data, id }]);
  }, []);

  const updateModule = useCallback(
    (id: string, data: Partial<Omit<Module, "id">>) => {
      setModules((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data } : m)),
      );
    },
    [],
  );

  const deleteModule = useCallback((id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    setMcqs((prev) => prev.filter((q) => q.moduleId !== id));
  }, []);

  // ─── MCQ CRUD ─────────────────────────────────────────────────────────────
  const addMCQ = useCallback((data: Omit<MCQ, "id">) => {
    const id = `q${Date.now()}`;
    setMcqs((prev) => [...prev, { ...data, id }]);
  }, []);

  const updateMCQ = useCallback(
    (id: string, data: Partial<Omit<MCQ, "id">>) => {
      setMcqs((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));
    },
    [],
  );

  const deleteMCQ = useCallback((id: string) => {
    setMcqs((prev) => prev.filter((q) => q.id !== id));
  }, []);

  // ─── Essay Module CRUD ────────────────────────────────────────────────────
  const addEssayModule = useCallback((name: string) => {
    const id = `em${Date.now()}`;
    setEssayModules((prev) => [...prev, { id, name, topics: [] }]);
  }, []);

  const deleteEssayModule = useCallback((id: string) => {
    setEssayModules((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addEssayTopic = useCallback((moduleId: string, title: string) => {
    const topicId = `emt${Date.now()}`;
    setEssayModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, topics: [...m.topics, { id: topicId, title, done: false }] }
          : m,
      ),
    );
  }, []);

  const deleteEssayTopic = useCallback((moduleId: string, topicId: string) => {
    setEssayModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, topics: m.topics.filter((t) => t.id !== topicId) }
          : m,
      ),
    );
  }, []);

  const toggleEssayTopic = useCallback((moduleId: string, topicId: string) => {
    setEssayModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: m.topics.map((t) =>
                t.id === topicId ? { ...t, done: !t.done } : t,
              ),
            }
          : m,
      ),
    );
  }, []);

  // ─── Short Essay Module CRUD ──────────────────────────────────────────────
  const addShortEssayModule = useCallback((name: string) => {
    const id = `se${Date.now()}`;
    setShortEssayModules((prev) => [...prev, { id, name, topics: [] }]);
  }, []);

  const deleteShortEssayModule = useCallback((id: string) => {
    setShortEssayModules((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addShortEssayTopic = useCallback((moduleId: string, title: string) => {
    const topicId = `set${Date.now()}`;
    setShortEssayModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, topics: [...m.topics, { id: topicId, title, done: false }] }
          : m,
      ),
    );
  }, []);

  const deleteShortEssayTopic = useCallback(
    (moduleId: string, topicId: string) => {
      setShortEssayModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, topics: m.topics.filter((t) => t.id !== topicId) }
            : m,
        ),
      );
    },
    [],
  );

  const toggleShortEssayTopic = useCallback(
    (moduleId: string, topicId: string) => {
      setShortEssayModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                topics: m.topics.map((t) =>
                  t.id === topicId ? { ...t, done: !t.done } : t,
                ),
              }
            : m,
        ),
      );
    },
    [],
  );

  // ─── Short Note Module CRUD ───────────────────────────────────────────────
  const addShortNoteModule = useCallback((name: string) => {
    const id = `sn${Date.now()}`;
    setShortNoteModules((prev) => [...prev, { id, name, topics: [] }]);
  }, []);

  const deleteShortNoteModule = useCallback((id: string) => {
    setShortNoteModules((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addShortNoteTopic = useCallback((moduleId: string, title: string) => {
    const topicId = `snt${Date.now()}`;
    setShortNoteModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, topics: [...m.topics, { id: topicId, title, done: false }] }
          : m,
      ),
    );
  }, []);

  const deleteShortNoteTopic = useCallback(
    (moduleId: string, topicId: string) => {
      setShortNoteModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, topics: m.topics.filter((t) => t.id !== topicId) }
            : m,
        ),
      );
    },
    [],
  );

  const toggleShortNoteTopic = useCallback(
    (moduleId: string, topicId: string) => {
      setShortNoteModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                topics: m.topics.map((t) =>
                  t.id === topicId ? { ...t, done: !t.done } : t,
                ),
              }
            : m,
        ),
      );
    },
    [],
  );

  return {
    subjects,
    modules,
    mcqs,
    essayModules,
    shortEssayModules,
    shortNoteModules,
    addSubject,
    updateSubject,
    deleteSubject,
    addModule,
    updateModule,
    deleteModule,
    addMCQ,
    updateMCQ,
    deleteMCQ,
    addEssayModule,
    deleteEssayModule,
    addEssayTopic,
    deleteEssayTopic,
    toggleEssayTopic,
    addShortEssayModule,
    deleteShortEssayModule,
    addShortEssayTopic,
    deleteShortEssayTopic,
    toggleShortEssayTopic,
    addShortNoteModule,
    deleteShortNoteModule,
    addShortNoteTopic,
    deleteShortNoteTopic,
    toggleShortNoteTopic,
  };
}

// Keep AdminData type alias for compatibility
export type AdminData = AdminDataContextValue;
