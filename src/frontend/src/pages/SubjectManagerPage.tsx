import { useState } from "react";
import type { TabId } from "../App";

interface SubjectManagerPageProps {
  onNavigate: (tab: TabId) => void;
}

type DomainId =
  | "internal-medicine"
  | "pediatrics"
  | "general-surgery"
  | "psychiatry";

const DOMAINS: { id: DomainId; label: string; icon: string }[] = [
  { id: "internal-medicine", label: "Internal Medicine", icon: "medication" },
  { id: "pediatrics", label: "Pediatrics", icon: "child_care" },
  { id: "general-surgery", label: "General Surgery", icon: "content_cut" },
  { id: "psychiatry", label: "Psychiatry", icon: "psychology" },
];

type ModuleStatus =
  | "MASTERED"
  | "IN PROGRESS"
  | "NOT STARTED"
  | "REVIEW NEEDED";

interface Module {
  name: string;
  status: ModuleStatus;
  progress: number;
}

interface Subject {
  name: string;
  icon: string;
  moduleCount: number;
  mcqCount: number;
  masteryPercent: number;
  expanded: boolean;
  modules?: Module[];
}

const STATUS_STYLES: Record<
  ModuleStatus,
  { bg: string; text: string; bar: string }
> = {
  MASTERED: { bg: "bg-green-100", text: "text-green-800", bar: "bg-green-500" },
  "IN PROGRESS": { bg: "bg-red-100", text: "text-red-800", bar: "bg-red-600" },
  "NOT STARTED": {
    bg: "bg-zinc-200",
    text: "text-zinc-600",
    bar: "bg-zinc-300",
  },
  "REVIEW NEEDED": {
    bg: "bg-orange-100",
    text: "text-orange-800",
    bar: "bg-orange-500",
  },
};

const INITIAL_SUBJECTS: Subject[] = [
  {
    name: "Cardiology",
    icon: "favorite",
    moduleCount: 8,
    mcqCount: 450,
    masteryPercent: 72,
    expanded: true,
    modules: [
      { name: "Valvular Heart Disease", status: "MASTERED", progress: 92 },
      { name: "Ischemic Heart Disease", status: "IN PROGRESS", progress: 45 },
      { name: "Cardiac Arrhythmias", status: "NOT STARTED", progress: 0 },
      { name: "Heart Failure", status: "REVIEW NEEDED", progress: 68 },
    ],
  },
  {
    name: "Neurology",
    icon: "psychology",
    moduleCount: 6,
    mcqCount: 320,
    masteryPercent: 18,
    expanded: false,
    modules: [
      { name: "Stroke & TIA", status: "IN PROGRESS", progress: 35 },
      { name: "Epilepsy", status: "NOT STARTED", progress: 0 },
      { name: "Headache Disorders", status: "NOT STARTED", progress: 0 },
      { name: "Neurodegenerative Disease", status: "NOT STARTED", progress: 0 },
    ],
  },
];

