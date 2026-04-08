import type { AdminData, LocalEssayModule } from "@/hooks/useAdminData";
import { useState } from "react";

type ExpandedCard = "essays" | "short-essays" | "short-notes" | null;

// ── Accent config per section ────────────────────────────────────────────────
const ACCENTS = {
  essays: {
    icon: "description",
    label: "HIGH YIELD",
    iconBg: "bg-primary",
    iconText: "text-primary-foreground",
    badgeBg: "bg-primary/10 text-primary",
    progressBar: "bg-primary",
    progressLabel: "text-primary",
    headerBorder: "border-primary/30",
    checkFill: "bg-primary",
    ctaHover: "group-hover:text-primary",
    subtitle: "Long-form comprehensive answers",
  },
  shortEssays: {
    icon: "article",
    label: "CRITICAL",
    iconBg: "bg-secondary",
    iconText: "text-secondary-foreground",
    badgeBg: "bg-secondary/10 text-secondary",
    progressBar: "bg-secondary",
    progressLabel: "text-secondary",
    headerBorder: "border-secondary/30",
    checkFill: "bg-secondary",
    ctaHover: "group-hover:text-secondary",
    subtitle: "Mid-range technical explanations",
  },
  shortNotes: {
    icon: "edit_note",
    label: "FREQUENT",
    iconBg: "bg-accent",
    iconText: "text-accent-foreground",
    badgeBg: "bg-accent/10 text-accent",
    progressBar: "bg-accent",
    progressLabel: "text-accent",
    headerBorder: "border-accent/30",
    checkFill: "bg-accent",
    ctaHover: "group-hover:text-accent",
    subtitle: "Quick definitions and diagrams",
  },
} as const;

