import { useCallback, useState } from "react";

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

const SEED_SUBJECTS: Subject[] = [
  { id: "s1", name: "Cardiology", icon: "favorite", color: "bg-red-100" },
  { id: "s2", name: "Neurology", icon: "psychology", color: "bg-blue-100" },
  { id: "s3", name: "Nephrology", icon: "nephrology", color: "bg-teal-100" },
];

const SEED_MODULES: Module[] = [
  {
    id: "m1",
    subjectId: "s1",
    name: "Valvular Heart Disease",
    description:
      "Comprehensive coverage of mitral, aortic, tricuspid and pulmonary valve disorders including pathophysiology and management.",
    status: "Active",
    icon: "heart_valve",
  },
  {
    id: "m2",
    subjectId: "s1",
    name: "Ischemic Heart Disease",
    description:
      "Stable angina, ACS, STEMI, NSTEMI — diagnosis, investigations and treatment algorithms.",
    status: "Active",
    icon: "ecg_heart",
  },
  {
    id: "m3",
    subjectId: "s1",
    name: "Cardiac Arrhythmias",
    description:
      "Tachyarrhythmias, bradyarrhythmias, WPW, AF/AFL, SVT and antiarrhythmic drug classes.",
    status: "Draft",
    icon: "monitor_heart",
  },
  {
    id: "m4",
    subjectId: "s2",
    name: "Stroke",
    description:
      "Ischemic vs. haemorrhagic stroke, thrombolysis windows, NIHSS scoring and rehabilitation pathways.",
    status: "Active",
    icon: "neurology",
  },
  {
    id: "m5",
    subjectId: "s2",
    name: "Epilepsy",
    description:
      "Classification of seizures, anti-epileptic drug selection, status epilepticus management.",
    status: "Active",
    icon: "bolt",
  },
  {
    id: "m6",
    subjectId: "s3",
    name: "Chronic Kidney Disease",
    description:
      "CKD staging, complications (anaemia, bone disease, hypertension), renal replacement therapy options.",
    status: "Active",
    icon: "nephrology",
  },
  {
    id: "m7",
    subjectId: "s3",
    name: "Acute Kidney Injury",
    description:
      "Pre-renal, renal and post-renal causes, KDIGO criteria, fluid management and indications for dialysis.",
    status: "Draft",
    icon: "water_drop",
  },
];

const SEED_MCQS: MCQ[] = [
  {
    id: "q1",
    subjectId: "s1",
    moduleId: "m1",
    question:
      "A 68-year-old man presents with exertional dyspnoea and a low-pitched mid-diastolic murmur at the apex. Which valve lesion is most likely?",
    optionA: "Aortic stenosis",
    optionB: "Mitral stenosis",
    optionC: "Tricuspid regurgitation",
    optionD: "Pulmonary stenosis",
    correctAnswer: "B",
    explanation:
      "Mitral stenosis produces a low-pitched mid-diastolic rumbling murmur best heard at the apex with the bell of the stethoscope in the left lateral position.",
  },
  {
    id: "q2",
    subjectId: "s1",
    moduleId: "m2",
    question:
      "Which ECG finding is pathognomonic of an acute STEMI in the left anterior descending (LAD) territory?",
    optionA: "ST depression in leads II, III, aVF",
    optionB: "ST elevation in leads V1-V4",
    optionC: "Prolonged QT interval",
    optionD: "Delta waves in V1",
    correctAnswer: "B",
    explanation:
      "LAD territory STEMI classically presents with ST elevation in the anterior leads V1–V4 reflecting anterior wall injury.",
  },
  {
    id: "q3",
    subjectId: "s2",
    moduleId: "m4",
    question:
      "Within what time window from symptom onset is IV alteplase indicated for ischaemic stroke in an eligible patient?",
    optionA: "1 hour",
    optionB: "3 hours",
    optionC: "4.5 hours",
    optionD: "6 hours",
    correctAnswer: "C",
    explanation:
      "Current guidelines support IV alteplase (tPA) up to 4.5 hours from symptom onset in carefully selected patients without contraindications.",
  },
  {
    id: "q4",
    subjectId: "s3",
    moduleId: "m6",
    question:
      "A patient with CKD stage 3 has eGFR of 40 mL/min/1.73m². Which complication should be screened for and treated earliest?",
    optionA: "Pericarditis",
    optionB: "Anaemia due to EPO deficiency",
    optionC: "Uraemic encephalopathy",
    optionD: "Pulmonary oedema",
    correctAnswer: "B",
    explanation:
      "Anaemia from reduced EPO production begins in CKD stage 3 and should be screened with Hb, iron studies and managed with iron supplementation ± ESA therapy.",
  },
];

