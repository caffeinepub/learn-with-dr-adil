import type { LocalEssayModule as EssayModule } from "@/hooks/useAdminData";
import { useState } from "react";
import { toast } from "sonner";

interface EssayManagerProps {
  title?: string;
  description?: string;
  icon?: string;
  moduleType?: string;
  essayModules: EssayModule[];
  addEssayModule: (name: string) => void;
  deleteEssayModule: (id: string) => void;
  addEssayTopic: (moduleId: string, title: string) => void;
  deleteEssayTopic: (moduleId: string, topicId: string) => void;
  toggleEssayTopic: (moduleId: string, topicId: string) => void;
  updateEssayTopicTitle: (
    moduleId: string,
    topicId: string,
    newTitle: string,
    moduleType: string,
  ) => void;
  reorderEssayTopics: (
    moduleId: string,
    topicIds: string[],
    moduleType: string,
  ) => void;
}

export default function EssayManager({
  title = "Essay Manager",
  description = "Organize essay topics by module. Add new modules as columns and tick topics when completed.",
  icon = "edit_note",
  moduleType = "essay",
  essayModules,
  addEssayModule,
  deleteEssayModule,
  addEssayTopic,
  deleteEssayTopic,
  toggleEssayTopic,
  updateEssayTopicTitle,
  reorderEssayTopics,
}: EssayManagerProps) {
  const [newModuleName, setNewModuleName] = useState("");
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>(
    {},
  );
  const [confirmDeleteModule, setConfirmDeleteModule] = useState<string | null>(
    null,
  );
  const [addingModule, setAddingModule] = useState(false);
  const [addingTopics, setAddingTopics] = useState<Record<string, boolean>>({});

  // Edit state: topicId → draft title
  const [editingTopic, setEditingTopic] = useState<{
    moduleId: string;
    topicId: string;
    draft: string;
  } | null>(null);

  function handleAddModule() {
    const name = newModuleName.trim();
    if (!name) return;
    setAddingModule(true);
    try {
      addEssayModule(name);
      setNewModuleName("");
      toast.success(`Module "${name}" added — live on PYQ page.`);
    } finally {
      setAddingModule(false);
    }
  }

  function handleAddTopic(moduleId: string) {
    const topicTitle = (newTopicInputs[moduleId] ?? "").trim();
    if (!topicTitle) return;
    setAddingTopics((prev) => ({ ...prev, [moduleId]: true }));
    try {
      addEssayTopic(moduleId, topicTitle);
      setNewTopicInputs((prev) => ({ ...prev, [moduleId]: "" }));
      toast.success(`Topic "${topicTitle}" added.`);
    } finally {
      setAddingTopics((prev) => ({ ...prev, [moduleId]: false }));
    }
  }

  function handleMoveUp(mod: EssayModule, topicIdx: number) {
    if (topicIdx === 0) return;
    const ids = mod.topics.map((t) => t.id);
    const newIds = [...ids];
    [newIds[topicIdx - 1], newIds[topicIdx]] = [
      newIds[topicIdx],
      newIds[topicIdx - 1],
    ];
    reorderEssayTopics(mod.id, newIds, moduleType);
  }

  function handleMoveDown(mod: EssayModule, topicIdx: number) {
    if (topicIdx === mod.topics.length - 1) return;
    const ids = mod.topics.map((t) => t.id);
    const newIds = [...ids];
    [newIds[topicIdx], newIds[topicIdx + 1]] = [
      newIds[topicIdx + 1],
      newIds[topicIdx],
    ];
    reorderEssayTopics(mod.id, newIds, moduleType);
  }

  function handleSaveTopicEdit() {
    if (!editingTopic) return;
    const newTitle = editingTopic.draft.trim();
    if (!newTitle) return;
    updateEssayTopicTitle(
      editingTopic.moduleId,
      editingTopic.topicId,
      newTitle,
      moduleType,
    );
    toast.success("Topic title updated.");
    setEditingTopic(null);
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
            data-ocid="essay_manager.new_module.input"
            type="text"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            placeholder="New module name…"
            className="border-2 border-black rounded-lg px-4 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0_0_rgba(0,0,0,1)] w-52"
          />
          <button
            type="button"
            data-ocid="essay_manager.add_module.button"
            onClick={handleAddModule}
            disabled={!newModuleName.trim() || addingModule}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-full border-2 border-black font-headline font-bold text-sm flex items-center gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {addingModule ? (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            ) : (
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'wght' 700" }}
              >
                add
              </span>
            )}
            Add Module
          </button>
        </div>
      </div>

      {/* Empty state */}
      {essayModules.length === 0 && (
        <div
          data-ocid="essay_manager.empty_state"
          className="border-4 border-dashed border-zinc-200 rounded-2xl p-16 flex flex-col items-center justify-center gap-4"
        >
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
              Add a module above to get started (e.g. "Cardiology")
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
                data-ocid={`essay_manager.module.card.${mod.id}`}
                className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                {/* Module header */}
                <div className="bg-[#f3f3f4] border-b-2 border-black p-4 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-extrabold text-base truncate">
                      {mod.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-[#ebebeb] border border-black rounded-full overflow-hidden">
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
                    data-ocid={`essay_manager.module.delete_button.${mod.id}`}
                    onClick={() =>
                      confirmDeleteModule === mod.id
                        ? (() => {
                            deleteEssayModule(mod.id);
                            toast.success(`Module "${mod.name}" deleted.`);
                            setConfirmDeleteModule(null);
                          })()
                        : setConfirmDeleteModule(mod.id)
                    }
                    onBlur={() => setConfirmDeleteModule(null)}
                    className="p-1.5 rounded-lg border-2 border-transparent hover:bg-red-50 hover:border-black hover:text-red-600 transition-all shrink-0"
                    aria-label={
                      confirmDeleteModule === mod.id
                        ? "Click again to confirm delete"
                        : `Delete ${mod.name}`
                    }
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
                  {mod.topics.map((topic, idx) => {
                    const isEditing =
                      editingTopic?.moduleId === mod.id &&
                      editingTopic?.topicId === topic.id;

                    return (
                      <li
                        key={topic.id}
                        className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#f3f3f4] transition-colors group"
                      >
                        {/* Reorder up/down buttons */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(mod, idx)}
                            disabled={idx === 0}
                            className="p-0.5 rounded border border-transparent hover:border-black hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            aria-label="Move topic up"
                            title="Move up"
                          >
                            <span
                              className="material-symbols-outlined text-xs leading-none"
                              style={{ fontSize: "14px" }}
                            >
                              keyboard_arrow_up
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(mod, idx)}
                            disabled={idx === mod.topics.length - 1}
                            className="p-0.5 rounded border border-transparent hover:border-black hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            aria-label="Move topic down"
                            title="Move down"
                          >
                            <span
                              className="material-symbols-outlined text-xs leading-none"
                              style={{ fontSize: "14px" }}
                            >
                              keyboard_arrow_down
                            </span>
                          </button>
                        </div>

                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleEssayTopic(mod.id, topic.id)}
                          className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                            topic.done
                              ? "bg-primary border-primary"
                              : "bg-white hover:bg-[#f3f3f4]"
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

                        {/* Topic title / inline edit */}
                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-1.5 min-w-0">
                            <input
                              data-ocid={`essay_manager.edit_topic.input.${topic.id}`}
                              type="text"
                              value={editingTopic.draft}
                              onChange={(e) =>
                                setEditingTopic((prev) =>
                                  prev
                                    ? { ...prev, draft: e.target.value }
                                    : prev,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveTopicEdit();
                                if (e.key === "Escape") setEditingTopic(null);
                              }}
                              ref={(el) => {
                                if (el) el.focus();
                              }}
                              className="flex-1 min-w-0 border-2 border-black rounded-md px-2 py-0.5 text-xs font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                              type="button"
                              data-ocid={`essay_manager.save_topic_edit.button.${topic.id}`}
                              onClick={handleSaveTopicEdit}
                              disabled={!editingTopic.draft.trim()}
                              className="bg-primary text-white rounded-md border-2 border-black px-2 py-0.5 text-xs font-headline font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-container transition-colors shadow-[1px_1px_0_0_rgba(0,0,0,1)] active:shadow-none shrink-0"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTopic(null)}
                              className="p-0.5 rounded hover:text-red-600 transition-colors shrink-0"
                              aria-label="Cancel edit"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`flex-1 text-sm font-medium font-body transition-all min-w-0 break-words ${
                                topic.done
                                  ? "line-through text-zinc-400"
                                  : "text-on-surface"
                              }`}
                            >
                              {topic.title}
                            </span>

                            {/* Edit topic button */}
                            <button
                              type="button"
                              data-ocid={`essay_manager.edit_topic.button.${topic.id}`}
                              onClick={() =>
                                setEditingTopic({
                                  moduleId: mod.id,
                                  topicId: topic.id,
                                  draft: topic.title,
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-primary transition-all shrink-0"
                              aria-label={`Edit topic ${topic.title}`}
                              title="Edit topic name"
                            >
                              <span className="material-symbols-outlined text-sm">
                                edit
                              </span>
                            </button>

                            {/* Delete topic */}
                            <button
                              type="button"
                              onClick={() => deleteEssayTopic(mod.id, topic.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-600 transition-all shrink-0"
                              aria-label={`Delete topic ${topic.title}`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Add topic input */}
                <div className="border-t-2 border-dashed border-zinc-300 p-3 flex items-center gap-2">
                  <input
                    data-ocid={`essay_manager.add_topic.input.${mod.id}`}
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
                    data-ocid={`essay_manager.add_topic.button.${mod.id}`}
                    onClick={() => handleAddTopic(mod.id)}
                    disabled={
                      !(newTopicInputs[mod.id] ?? "").trim() ||
                      addingTopics[mod.id]
                    }
                    className="bg-primary text-white rounded-lg border-2 border-black p-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-container transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                    aria-label="Add topic"
                  >
                    {addingTopics[mod.id] ? (
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>
                    )}
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
