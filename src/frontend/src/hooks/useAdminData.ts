/**
 * useAdminData.ts — compatibility shim
 *
 * Re-exports all types and the AdminData interface from useBackendData so that
 * existing page and component imports (`@/hooks/useAdminData`) continue to work
 * without any changes.
 */

import type {
  EssayModule as BackendEssayModule,
  MCQ as BackendMCQ,
  Module as BackendModule,
  Subject as BackendSubject,
} from "../backend";

// ── Extended Module type with legacy `name` and `icon` fields ─────────────────
// The backend Module uses `title`; the adapter in useBackendData adds `name`
// so both fields are available. `title` is optional here because the adapters
// derive it from `name` when `name` is provided.
export interface Module extends Omit<BackendModule, "title"> {
  title?: string;
  name: string;
  icon?: string;
}

// ── Re-export clean backend types for consumers ───────────────────────────────
export type Subject = BackendSubject;
export type MCQ = BackendMCQ;
export type { BackendEssayModule as EssayModule };

// ── Local essay module type (with done state for PYQ checkboxes) ──────────────
export interface EssayTopic {
  id: string;
  title: string;
  done: boolean;
}

export interface LocalEssayModule {
  id: string;
  name: string;
  topics: EssayTopic[];
}

// ── AdminData interface (compatible shape passed around the whole app) ────────
export interface AdminData {
  subjects: Subject[];
  modules: Module[];
  mcqs: MCQ[];
  essayModules: LocalEssayModule[];
  shortEssayModules: LocalEssayModule[];
  shortNoteModules: LocalEssayModule[];
  isLoading?: boolean;

  addSubject: (data: Omit<Subject, "id">) => void;
  updateSubject: (id: string, data: Partial<Omit<Subject, "id">>) => void;
  deleteSubject: (id: string) => void;

  addModule: (data: Omit<Module, "id"> & { title?: string }) => void;
  updateModule: (
    id: string,
    data: Partial<Omit<Module, "id"> & { title?: string }>,
  ) => void;
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
