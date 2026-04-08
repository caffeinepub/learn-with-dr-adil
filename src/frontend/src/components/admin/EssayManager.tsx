import type { EssayModule } from "@/hooks/useAdminData";
import { useState } from "react";
import { toast } from "sonner";

interface EssayManagerProps {
  title?: string;
  description?: string;
  icon?: string;
  essayModules: EssayModule[];
  addEssayModule: (name: string) => void;
  deleteEssayModule: (id: string) => void;
  addEssayTopic: (moduleId: string, title: string) => void;
  deleteEssayTopic: (moduleId: string, topicId: string) => void;
  toggleEssayTopic: (moduleId: string, topicId: string) => void;
}

export default function EssayManager({
  title = "Essay Manager",
  description = "Organize essay topics by module. Add new modules as columns and tick topics when completed.",
  icon = "edit_note",
  essayModules,
  addEssayModule,
  deleteEssayModule,
  addEssayTopic,
  deleteEssayTopic,
  toggleEssayTopic,
}: EssayManagerProps) {
  const [newModuleName, setNewModuleName] = useState("");
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>(
    {},
  );
  const [confirmDeleteModule, setConfirmDeleteModule] = useState<string | null>(
    null,
  );

  function handleAddModule() {
    const name = newModuleName.trim();
    if (!name) return;
    addEssayModule(name);
    setNewModuleName("");
    toast.success(`Module "${name}" added — live on PYQ page.`);
  }

  function handleAddTopic(moduleId: string) {
    const topicTitle = (newTopicInputs[moduleId] ?? "").trim();
    if (!topicTitle) return;
    addEssayTopic(moduleId, topicTitle);
    setNewTopicInputs((prev) => ({ ...prev, [moduleId]: "" }));
    toast.success(`Topic "${topicTitle}" added.`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase mb-2 block">
            Content Manager
          </span>
          <h2 className="text-4xl font-headline font-extrabold tracking-tight text-black">
            {title}
          </h2>
          <p className="text-secondary max-w-md mt-2 font-medium">
            {description}
          </p>
        </div>

        {/* Add new module form */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            placeholder="New module name…"
            className="border-2 border-black rounded-lg px-4 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0_0_rgba(0,0,0,1)] w-52"
          />
          <button
            type="button"
            onClick={handleAddModule}
            disabled={!newModuleName.trim()}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-full border-2 border-black font-headline font-bold text-sm flex items-center gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              add
            </span>
            Add Module
          </button>
        </div>
      </div>

      {/* Empty state */}
      {essayModules.length === 0 && (
        <div className="border-4 border-dashed border-zinc-200 rounded-2xl p-16 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-3xl text-secondary">
              {icon}
            </span>
          </div>
          <div className="text-center">
            <h4 className="font-headline font-extrabold text-xl">
              No Modules Yet
            </h4>
            <p className="text-zinc-500 font-medium mt-1">
              Add a module above to get started (e.g. “Cardiology”)
            </p>
          </div>
        </div>
      )}

      {/* Module columns */}
      {essayModules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {essayModules.map((mod) => {
            const completed = mod.topics.filter((t) => t.done).length;
            const total = mod.topics.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={mod.id}
                className="bg-surface-container-lowest border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                {/* Module header */}
                <div className="bg-surface-container-low border-b-2 border-black p-4 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-extrabold text-base truncate">
                      {mod.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-surface-container border border-black rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary border-r border-black transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black font-headline text-secondary whitespace-nowrap">
                        {completed}/{total}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      confirmDeleteModule === mod.id
                        ? (() => {
                            deleteEssayModule(mod.id);
                            toast.success(`Module "${mod.name}" deleted.`);
                          })()
                        : setConfirmDeleteModule(mod.id)
                    }
                    onBlur={() => setConfirmDeleteModule(null)}
                    className="p-1.5 rounded-lg border-2 border-transparent hover:bg-error-container hover:border-black hover:text-error transition-all shrink-0"
                    title={
                      confirmDeleteModule === mod.id
                        ? "Click again to confirm delete"
                        : "Delete module"
                    }
                  >
                    <span className="material-symbols-outlined text-sm">
                      {confirmDeleteModule === mod.id ? "warning" : "delete"}
                    </span>
                  </button>
                </div>

                {/* Topics list */}
                <ul className="divide-y divide-zinc-100">
                  {mod.topics.length === 0 && (
                    <li className="px-4 py-5 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      No topics yet
                    </li>
                  )}
                  {mod.topics.map((topic) => (
                    <li
                      key={topic.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors group"
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleEssayTopic(mod.id, topic.id)}
                        className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                          topic.done
                            ? "bg-primary border-primary"
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

                      {/* Topic title */}
                      <span
                        className={`flex-1 text-sm font-medium font-body transition-all ${
                          topic.done
                            ? "line-through text-zinc-400"
                            : "text-on-surface"
                        }`}
                      >
                        {topic.title}
                      </span>

                      {/* Delete topic */}
                      <button
                        type="button"
                        onClick={() => deleteEssayTopic(mod.id, topic.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-error transition-all"
                        aria-label="Delete topic"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Add topic input */}
                <div className="border-t-2 border-dashed border-zinc-300 p-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={newTopicInputs[mod.id] ?? ""}
                    onChange={(e) =>
                      setNewTopicInputs((prev) => ({
                        ...prev,
                        [mod.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddTopic(mod.id)
                    }
                    placeholder="Add topic…"
                    className="flex-1 min-w-0 border-2 border-black rounded-lg px-3 py-1.5 text-xs font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTopic(mod.id)}
                    disabled={!(newTopicInputs[mod.id] ?? "").trim()}
                    className="bg-primary text-white rounded-lg border-2 border-black p-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-container transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                    aria-label="Add topic"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
