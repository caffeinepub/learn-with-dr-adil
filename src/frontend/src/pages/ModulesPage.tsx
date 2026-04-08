import type { AdminData, Module } from "@/hooks/useAdminData";
import { useMemo, useState } from "react";

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

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="bg-[#00799c] text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-black uppercase tracking-wide">
        Active
      </span>
    );
  }
  if (status === "Archived") {
    return (
      <span className="bg-[#e2e2e2] text-zinc-700 text-[10px] font-bold px-2 py-1 rounded border-2 border-black uppercase tracking-wide">
        Archived
      </span>
    );
  }
  // Draft (default)
  return (
    <span className="bg-[#f5f0e8] text-zinc-500 text-[10px] font-bold px-2 py-1 rounded border-2 border-black uppercase tracking-wide">
      Draft
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

      <h3
        className={`text-2xl font-headline font-extrabold ${style.titleClass} mb-2 leading-tight`}
      >
        {subject.name}
      </h3>

      <p className={`${style.descClass} font-medium text-sm mb-4`}>
        {moduleCount} {moduleCount === 1 ? "Module" : "Modules"} &bull;{" "}
        {mcqCount} {mcqCount === 1 ? "Question" : "Questions"}
      </p>

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
  onStartPractice,
}: {
  mod: Module;
  ocid: string;
  onStartPractice: () => void;
}) {
  const moduleTitle = mod.name || mod.title || "Untitled Module";
  const status = mod.status || "Draft";
  const isActive = status === "Active";

  return (
    <div
      data-ocid={ocid}
      className={`bg-white border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all${
        isActive ? " border-l-[6px] border-l-[#af101a]" : ""
      }`}
    >
      {/* Header row: title + status badge */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <h4 className="font-headline font-bold text-lg text-zinc-950 leading-tight min-w-0 break-words">
          {moduleTitle}
        </h4>
        <StatusBadge status={status} />
      </div>

      {/* Description */}
      {mod.description && (
        <p className="text-sm font-body text-zinc-500 mb-4 leading-relaxed line-clamp-2">
          {mod.description}
        </p>
      )}

      {/* Footer: Start Practice button */}
      <div className="flex items-center justify-between mt-2">
        <button
          type="button"
          data-ocid={`${ocid}.start_practice`}
          onClick={onStartPractice}
          className="inline-flex items-center gap-2 bg-[#af101a] text-white font-headline font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
          Start Practice
        </button>

        <span className="material-symbols-outlined text-zinc-300 text-2xl select-none">
          {isActive ? "radio_button_checked" : "radio_button_unchecked"}
        </span>
      </div>
    </div>
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

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derive live object from current adminData on every render
  const selectedSubject = selectedSubjectId
    ? (subjects.find((s) => s.id === selectedSubjectId) ?? null)
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
    const forSubject = modules.filter((m) => m.subjectId === selectedSubjectId);
    if (!searchQuery.trim()) return forSubject;
    const q = searchQuery.toLowerCase();
    return forSubject.filter((m) => {
      const title = m.name || m.title || "";
      return title.toLowerCase().includes(q);
    });
  }, [modules, selectedSubjectId, searchQuery]);

  const selectedSubjectStyle = useMemo(() => {
    if (!selectedSubjectId) return null;
    const idx = subjects.findIndex((s) => s.id === selectedSubjectId);
    return SUBJECT_STYLES[(idx >= 0 ? idx : 0) % SUBJECT_STYLES.length];
  }, [selectedSubjectId, subjects]);

  // ── VIEW 2: Module List (subject selected) ──────────────────────────────────
  if (selectedSubject) {
    const style = selectedSubjectStyle!;
    return (
      <div className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mt-6 mb-8">
          {/* Back button */}
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
          <div className="bg-white border-2 border-black py-4 px-4 rounded-lg flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                onStartPractice={() => onStartPractice(selectedSubject.id)}
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
      <div className="mb-10 mt-6">
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
      {subjects.length === 0 ? (
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
      ) : (
        /* Subject Cards Grid */
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