const SEED_ESSAY_MODULES: EssayModule[] = [
  {
    id: "em1",
    name: "Cardiology Essays",
    topics: [
      { id: "et1", title: "Mitral Stenosis", done: true },
      { id: "et2", title: "Aortic Regurgitation", done: false },
      { id: "et3", title: "Heart Failure Management", done: false },
    ],
  },
  {
    id: "em2",
    name: "Neurology Essays",
    topics: [
      { id: "et4", title: "Ischaemic Stroke", done: true },
      { id: "et5", title: "Epilepsy Classification", done: false },
    ],
  },
];

const SEED_SHORT_ESSAY_MODULES: EssayModule[] = [
  {
    id: "se1",
    name: "Cardiology Short Essays",
    topics: [
      { id: "set1", title: "Atrial Fibrillation", done: false },
      { id: "set2", title: "Hypertensive Crisis", done: false },
      { id: "set3", title: "Cardiac Tamponade", done: false },
    ],
  },
  {
    id: "se2",
    name: "Neurology Short Essays",
    topics: [
      { id: "set4", title: "Meningitis Management", done: false },
      { id: "set5", title: "Guillain-Barré Syndrome", done: false },
    ],
  },
];

const SEED_SHORT_NOTE_MODULES: EssayModule[] = [
  {
    id: "sn1",
    name: "Cardiology Short Notes",
    topics: [
      { id: "snt1", title: "ECG Interpretation", done: true },
      { id: "snt2", title: "Cardiac Enzymes", done: true },
      { id: "snt3", title: "CHADS2 Score", done: false },
    ],
  },
  {
    id: "sn2",
    name: "Neurology Short Notes",
    topics: [
      { id: "snt4", title: "Glasgow Coma Scale", done: true },
      { id: "snt5", title: "Dermatomes", done: false },
    ],
  },
];

export function useAdminData() {
  const [subjects, setSubjects] = useState<Subject[]>(SEED_SUBJECTS);
  const [modules, setModules] = useState<Module[]>(SEED_MODULES);
  const [mcqs, setMcqs] = useState<MCQ[]>(SEED_MCQS);
  const [essayModules, setEssayModules] =
    useState<EssayModule[]>(SEED_ESSAY_MODULES);
  const [shortEssayModules, setShortEssayModules] = useState<EssayModule[]>(
    SEED_SHORT_ESSAY_MODULES,
  );
  const [shortNoteModules, setShortNoteModules] = useState<EssayModule[]>(
    SEED_SHORT_NOTE_MODULES,
  );

  // ─── Subject CRUD ────────────────────────────────────────────────────────────
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

  // ─── Module CRUD ─────────────────────────────────────────────────────────────
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

  // ─── MCQ CRUD ────────────────────────────────────────────────────────────────
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

  // ─── Essay Module CRUD (stable callbacks) ────────────────────────────────────
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

  // ─── Short Essay Module CRUD (stable callbacks) ───────────────────────────────
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

  // ─── Short Note Module CRUD (stable callbacks) ────────────────────────────────
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
    // Essays
    addEssayModule,
    deleteEssayModule,
    addEssayTopic,
    deleteEssayTopic,
    toggleEssayTopic,
    // Short Essays
    addShortEssayModule,
    deleteShortEssayModule,
    addShortEssayTopic,
    deleteShortEssayTopic,
    toggleShortEssayTopic,
    // Short Notes
    addShortNoteModule,
    deleteShortNoteModule,
    addShortNoteTopic,
    deleteShortNoteTopic,
    toggleShortNoteTopic,
  };
}

export type AdminData = ReturnType<typeof useAdminData>;
