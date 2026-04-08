import type { AdminData } from "@/hooks/useAdminData";
import { useMemo, useState } from "react";

type ModuleStatus = "Completed" | "In Progress" | "Not Started";

interface DerivedModule {
  id: string;
  title: string;
  questions: number;
  status: ModuleStatus;
  progress?: number;
  subjectId: string;
  description: string;
}

// Subject header styles — cycle through for dynamic subjects
const SUBJECT_STYLES = [
  {
    headerBg: "bg-[#d32f2f]",
    iconClass: "text-white/20",
    titleClass: "text-white uppercase italic tracking-tighter",
    descClass: "text-[#fff2f0] opacity-90",
    iconRotate: "rotate-12",
    countClass: "bg-white/20 text-white border-white/40",
  },
  {
    headerBg: "bg-zinc-950",
    iconClass: "text-white/10",
    titleClass: "text-white uppercase italic tracking-tighter",
    descClass: "text-white/70",
    iconRotate: "-rotate-12",
    countClass: "bg-white/10 text-white border-white/30",
  },
  {
    headerBg: "bg-white",
    iconClass: "text-zinc-100",
    titleClass: "text-zinc-950 uppercase italic tracking-tighter",
    descClass: "text-zinc-500",
    iconRotate: "",
    countClass: "bg-zinc-100 text-zinc-950 border-zinc-300",
  },
  {
    headerBg: "bg-[#005f7b]",
    iconClass: "text-white/20",
    titleClass: "text-white uppercase italic tracking-tighter",
    descClass: "text-white/80",
    iconRotate: "rotate-6",
    countClass: "bg-white/15 text-white border-white/30",
  },
  {
    headerBg: "bg-[#1a1c1c]",
    iconClass: "text-white/10",
    titleClass: "text-white uppercase italic tracking-tighter",
    descClass: "text-white/60",
    iconRotate: "-rotate-6",
    countClass: "bg-white/10 text-white border-white/20",
  },
];

function StatusBadge({ status }: { status: ModuleStatus }) {
  if (status === "Completed") {
    return (
      <span className="bg-[#00799c] text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-black uppercase">
        Completed
      </span>
    );
  }
  if (status === "In Progress") {
    return (
      <span className="bg-[#e2e2e2] text-zinc-950 text-[10px] font-bold px-2 py-1 rounded border-2 border-black uppercase">
        In Progress
      </span>
    );
  }
  return (
    <span className="bg-[#e8e8e8] text-zinc-400 text-[10px] font-bold px-2 py-1 rounded border-2 border-black uppercase">
      Not Started
    </span>
  );
}