// ── Archive Topic List ────────────────────────────────────────────────────────
function ArchiveTopicList({
  modules,
  toggleTopic,
  accent,
}: {
  modules: LocalEssayModule[];
  toggleTopic: (moduleId: string, topicId: string) => void;
  accent: (typeof ACCENTS)[keyof typeof ACCENTS];
}) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (modules.length === 0) {
    return (
      <div
        data-ocid="pyq.empty-state"
        className="flex flex-col items-center gap-2 py-8"
      >
        <span
          className="material-symbols-outlined text-muted-foreground text-4xl"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
        >
          inbox
        </span>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          No content added yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((mod) => {
        const modDone = mod.topics.filter((t) => t.done).length;
        const modTotal = mod.topics.length;
        const modPct =
          modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;
        const isExpanded = expandedModule === mod.id;

        return (
          <div
            key={mod.id}
            className="border-2 border-black rounded-xl overflow-hidden neo-brutal-shadow-sm"
          >
            {/* Module Header */}
            <button
              type="button"
              data-ocid={`pyq.module.${mod.id}`}
              onClick={() =>
                setExpandedModule((prev) => (prev === mod.id ? null : mod.id))
              }
              className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`material-symbols-outlined text-base ${accent.progressLabel} shrink-0`}
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                >
                  folder
                </span>
                <span className="font-headline font-bold text-sm text-foreground truncate">
                  {mod.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-xs font-black font-headline text-muted-foreground">
                  {modDone}/{modTotal}
                </span>
                <div className="w-16 h-2 bg-border border border-black rounded-full overflow-hidden">
                  <div
                    className={`h-full ${accent.progressBar} transition-all`}
                    style={{ width: `${modPct}%` }}
                  />
                </div>
                <span className="material-symbols-outlined text-muted-foreground text-base">
                  {isExpanded ? "expand_less" : "expand_more"}
                </span>
              </div>
            </button>

            {/* Topics */}
            {isExpanded && (
              <div className="border-t-2 border-black p-4">
                {mod.topics.length === 0 ? (
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center py-3">
                    No topics added
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {mod.topics.map((topic) => (
                      <li
                        key={topic.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        <button
                          type="button"
                          data-ocid={`pyq.topic.${topic.id}`}
                          onClick={() => toggleTopic(mod.id, topic.id)}
                          className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center shrink-0 transition-all active:scale-90 neo-brutal-press ${
                            topic.done
                              ? `${accent.checkFill} border-transparent`
                              : "bg-background hover:bg-muted/50"
                          }`}
                          aria-label={
                            topic.done ? "Mark incomplete" : "Mark complete"
                          }
                        >
                          {topic.done && (
                            <span
                              className="material-symbols-outlined text-background"
                              style={{
                                fontSize: "12px",
                                fontVariationSettings: "'FILL' 1, 'wght' 700",
                              }}
                            >
                              check
                            </span>
                          )}
                        </button>
                        <span
                          className={`text-sm font-medium font-body flex-1 min-w-0 break-words ${
                            topic.done
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {topic.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({
  id,
  title,
  accent,
  progress,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  accent: (typeof ACCENTS)[keyof typeof ACCENTS];
  progress: { done: number; total: number; pct: number };
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      data-ocid={`pyq.${id}.card`}
      className="bg-card border-2 border-black rounded-xl neo-brutal-shadow overflow-hidden"
    >
      {/* Card Header Button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-6 text-left group transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 neo-brutal-press active:shadow-none"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 ${accent.iconBg} ${accent.iconText} border-2 border-black rounded-xl flex items-center justify-center neo-brutal-shadow-sm shrink-0`}
            >
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
              >
                {accent.icon}
              </span>
            </div>
            <div>
              <h2 className="font-headline text-xl font-extrabold uppercase tracking-wide text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {accent.subtitle}
              </p>
            </div>
          </div>
          <span
            className={`${accent.badgeBg} text-xs px-3 py-1 rounded-full border-2 border-black font-bold font-headline uppercase shrink-0`}
          >
            {accent.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-headline font-extrabold ${accent.progressLabel} uppercase tracking-wider`}
            >
              Progress
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              {progress.done}/{progress.total} topics &bull; {progress.pct}%
            </span>
          </div>
          <div className="h-3 w-full bg-muted border-2 border-black rounded-full overflow-hidden">
            <div
              className={`h-full ${accent.progressBar} transition-all duration-500`}
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-end">
          <div
            className={`flex items-center gap-2 font-headline font-bold text-sm transition-colors text-muted-foreground ${accent.ctaHover}`}
          >
            {expanded ? "HIDE TOPICS" : "START ARCHIVE"}
            <span className="material-symbols-outlined text-base">
              {expanded ? "expand_less" : "arrow_forward"}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t-2 border-black px-6 pb-6 pt-5">{children}</div>
      )}
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PYQPage({ adminData }: { adminData: AdminData }) {
  const {
    essayModules,
    shortEssayModules,
    shortNoteModules,
    toggleEssayTopic,
    toggleShortEssayTopic,
    toggleShortNoteTopic,
  } = adminData;

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  function toggleCard(card: ExpandedCard) {
    setExpandedCard((prev) => (prev === card ? null : card));
  }

  function calcProgress(modules: LocalEssayModule[]) {
    const total = modules.reduce((s, m) => s + m.topics.length, 0);
    const done = modules.reduce(
      (s, m) => s + m.topics.filter((t) => t.done).length,
      0,
    );
    return {
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }

  const essayProgress = calcProgress(essayModules);
  const shortEssayProgress = calcProgress(shortEssayModules);
  const shortNoteProgress = calcProgress(shortNoteModules);

  return (
    <div className="bg-background font-body text-foreground min-h-screen pb-24 relative">
      {/* Subtle dot pattern background */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.508 0.14 17.4) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.04,
        }}
      />

      <main className="pt-24 px-4 sm:px-6 max-w-2xl mx-auto pb-24">
        {/* ── Hero ── */}
        <div className="mb-10 flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-primary/10 border-2 border-primary/40 rounded-full px-3 py-1 mb-3">
              <span
                className="material-symbols-outlined text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
              >
                stars
              </span>
              <span className="text-xs font-headline font-extrabold text-primary uppercase tracking-wider">
                PYQ Archive
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-foreground mb-2 tracking-tight leading-tight">
              Previous Year
              <br />
              <span className="text-primary">Questions</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Master high-yield patterns from previous examinations with
              categorised essay and note archives.
            </p>
          </div>
          <div className="shrink-0 hidden sm:block">
            <div className="w-28 h-28 border-2 border-black rounded-2xl overflow-hidden neo-brutal-shadow bg-muted/20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqBXr998RD5mnqWMpkWEwvDf8Dy2Q_0jfN-TubvVk6VAxntWNvAAy9LjQJPUyndXRd3N4lsfuBy0PKXpEL3VuG9fq_Be5dN0_9D41G08LG2wfz1QpsxY_Zcj_AAvONWmd0GXW9bPDfdCaXQtNd4g--p_buc83OgbDhWmrbOqtJ3bsHvxLgOhaqMcK0iT2CBMsZqu5vtkXOf3SypX2Rz6lRR1zdLQH0wAuvAC6YECsobLnkCZhLSGKHJzzUWiKTjUzMGhZ8NRUhwRLRl"
                alt="Scales of Justice"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* ── Overall stats strip ── */}
        <div
          data-ocid="pyq.stats-strip"
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "Essays", ...essayProgress, accent: ACCENTS.essays },
            {
              label: "Short Essays",
              ...shortEssayProgress,
              accent: ACCENTS.shortEssays,
            },
            {
              label: "Short Notes",
              ...shortNoteProgress,
              accent: ACCENTS.shortNotes,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card border-2 border-black rounded-xl p-3 text-center neo-brutal-shadow-sm"
            >
              <div
                className={`text-lg font-headline font-extrabold ${s.accent.progressLabel}`}
              >
                {s.pct}%
              </div>
              <div className="text-xs font-bold text-muted-foreground leading-tight mt-0.5 truncate">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Section Cards ── */}
        <div className="flex flex-col gap-6">
          {/* Essays */}
          <SectionCard
            id="essays"
            title="Essays"
            accent={ACCENTS.essays}
            progress={essayProgress}
            expanded={expandedCard === "essays"}
            onToggle={() => toggleCard("essays")}
          >
            <ArchiveTopicList
              modules={essayModules}
              toggleTopic={toggleEssayTopic}
              accent={ACCENTS.essays}
            />
          </SectionCard>

          {/* Short Essays */}
          <SectionCard
            id="short-essays"
            title="Short Essays"
            accent={ACCENTS.shortEssays}
            progress={shortEssayProgress}
            expanded={expandedCard === "short-essays"}
            onToggle={() => toggleCard("short-essays")}
          >
            <ArchiveTopicList
              modules={shortEssayModules}
              toggleTopic={toggleShortEssayTopic}
              accent={ACCENTS.shortEssays}
            />
          </SectionCard>

          {/* Short Notes */}
          <SectionCard
            id="short-notes"
            title="Short Notes"
            accent={ACCENTS.shortNotes}
            progress={shortNoteProgress}
            expanded={expandedCard === "short-notes"}
            onToggle={() => toggleCard("short-notes")}
          >
            <ArchiveTopicList
              modules={shortNoteModules}
              toggleTopic={toggleShortNoteTopic}
              accent={ACCENTS.shortNotes}
            />
          </SectionCard>
        </div>

        {/* ── Pro Tip ── */}
        <div className="mt-12 bg-primary/5 border-2 border-dashed border-primary/40 rounded-xl p-5 flex gap-4 items-start">
          <span
            className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
          >
            lightbulb
          </span>
          <p className="text-sm font-medium text-muted-foreground italic leading-relaxed">
            <span className="font-extrabold text-foreground not-italic">
              Pro Tip:{" "}
            </span>
            Focusing on the{" "}
            <span className="font-bold text-primary">Essays</span> archive
            covers ~70% of the material needed for{" "}
            <span className="font-bold text-secondary">Short Essays</span> too.
            Prioritise long-form study for deeper integration.
          </p>
        </div>
      </main>
    </div>
  );
}