export default function SubjectManagerPage({
  onNavigate,
}: SubjectManagerPageProps) {
  const [activeDomain, setActiveDomain] =
    useState<DomainId>("internal-medicine");
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  function toggleSubject(index: number) {
    setSubjects((prev) =>
      prev.map((s, i) => (i === index ? { ...s, expanded: !s.expanded } : s)),
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full border-b-2 border-black bg-white/70 backdrop-blur-md z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ocid="subject_manager.menu.button"
            className="material-symbols-outlined text-red-700 active:translate-x-[2px] active:translate-y-[2px] transition-transform"
          >
            menu
          </button>
          <span className="text-xl font-black text-red-700 font-headline tracking-tight">
            Medical Prep
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          <button
            type="button"
            data-ocid="subject_manager.curriculum.link"
            className="text-red-700 font-bold font-headline transition-colors"
          >
            Curriculum
          </button>
          <button
            type="button"
            data-ocid="subject_manager.qbank.link"
            onClick={() => onNavigate("mcq")}
            className="text-black hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-headline"
          >
            Q-Bank
          </button>
          <button
            type="button"
            data-ocid="subject_manager.progress.link"
            className="text-black hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-headline"
          >
            Progress
          </button>
          <button
            type="button"
            data-ocid="subject_manager.admin.link"
            className="text-black hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-headline"
          >
            Admin
          </button>
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold font-headline">Dr. Adil</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              Lead Admin
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <img
              className="w-full h-full object-cover"
              alt="Dr. Adil"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACmIrmQRVx_Vm-02PBccD0BzgHMu8qUGJ9rEYozcNYwCfHSrfTFionOM8yvM7QDdVo_RwZoyUJmJg_Uft-oE0IS6P4ug6nwdlxJhQ0MI8Tp28mabXM0MB4PqGV0gNO7dkGJzaYdsEB47t8OjW0H8EQNH6xEsZItWuxc-D2o2uOP0peiVX0zof4BU_MbReV5C2h5RESdvMpcfV78w3BPclt8atQiB8tsaorMpzGuaAI0HZerJzp-CFQClgJ0AlylNm5svkanRM5Dh6E"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 max-w-7xl mx-auto min-h-screen">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight mb-2">
            Subject Manager
          </h1>
          <p className="text-zinc-500 font-medium">
            Organize curriculum and manage module performance hierarchy.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-red-700 px-2">
              Clinical Domains
            </h3>
            <div className="space-y-2">
              {DOMAINS.map((domain) => {
                const isActive = activeDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    data-ocid={`subject_manager.${domain.id}.tab`}
                    onClick={() => setActiveDomain(domain.id)}
                    className={`w-full flex items-center gap-3 p-4 border-2 border-black rounded-xl font-bold transition-all ${
                      isActive
                        ? "bg-red-600 text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        : "bg-white text-black hover:bg-zinc-50"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={
                        isActive
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {domain.icon}
                    </span>
                    <span>{domain.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Weekly Goal Card */}
            <div className="mt-8 p-6 bg-surface-container-low rounded-3xl border-2 border-black relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-bold font-headline text-red-700 uppercase tracking-widest mb-1">
                  Weekly Goal
                </p>
                <h4 className="text-xl font-black font-headline mb-4">
                  Master 12 Subjects
                </h4>
                <div className="w-full bg-white border-2 border-black h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full border-r-2 border-black"
                    style={{ width: "65%" }}
                  />
                </div>
                <p className="mt-2 text-sm font-bold">8/12 Complete</p>
              </div>
            </div>
          </div>

          {/* Subject & Module Canvas */}
          <div className="lg:col-span-9 space-y-8">
            <section className="space-y-6">
              {subjects.map((subject, subjectIndex) => (
                <div
                  key={subject.name}
                  data-ocid={`subject_manager.subject.card.${subjectIndex + 1}`}
                  className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
                >
                  {/* Subject Header */}
                  <div className="p-6 border-b-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-600 rounded-2xl border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                        <span className="material-symbols-outlined text-3xl">
                          {subject.icon}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black font-headline tracking-tight">
                          {subject.name}
                        </h2>
                        <span className="text-sm font-bold bg-white px-2 py-0.5 border border-black rounded-md">
                          {subject.moduleCount} Modules • {subject.mcqCount}{" "}
                          MCQs
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Overall Mastery
                        </p>
                        <p className="text-lg font-black font-headline text-red-700">
                          {subject.masteryPercent}%
                        </p>
                      </div>
                      <button
                        type="button"
                        data-ocid={`subject_manager.subject.toggle.${subjectIndex + 1}`}
                        onClick={() => toggleSubject(subjectIndex)}
                        className="p-2 bg-white border-2 border-black rounded-xl hover:bg-red-50 active:scale-95 transition-all"
                      >
                        <span
                          className="material-symbols-outlined transition-transform"
                          style={{
                            transform: subject.expanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          expand_more
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Modules List */}
                  {subject.expanded && subject.modules && (
                    <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subject.modules.map((mod, modIndex) => {
                        const styles = STATUS_STYLES[mod.status];
                        return (
                          <div
                            key={mod.name}
                            data-ocid={`subject_manager.module.item.${modIndex + 1}`}
                            className="p-4 bg-surface-container-low border-2 border-black rounded-2xl hover:border-red-600 transition-colors group cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-lg leading-tight font-headline">
                                {mod.name}
                              </h4>
                              <span
                                className={`text-[10px] ${styles.bg} ${styles.text} font-black px-2 py-1 border border-black rounded-full whitespace-nowrap`}
                              >
                                {mod.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-3 bg-white border-2 border-black rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${styles.bar} ${mod.progress > 0 ? "border-r-2 border-black" : ""}`}
                                  style={{ width: `${mod.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-black font-headline">
                                {mod.progress}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-white border-t-2 border-black">
        <button
          type="button"
          data-ocid="subject_manager.bottom.curriculum.link"
          className="flex flex-col items-center justify-center bg-red-600 text-white border-2 border-black rounded-2xl py-1 px-3 mb-1"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            library_books
          </span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Curriculum
          </span>
        </button>
        <button
          type="button"
          data-ocid="subject_manager.bottom.qbank.link"
          onClick={() => onNavigate("mcq")}
          className="flex flex-col items-center justify-center text-black"
        >
          <span className="material-symbols-outlined">
            assignment_turned_in
          </span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Q-Bank
          </span>
        </button>
        <button
          type="button"
          data-ocid="subject_manager.bottom.progress.link"
          className="flex flex-col items-center justify-center text-black"
        >
          <span className="material-symbols-outlined">trending_up</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Progress
          </span>
        </button>
        <button
          type="button"
          data-ocid="subject_manager.bottom.admin.link"
          className="flex flex-col items-center justify-center text-black"
        >
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Admin
          </span>
        </button>
      </nav>

      {/* Floating Action Button */}
      <button
        type="button"
        data-ocid="subject_manager.add.primary_button"
        className="fixed right-6 bottom-24 md:bottom-10 bg-red-600 text-white w-16 h-16 rounded-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">
          add
        </span>
      </button>
    </div>
  );
}
