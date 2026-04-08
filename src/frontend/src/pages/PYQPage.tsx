import type { AdminData } from "@/hooks/useAdminData";
import { useState } from "react";

type ExpandedCard = "essays" | "short-essays" | "short-notes" | null;

function ArchiveTopicList({
  modules,
  toggleTopic,
  accentClass,
  accentBorderClass,
}: {
  modules: AdminData["essayModules"];
  toggleTopic: (moduleId: string, topicId: string) => void;
  accentClass: string;
  accentBorderClass: string;
}) {
  if (modules.length === 0) {
    return (
      <p className="text-center text-sm font-bold text-zinc-400 uppercase tracking-wider py-4">
        No topics added yet.
      </p>
    );
  }
  return (
    <>
      {modules.map((mod) => {
        const modDone = mod.topics.filter((t) => t.done).length;
        const modTotal = mod.topics.length;
        const modPct =
          modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;
        return (
          <div key={mod.id}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline font-extrabold text-base">
                {mod.name}
              </h3>
              <span className="text-xs font-black font-headline text-secondary">
                {modDone}/{modTotal} &bull; {modPct}%
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container border border-black rounded-full overflow-hidden mb-3">
              <div
                className={`h-full ${accentClass} ${accentBorderClass} transition-all`}
                style={{ width: `${modPct}%` }}
              />
            </div>
            <ul className="space-y-2">
              {mod.topics.length === 0 && (
                <li className="text-xs text-zinc-400 font-bold uppercase tracking-wider text-center py-2">
                  No topics
                </li>
              )}
              {mod.topics.map((topic) => (
                <li
                  key={topic.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleTopic(mod.id, topic.id)}
                    className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                      topic.done
                        ? `${accentClass} border-current`
                        : "bg-white hover:bg-surface-container"
                    }`}
                    aria-label={
                      topic.done ? "Mark incomplete" : "Mark complete"
                    }
                  >
                    {topic.done && (
                      <span
                        className="material-symbols-outlined text-white"
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
                    className={`text-sm font-medium font-body flex-1 ${
                      topic.done
                        ? "line-through text-zinc-400"
                        : "text-on-surface"
                    }`}
                  >
                    {topic.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

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

  // Progress helpers
  function calcProgress(modules: typeof essayModules) {
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
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24 relative">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          backgroundImage: "radial-gradient(#af101a 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.05,
        }}
      />

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-24">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
            Previous Year Questions
          </h1>
          <p className="text-secondary font-medium">
            Master the patterns from previous examinations with categorized
            high-yield archives.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* ── ESSAYS ── */}
          <section
            data-ocid="pyq.essays.card"
            className="bg-surface-container-lowest border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <button
              type="button"
              onClick={() => toggleCard("essays")}
              className="w-full p-6 text-left group transition-all hover:-translate-y-1 hover:-translate-x-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-3xl">
                      description
                    </span>
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-bold uppercase tracking-wide">
                      ESSAYS
                    </h2>
                    <p className="text-sm text-secondary font-medium">
                      Long-form comprehensive answers
                    </p>
                  </div>
                </div>
                <span className="bg-primary-fixed text-on-primary-fixed font-label text-xs px-3 py-1 rounded-full border border-black font-bold">
                  HIGH YIELD
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-headline font-bold text-primary uppercase">
                    Progress
                  </span>
                  <span className="text-sm font-bold">
                    {essayProgress.done}/{essayProgress.total} Topics Completed
                  </span>
                </div>
                <div className="h-4 w-full bg-surface-container border-2 border-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary border-r-2 border-black transition-all"
                    style={{ width: `${essayProgress.pct}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end">
                <div className="flex items-center gap-2 font-headline font-bold text-sm group-hover:text-primary transition-colors">
                  {expandedCard === "essays" ? "HIDE TOPICS" : "START ARCHIVE"}{" "}
                  <span className="material-symbols-outlined text-sm">
                    {expandedCard === "essays"
                      ? "expand_less"
                      : "arrow_forward"}
                  </span>
                </div>
              </div>
            </button>
            {expandedCard === "essays" && (
              <div className="border-t-2 border-black px-6 pb-6 pt-4 space-y-6">
                <ArchiveTopicList
                  modules={essayModules}
                  toggleTopic={toggleEssayTopic}
                  accentClass="bg-primary"
                  accentBorderClass="border-r border-black"
                />
              </div>
            )}
          </section>

          {/* ── SHORT ESSAYS ── */}
          <section
            data-ocid="pyq.short-essays.card"
            className="bg-surface-container-lowest border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <button
              type="button"
              onClick={() => toggleCard("short-essays")}
              className="w-full p-6 text-left group transition-all hover:-translate-y-1 hover:-translate-x-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-tertiary text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-3xl">
                      article
                    </span>
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-bold uppercase tracking-wide">
                      SHORT ESSAYS
                    </h2>
                    <p className="text-sm text-secondary font-medium">
                      Mid-range technical explanations
                    </p>
                  </div>
                </div>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label text-xs px-3 py-1 rounded-full border border-black font-bold">
                  CRITICAL
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-headline font-bold text-tertiary uppercase">
                    Progress
                  </span>
                  <span className="text-sm font-bold">
                    {shortEssayProgress.done}/{shortEssayProgress.total} Topics
                    Completed
                  </span>
                </div>
                <div className="h-4 w-full bg-surface-container border-2 border-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary border-r-2 border-black transition-all"
                    style={{ width: `${shortEssayProgress.pct}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end">
                <div className="flex items-center gap-2 font-headline font-bold text-sm group-hover:text-tertiary transition-colors">
                  {expandedCard === "short-essays"
                    ? "HIDE TOPICS"
                    : "START ARCHIVE"}{" "}
                  <span className="material-symbols-outlined text-sm">
                    {expandedCard === "short-essays"
                      ? "expand_less"
                      : "arrow_forward"}
                  </span>
                </div>
              </div>
            </button>
            {expandedCard === "short-essays" && (
              <div className="border-t-2 border-black px-6 pb-6 pt-4 space-y-6">
                <ArchiveTopicList
                  modules={shortEssayModules}
                  toggleTopic={toggleShortEssayTopic}
                  accentClass="bg-tertiary"
                  accentBorderClass="border-r border-black"
                />
              </div>
            )}
          </section>

          {/* ── SHORT NOTES ── */}
          <section
            data-ocid="pyq.short-notes.card"
            className="bg-surface-container-lowest border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <button
              type="button"
              onClick={() => toggleCard("short-notes")}
              className="w-full p-6 text-left group transition-all hover:-translate-y-1 hover:-translate-x-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-zinc-900 text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-3xl">
                      edit_note
                    </span>
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-bold uppercase tracking-wide">
                      SHORT NOTES
                    </h2>
                    <p className="text-sm text-secondary font-medium">
                      Quick definitions and diagrams
                    </p>
                  </div>
                </div>
                <span className="bg-secondary-fixed text-on-secondary-fixed font-label text-xs px-3 py-1 rounded-full border border-black font-bold">
                  FREQUENT
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-headline font-bold text-zinc-900 uppercase">
                    Progress
                  </span>
                  <span className="text-sm font-bold">
                    {shortNoteProgress.done}/{shortNoteProgress.total} Topics
                    Completed
                  </span>
                </div>
                <div className="h-4 w-full bg-surface-container border-2 border-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 border-r-2 border-black transition-all"
                    style={{ width: `${shortNoteProgress.pct}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end">
                <div className="flex items-center gap-2 font-headline font-bold text-sm group-hover:text-zinc-600 transition-colors">
                  {expandedCard === "short-notes"
                    ? "HIDE TOPICS"
                    : "START ARCHIVE"}{" "}
                  <span className="material-symbols-outlined text-sm">
                    {expandedCard === "short-notes"
                      ? "expand_less"
                      : "arrow_forward"}
                  </span>
                </div>
              </div>
            </button>
            {expandedCard === "short-notes" && (
              <div className="border-t-2 border-black px-6 pb-6 pt-4 space-y-6">
                <ArchiveTopicList
                  modules={shortNoteModules}
                  toggleTopic={toggleShortNoteTopic}
                  accentClass="bg-zinc-900"
                  accentBorderClass="border-r border-black"
                />
              </div>
            )}
          </section>
        </div>

        {/* Tip Box */}
        <div className="mt-12 mb-8 bg-primary/5 border-2 border-black border-dashed rounded-xl p-6 flex gap-4">
          <span className="material-symbols-outlined text-primary">
            lightbulb
          </span>
          <p className="text-sm font-medium italic">
            Pro Tip: Focusing on the &ldquo;ESSAYS&rdquo; archive covers 70% of
            the material required for &ldquo;SHORT ESSAYS&rdquo; as well.
            Prioritize long-form study for better integration.
          </p>
        </div>
      </main>
    </div>
  );
}