function SubjectCard({
  subject,
  styleIdx,
  moduleCount,
  mcqCount,
  onClick,
}: {
  subject: AdminData["subjects"][number];
  styleIdx: number;
  moduleCount: number;
  mcqCount: number;
  onClick: () => void;
}) {
  const style = SUBJECT_STYLES[styleIdx % SUBJECT_STYLES.length];
  return (
    <button
      type="button"
      data-ocid={`modules.subject.${subject.id}`}
      onClick={onClick}
      className={`${style.headerBg} border-2 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all relative overflow-hidden text-left w-full group cursor-pointer`}
    >
      {/* Large background icon */}
      <span
        className={`material-symbols-outlined absolute -right-4 -bottom-4 text-8xl ${style.iconClass} ${style.iconRotate} select-none`}
      >
        {subject.icon}
      </span>

      {/* Subject name */}
      <h3
        className={`text-2xl font-headline font-extrabold ${style.titleClass} mb-2 leading-tight`}
      >
        {subject.name}
      </h3>

      {/* Module count subtitle */}
      <p className={`${style.descClass} font-medium text-sm mb-4`}>
        {moduleCount} {moduleCount === 1 ? "Module" : "Modules"} &bull;{" "}
        {mcqCount} {mcqCount === 1 ? "Question" : "Questions"}
      </p>

      {/* CTA chip */}
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest border rounded-full px-3 py-1 ${style.countClass} font-headline`}
      >
        Open
        <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </span>
    </button>
  );
}

function ModuleCard({
  mod,
  ocid,
  onClick,
}: {
  mod: DerivedModule;
  ocid: string;
  onClick: () => void;
}) {
  const isInProgress = mod.status === "In Progress";
  const isCompleted = mod.status === "Completed";
  const isNotStarted = mod.status === "Not Started";

  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={`w-full bg-surface-container-lowest border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer group text-left${
        isInProgress ? " border-l-8 border-l-[#af101a]" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-headline font-bold text-lg text-zinc-950 leading-tight pr-2">
          {mod.title}
        </h4>
        <StatusBadge status={mod.status} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-body font-medium text-secondary">
          {mod.questions} Questions
        </span>
        {isCompleted && (
          <span className="material-symbols-outlined text-[#af101a] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        )}
        {isNotStarted && (
          <span className="material-symbols-outlined text-zinc-300">lock</span>
        )}
        {isInProgress && (
          <div className="w-24 h-2 bg-[#e8e8e8] rounded-full border border-black overflow-hidden">
            <div
              className="bg-[#af101a] h-full"
              style={{ width: `${mod.progress ?? 0}%` }}
            />
          </div>
        )}
      </div>
    </button>
  );
}

export default function ModulesPage({
  adminData,
  onStartPractice,
}: {
  adminData: AdminData;
  onStartPractice: (subjectId: string) => void;
}) {
  const { subjects, modules, mcqs } = adminData;

  // Store only IDs so that derived objects always come from the latest adminData
  // This prevents stale subject/module names after admin edits
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Derive live objects from current adminData on every render
  const selectedSubject = selectedSubjectId
    ? (subjects.find((s) => s.id === selectedSubjectId) ?? null)
    : null;

  // Derive display modules from admin data — recalculates when modules/mcqs change
  const derivedModules: DerivedModule[] = useMemo(() => {
    return modules.map((m) => {
      const questionCount = mcqs.filter((q) => q.moduleId === m.id).length;
      let status: ModuleStatus = "Not Started";
      if (m.status === "Active") status = "In Progress";
      else if (m.status === "Archived") status = "Completed";
      return {
        id: m.id,
        title: m.name,
        questions: questionCount,
        status,
        progress: undefined,
        subjectId: m.subjectId,
        description: m.description,
      };
    });
  }, [modules, mcqs]);

  // Derive the selected module from the derived modules list (always up-to-date)
  const selectedModule = selectedModuleId
    ? (derivedModules.find((m) => m.id === selectedModuleId) ?? null)
    : null;

  // Subject groups with counts — recalculates when subjects/modules/mcqs change
  const subjectGroups = useMemo(() => {
    return subjects.map((subject, sIdx) => ({
      subject,
      styleIdx: sIdx,
      moduleCount: modules.filter((m) => m.subjectId === subject.id).length,
      mcqCount: mcqs.filter((q) => q.subjectId === subject.id).length,
    }));
  }, [subjects, modules, mcqs]);

  // Modules for the selected subject (with optional search filter)
  const subjectModules = useMemo(() => {
    if (!selectedSubjectId) return [];
    const forSubject = derivedModules.filter(
      (m) => m.subjectId === selectedSubjectId,
    );
    if (!searchQuery.trim()) return forSubject;
    const q = searchQuery.toLowerCase();
    return forSubject.filter((m) => m.title.toLowerCase().includes(q));
  }, [derivedModules, selectedSubjectId, searchQuery]);

  const selectedSubjectStyle = useMemo(() => {
    if (!selectedSubjectId) return null;
    const idx = subjects.findIndex((s) => s.id === selectedSubjectId);
    return SUBJECT_STYLES[(idx >= 0 ? idx : 0) % SUBJECT_STYLES.length];
  }, [selectedSubjectId, subjects]);

  // ── VIEW 3: Module Detail ───────────────────────────────────────────────────
  if (selectedModule) {
    return (
      <div className="pt-24 pb-32 px-6 max-w-3xl mx-auto">
        <button
          type="button"
          data-ocid="modules.back.button"
          onClick={() => setSelectedModuleId(null)}
          className="flex items-center gap-2 font-headline font-bold text-sm uppercase tracking-widest text-secondary hover:text-black transition-colors mb-8 mt-6"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Back to {selectedSubject?.name ?? "Modules"}
        </button>

        <div
          data-ocid="modules.detail.card"
          className="bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-[#bee9ff] w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span
                className="material-symbols-outlined text-[#005f7b]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
            </div>
            <div>
              <h2 className="font-headline text-3xl font-extrabold leading-tight">
                {selectedModule.title}
              </h2>
              <p className="text-secondary mt-1">
                {selectedModule.questions} Questions
              </p>
            </div>
          </div>
          <div className="h-[2px] bg-black mb-6" />
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge status={selectedModule.status} />
            {selectedModule.status === "In Progress" &&
              selectedModule.progress && (
                <span className="text-sm font-body text-secondary">
                  {selectedModule.progress}% complete
                </span>
              )}
          </div>
          <p className="text-on-background text-base leading-relaxed">
            {selectedModule.description}
          </p>
          <div className="mt-8 bg-surface-container border-2 border-black rounded-xl p-6">
            <p className="font-headline font-bold text-sm uppercase tracking-widest text-secondary mb-2">
              Practice Questions
            </p>
            <p className="text-sm text-secondary">
              This module contains {selectedModule.questions} MCQ questions.
              Start a practice session to test your knowledge.
            </p>
            <button
              type="button"
              data-ocid="modules.detail.primary_button"
              onClick={() => onStartPractice(selectedModule.subjectId)}
              className="mt-4 bg-[#af101a] text-white font-headline font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW 2: Module List (subject selected) ──────────────────────────────────
  if (selectedSubject) {
    const style = selectedSubjectStyle!;
    return (
      <div className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto">
        {/* Back + Subject Header */}
        <div className="mt-6 mb-8">
          <button
            type="button"
            data-ocid="modules.subject.back"
            onClick={() => {
              setSelectedSubjectId(null);
              setSearchQuery("");
            }}
            className="flex items-center gap-2 font-headline font-bold text-sm uppercase tracking-widest text-secondary hover:text-black transition-colors mb-6"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            All Subjects
          </button>

          {/* Subject Banner */}
          <div
            className={`${style.headerBg} border-2 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-6`}
          >
            <span
              className={`material-symbols-outlined absolute -right-4 -bottom-4 text-8xl ${style.iconClass} ${style.iconRotate} select-none`}
            >
              {selectedSubject.icon}
            </span>
            <h2
              className={`text-3xl font-headline font-extrabold ${style.titleClass} mb-1`}
            >
              {selectedSubject.name}
            </h2>
            <p className={`${style.descClass} font-medium text-sm`}>
              {subjectGroups.find((g) => g.subject.id === selectedSubject.id)
                ?.moduleCount ?? 0}{" "}
              Modules
            </p>
          </div>

          {/* Search bar */}
          <div className="bg-surface-container-lowest border-2 border-black py-4 px-4 rounded-lg flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-primary">
              search
            </span>
            <input
              data-ocid="modules.search_input"
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 font-headline font-bold text-sm w-full text-zinc-950 placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Module Cards */}
        {subjectModules.length === 0 ? (
          <div
            data-ocid="modules.subject.empty_state"
            className="bg-white border-2 border-black rounded-2xl p-16 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
          >
            <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4 block">
              library_books
            </span>
            <h3 className="font-headline text-2xl font-extrabold mb-2">
              {searchQuery ? "No results found" : "No Modules Yet"}
            </h3>
            <p className="text-secondary">
              {searchQuery
                ? "Try a different search term."
                : "Modules for this subject will appear here once added by an admin."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {subjectModules.map((mod, modIdx) => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                ocid={`modules.item.${modIdx + 1}`}
                onClick={() => setSelectedModuleId(mod.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── VIEW 1: Subject List (default) ──────────────────────────────────────────
  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="bg-primary text-white font-headline font-bold text-xs px-3 py-1 rounded-full border-2 border-black uppercase tracking-widest mb-3 inline-block">
          Curriculum
        </span>
        <h2 className="text-5xl font-headline font-extrabold tracking-tight text-zinc-950">
          Subject Access
        </h2>
        <p className="text-secondary font-body mt-2 text-base">
          Select a subject to browse its modules.
        </p>
      </div>

      {/* Empty state */}
      {subjects.length === 0 && (
        <div
          data-ocid="modules.empty_state"
          className="bg-white border-2 border-black rounded-2xl p-16 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
        >
          <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4 block">
            library_books
          </span>
          <h3 className="font-headline text-2xl font-extrabold mb-2">
            No Subjects Yet
          </h3>
          <p className="text-secondary">
            Subjects and modules added by an admin will appear here.
          </p>
        </div>
      )}

      {/* Subject Cards Grid */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {subjectGroups.map(({ subject, styleIdx, moduleCount, mcqCount }) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              styleIdx={styleIdx}
              moduleCount={moduleCount}
              mcqCount={mcqCount}
              onClick={() => setSelectedSubjectId(subject.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
