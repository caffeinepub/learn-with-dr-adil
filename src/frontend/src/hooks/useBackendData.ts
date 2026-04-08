/**
 * useBackendData.ts
 *
 * React Query-based data layer that wires all content to the Motoko backend.
 * Provides a compatible AdminData-shaped interface so all existing pages work
 * without changes. Read operations use useQuery; writes use useMutation with
 * automatic query invalidation for instant UI updates.
 *
 * PYQ toggle state (checkboxes) is local-only — it does not need backend
 * persistence and lives in the App-level state passed via adminData.
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import type { EssayModule, MCQ, Module, Subject } from "../backend";
import type { AdminData, LocalEssayModule } from "./useAdminData";

// ── Re-export backend types for consumers ─────────────────────────────────────
export type { EssayModule, MCQ, Module, Subject };
export type { AdminData, LocalEssayModule };

const ADMIN_TOKEN = "Tesla369";

// ── Query keys ────────────────────────────────────────────────────────────────
const QK = {
  subjects: ["subjects"] as const,
  modules: ["modules"] as const,
  mcqs: ["mcqs"] as const,
  essays: ["essays"] as const,
  shortEssays: ["shortEssays"] as const,
  shortNotes: ["shortNotes"] as const,
};

// ── Helper: adapt backend EssayModule[] to LocalEssayModule[] ────────────────
function adaptEssayModules(
  backendModules: EssayModule[],
  localToggles: Record<string, Record<string, boolean>>,
): LocalEssayModule[] {
  return backendModules.map((em) => ({
    id: em.id,
    name: em.title,
    topics: em.topics.map((t) => ({
      id: t.id,
      title: t.title,
      done: localToggles[em.id]?.[t.id] ?? false,
    })),
  }));
}

// ── Helper: generate a client-side ID ─────────────────────────────────────────
function genId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
}

// ── Public hook ──────────────────────────────────────────────────────────────
export function useBackendData(): AdminData {
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const qc = useQueryClient();

  // ── Read queries ────────────────────────────────────────────────────────────
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery<
    Subject[]
  >({
    queryKey: QK.subjects,
    queryFn: async () => (actor ? actor.getSubjects() : []),
    enabled: !!actor && !actorLoading,
  });

  const { data: modules = [], isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: QK.modules,
    queryFn: async () => (actor ? actor.getModules() : []),
    enabled: !!actor && !actorLoading,
  });

  const { data: mcqs = [], isLoading: mcqsLoading } = useQuery<MCQ[]>({
    queryKey: QK.mcqs,
    queryFn: async () => (actor ? actor.getMCQs() : []),
    enabled: !!actor && !actorLoading,
  });

  const { data: essayBackend = [], isLoading: essaysLoading } = useQuery<
    EssayModule[]
  >({
    queryKey: QK.essays,
    queryFn: async () => (actor ? actor.getEssayModulesByType("essay") : []),
    enabled: !!actor && !actorLoading,
  });

  const { data: shortEssayBackend = [], isLoading: shortEssaysLoading } =
    useQuery<EssayModule[]>({
      queryKey: QK.shortEssays,
      queryFn: async () =>
        actor ? actor.getEssayModulesByType("shortEssay") : [],
      enabled: !!actor && !actorLoading,
    });

  const { data: shortNoteBackend = [], isLoading: shortNotesLoading } =
    useQuery<EssayModule[]>({
      queryKey: QK.shortNotes,
      queryFn: async () =>
        actor ? actor.getEssayModulesByType("shortNote") : [],
      enabled: !!actor && !actorLoading,
    });

  // ── Local toggle state for PYQ checkboxes (not persisted) ──────────────────
  const [essayToggles, setEssayToggles] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [shortEssayToggles, setShortEssayToggles] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [shortNoteToggles, setShortNoteToggles] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // ── Adapted local essay module arrays (backend data + local toggle state) ───
  const essayModules = adaptEssayModules(essayBackend, essayToggles);
  const shortEssayModules = adaptEssayModules(
    shortEssayBackend,
    shortEssayToggles,
  );
  const shortNoteModules = adaptEssayModules(
    shortNoteBackend,
    shortNoteToggles,
  );

  // ── Subject mutations ───────────────────────────────────────────────────────
  const addSubjectMut = useMutation({
    mutationFn: async (subject: Subject) => {
      if (!actor) return;
      await actor.addSubject(ADMIN_TOKEN, subject);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.subjects }),
  });

  const updateSubjectMut = useMutation({
    mutationFn: async (subject: Subject) => {
      if (!actor) return;
      await actor.updateSubject(ADMIN_TOKEN, subject);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.subjects }),
  });

  const deleteSubjectMut = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteSubject(ADMIN_TOKEN, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.subjects });
      qc.invalidateQueries({ queryKey: QK.modules });
      qc.invalidateQueries({ queryKey: QK.mcqs });
    },
  });

  // ── Module mutations ────────────────────────────────────────────────────────
  const addModuleMut = useMutation({
    mutationFn: async (mod: Module) => {
      if (!actor) return;
      await actor.addModule(ADMIN_TOKEN, mod);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.modules }),
  });

  const updateModuleMut = useMutation({
    mutationFn: async (mod: Module) => {
      if (!actor) return;
      await actor.updateModule(ADMIN_TOKEN, mod);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.modules }),
  });

  const deleteModuleMut = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteModule(ADMIN_TOKEN, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.modules });
      qc.invalidateQueries({ queryKey: QK.mcqs });
    },
  });

  // ── MCQ mutations ───────────────────────────────────────────────────────────
  const addMCQMut = useMutation({
    mutationFn: async (mcq: MCQ) => {
      if (!actor) return;
      await actor.addMCQ(ADMIN_TOKEN, mcq);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.mcqs }),
  });

  const updateMCQMut = useMutation({
    mutationFn: async (mcq: MCQ) => {
      if (!actor) return;
      await actor.updateMCQ(ADMIN_TOKEN, mcq);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.mcqs }),
  });

  const deleteMCQMut = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteMCQ(ADMIN_TOKEN, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.mcqs }),
  });

  // ── Essay module mutations ──────────────────────────────────────────────────
  const addEssayModuleMut = useMutation({
    mutationFn: async (em: EssayModule) => {
      if (!actor) return;
      await actor.addEssayModule(ADMIN_TOKEN, em);
    },
    onSuccess: (_, em) => {
      if (em.moduleType === "essay")
        qc.invalidateQueries({ queryKey: QK.essays });
      else if (em.moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });

  const deleteEssayModuleMut = useMutation({
    mutationFn: async ({ id }: { id: string; moduleType: string }) => {
      if (!actor) return;
      await actor.deleteEssayModule(ADMIN_TOKEN, id);
    },
    onSuccess: (_, { moduleType }) => {
      if (moduleType === "essay") qc.invalidateQueries({ queryKey: QK.essays });
      else if (moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });

  const addEssayTopicMut = useMutation({
    mutationFn: async ({
      moduleId,
      topic,
    }: {
      moduleId: string;
      topic: import("../backend").EssayTopic;
      moduleType: string;
    }) => {
      if (!actor) return;
      await actor.addEssayTopic(ADMIN_TOKEN, moduleId, topic);
    },
    onSuccess: (_, { moduleType }) => {
      if (moduleType === "essay") qc.invalidateQueries({ queryKey: QK.essays });
      else if (moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });

  const deleteEssayTopicMut = useMutation({
    mutationFn: async ({
      moduleId,
      topicId,
    }: {
      moduleId: string;
      topicId: string;
      moduleType: string;
    }) => {
      if (!actor) return;
      await actor.deleteEssayTopic(ADMIN_TOKEN, moduleId, topicId);
    },
    onSuccess: (_, { moduleType }) => {
      if (moduleType === "essay") qc.invalidateQueries({ queryKey: QK.essays });
      else if (moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });

  // ── Adapter functions that match the AdminData interface ────────────────────

  const addSubject = useCallback(
    (data: Omit<Subject, "id">) => {
      addSubjectMut.mutate({ ...data, id: genId("s") });
    },
    [addSubjectMut],
  );

  const updateSubject = useCallback(
    (id: string, data: Partial<Omit<Subject, "id">>) => {
      const existing = subjects.find((s) => s.id === id);
      if (!existing) return;
      updateSubjectMut.mutate({ ...existing, ...data, id });
    },
    [subjects, updateSubjectMut],
  );

  const deleteSubject = useCallback(
    (id: string) => {
      deleteSubjectMut.mutate(id);
    },
    [deleteSubjectMut],
  );

  // Module adapter: the old code used `name` but backend uses `title`
  const addModule = useCallback(
    (data: {
      name?: string;
      title?: string;
      subjectId: string;
      status: string;
      description: string;
      icon?: string;
    }) => {
      const mod: Module = {
        subjectId: data.subjectId,
        status: data.status,
        title: data.title ?? data.name ?? "",
        description: data.description,
        id: genId("m"),
      };
      addModuleMut.mutate(mod);
    },
    [addModuleMut],
  );

  const updateModule = useCallback(
    (
      id: string,
      data: {
        name?: string;
        title?: string;
        subjectId?: string;
        status?: string;
        description?: string;
        icon?: string;
      },
    ) => {
      const existing = modules.find((m) => m.id === id);
      if (!existing) return;
      updateModuleMut.mutate({
        ...existing,
        subjectId: data.subjectId ?? existing.subjectId,
        status: data.status ?? existing.status,
        title: data.title ?? data.name ?? existing.title,
        description: data.description ?? existing.description,
        id,
      });
    },
    [modules, updateModuleMut],
  );

  const deleteModule = useCallback(
    (id: string) => {
      deleteModuleMut.mutate(id);
    },
    [deleteModuleMut],
  );

  const addMCQ = useCallback(
    (data: Omit<MCQ, "id">) => {
      addMCQMut.mutate({ ...data, id: genId("q") });
    },
    [addMCQMut],
  );

  const updateMCQ = useCallback(
    (id: string, data: Partial<Omit<MCQ, "id">>) => {
      const existing = mcqs.find((q) => q.id === id);
      if (!existing) return;
      updateMCQMut.mutate({ ...existing, ...data, id });
    },
    [mcqs, updateMCQMut],
  );

  const deleteMCQ = useCallback(
    (id: string) => {
      deleteMCQMut.mutate(id);
    },
    [deleteMCQMut],
  );

  // Essay module adapters
  const addEssayModule = useCallback(
    (name: string) => {
      const em: EssayModule = {
        id: genId("em"),
        title: name,
        moduleType: "essay",
        topics: [],
      };
      addEssayModuleMut.mutate(em);
    },
    [addEssayModuleMut],
  );

  const deleteEssayModule = useCallback(
    (id: string) => {
      deleteEssayModuleMut.mutate({ id, moduleType: "essay" });
    },
    [deleteEssayModuleMut],
  );

  const addEssayTopic = useCallback(
    (moduleId: string, title: string) => {
      addEssayTopicMut.mutate({
        moduleId,
        topic: { id: genId("emt"), title },
        moduleType: "essay",
      });
    },
    [addEssayTopicMut],
  );

  const deleteEssayTopic = useCallback(
    (moduleId: string, topicId: string) => {
      deleteEssayTopicMut.mutate({ moduleId, topicId, moduleType: "essay" });
    },
    [deleteEssayTopicMut],
  );

  const toggleEssayTopic = useCallback((moduleId: string, topicId: string) => {
    setEssayToggles((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [topicId]: !prev[moduleId]?.[topicId] },
    }));
  }, []);

  // Short essay adapters
  const addShortEssayModule = useCallback(
    (name: string) => {
      const em: EssayModule = {
        id: genId("se"),
        title: name,
        moduleType: "shortEssay",
        topics: [],
      };
      addEssayModuleMut.mutate(em);
    },
    [addEssayModuleMut],
  );

  const deleteShortEssayModule = useCallback(
    (id: string) => {
      deleteEssayModuleMut.mutate({ id, moduleType: "shortEssay" });
    },
    [deleteEssayModuleMut],
  );

  const addShortEssayTopic = useCallback(
    (moduleId: string, title: string) => {
      addEssayTopicMut.mutate({
        moduleId,
        topic: { id: genId("set"), title },
        moduleType: "shortEssay",
      });
    },
    [addEssayTopicMut],
  );

  const deleteShortEssayTopic = useCallback(
    (moduleId: string, topicId: string) => {
      deleteEssayTopicMut.mutate({
        moduleId,
        topicId,
        moduleType: "shortEssay",
      });
    },
    [deleteEssayTopicMut],
  );

  const toggleShortEssayTopic = useCallback(
    (moduleId: string, topicId: string) => {
      setShortEssayToggles((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          [topicId]: !prev[moduleId]?.[topicId],
        },
      }));
    },
    [],
  );

  // Short note adapters
  const addShortNoteModule = useCallback(
    (name: string) => {
      const em: EssayModule = {
        id: genId("sn"),
        title: name,
        moduleType: "shortNote",
        topics: [],
      };
      addEssayModuleMut.mutate(em);
    },
    [addEssayModuleMut],
  );

  const deleteShortNoteModule = useCallback(
    (id: string) => {
      deleteEssayModuleMut.mutate({ id, moduleType: "shortNote" });
    },
    [deleteEssayModuleMut],
  );

  const addShortNoteTopic = useCallback(
    (moduleId: string, title: string) => {
      addEssayTopicMut.mutate({
        moduleId,
        topic: { id: genId("snt"), title },
        moduleType: "shortNote",
      });
    },
    [addEssayTopicMut],
  );

  const deleteShortNoteTopic = useCallback(
    (moduleId: string, topicId: string) => {
      deleteEssayTopicMut.mutate({
        moduleId,
        topicId,
        moduleType: "shortNote",
      });
    },
    [deleteEssayTopicMut],
  );

  const toggleShortNoteTopic = useCallback(
    (moduleId: string, topicId: string) => {
      setShortNoteToggles((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          [topicId]: !prev[moduleId]?.[topicId],
        },
      }));
    },
    [],
  );

  const isLoading =
    actorLoading ||
    subjectsLoading ||
    modulesLoading ||
    mcqsLoading ||
    essaysLoading ||
    shortEssaysLoading ||
    shortNotesLoading;

  // Adapt modules: pages reference m.name but backend uses m.title.
  // Return a merged shape so both field names work.
  const adaptedModules: AdminData["modules"] = modules.map((m) => ({
    ...m,
    name: m.title,
  }));

  return {
    subjects,
    modules: adaptedModules,
    mcqs,
    essayModules,
    shortEssayModules,
    shortNoteModules,
    isLoading,

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

// ── Individual query/mutation hooks (for consumers that prefer granular access) ─

export function useSubjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Subject[]>({
    queryKey: QK.subjects,
    queryFn: async () => (actor ? actor.getSubjects() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useModules() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Module[]>({
    queryKey: QK.modules,
    queryFn: async () => (actor ? actor.getModules() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useMCQs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MCQ[]>({
    queryKey: QK.mcqs,
    queryFn: async () => (actor ? actor.getMCQs() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useEssayModules(type: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<EssayModule[]>({
    queryKey: [
      type === "essay"
        ? "essays"
        : type === "shortEssay"
          ? "shortEssays"
          : "shortNotes",
    ],
    queryFn: async () => (actor ? actor.getEssayModulesByType(type) : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subject: Subject) => {
      if (!actor) return;
      await actor.addSubject(ADMIN_TOKEN, subject);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.subjects }),
  });
}

export function useUpdateSubject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subject: Subject) => {
      if (!actor) return;
      await actor.updateSubject(ADMIN_TOKEN, subject);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.subjects }),
  });
}

export function useDeleteSubject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteSubject(ADMIN_TOKEN, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.subjects });
      qc.invalidateQueries({ queryKey: QK.modules });
      qc.invalidateQueries({ queryKey: QK.mcqs });
    },
  });
}

export function useAddModule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mod: Module) => {
      if (!actor) return;
      await actor.addModule(ADMIN_TOKEN, mod);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.modules }),
  });
}

export function useUpdateModule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mod: Module) => {
      if (!actor) return;
      await actor.updateModule(ADMIN_TOKEN, mod);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.modules }),
  });
}

export function useDeleteModule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteModule(ADMIN_TOKEN, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.modules });
      qc.invalidateQueries({ queryKey: QK.mcqs });
    },
  });
}

export function useAddMCQ() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mcq: MCQ) => {
      if (!actor) return;
      await actor.addMCQ(ADMIN_TOKEN, mcq);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.mcqs }),
  });
}

export function useUpdateMCQ() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mcq: MCQ) => {
      if (!actor) return;
      await actor.updateMCQ(ADMIN_TOKEN, mcq);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.mcqs }),
  });
}

export function useDeleteMCQ() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteMCQ(ADMIN_TOKEN, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.mcqs }),
  });
}

export function useAddEssayModule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (em: EssayModule) => {
      if (!actor) return;
      await actor.addEssayModule(ADMIN_TOKEN, em);
    },
    onSuccess: (_, em) => {
      if (em.moduleType === "essay")
        qc.invalidateQueries({ queryKey: QK.essays });
      else if (em.moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });
}

export function useUpdateEssayModule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (em: EssayModule) => {
      if (!actor) return;
      await actor.updateEssayModule(ADMIN_TOKEN, em);
    },
    onSuccess: (_, em) => {
      if (em.moduleType === "essay")
        qc.invalidateQueries({ queryKey: QK.essays });
      else if (em.moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });
}

export function useDeleteEssayModule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      moduleType,
    }: { id: string; moduleType: string }) => {
      if (!actor) return;
      await actor.deleteEssayModule(ADMIN_TOKEN, id);
      return moduleType;
    },
    onSuccess: (moduleType) => {
      if (moduleType === "essay") qc.invalidateQueries({ queryKey: QK.essays });
      else if (moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });
}

export function useAddEssayTopic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleId,
      topic,
      moduleType,
    }: {
      moduleId: string;
      topic: import("../backend").EssayTopic;
      moduleType: string;
    }) => {
      if (!actor) return;
      await actor.addEssayTopic(ADMIN_TOKEN, moduleId, topic);
      return moduleType;
    },
    onSuccess: (moduleType) => {
      if (moduleType === "essay") qc.invalidateQueries({ queryKey: QK.essays });
      else if (moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });
}

export function useDeleteEssayTopic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleId,
      topicId,
      moduleType,
    }: {
      moduleId: string;
      topicId: string;
      moduleType: string;
    }) => {
      if (!actor) return;
      await actor.deleteEssayTopic(ADMIN_TOKEN, moduleId, topicId);
      return moduleType;
    },
    onSuccess: (moduleType) => {
      if (moduleType === "essay") qc.invalidateQueries({ queryKey: QK.essays });
      else if (moduleType === "shortEssay")
        qc.invalidateQueries({ queryKey: QK.shortEssays });
      else qc.invalidateQueries({ queryKey: QK.shortNotes });
    },
  });
}
