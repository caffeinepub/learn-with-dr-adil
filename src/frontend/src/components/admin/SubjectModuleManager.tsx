import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AdminData, Module, Subject } from "@/hooks/useAdminData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = Pick<
  AdminData,
  | "subjects"
  | "modules"
  | "addSubject"
  | "updateSubject"
  | "deleteSubject"
  | "addModule"
  | "updateModule"
  | "deleteModule"
>;

const ACCENT_OPTIONS = [
  { label: "Red", value: "bg-red-100" },
  { label: "Blue", value: "bg-blue-100" },
  { label: "Teal", value: "bg-teal-100" },
  { label: "Amber", value: "bg-amber-100" },
];

const STATUS_OPTIONS: Array<Module["status"]> = ["Active", "Draft", "Archived"];

function statusStyle(status: Module["status"]) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-400";
    case "Draft":
      return "bg-yellow-100 text-yellow-800 border-yellow-400";
    case "Archived":
      return "bg-zinc-200 text-zinc-600 border-zinc-400";
    default:
      return "bg-zinc-100 text-zinc-600 border-zinc-400";
  }
}

// ─── Subject Modal ────────────────────────────────────────────────────────────
function SubjectModal({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Subject;
  onSave: (data: Omit<Subject, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [color, setColor] = useState(initial?.color ?? "bg-red-100");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      onSave({ name: name.trim(), icon: icon.trim() || "school", color });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-2 border-black rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline font-black text-xl">
            {initial ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Subject Name
            </Label>
            <Input
              data-ocid="subject_modal.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cardiology"
              className="border-2 border-black rounded-lg font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Material Icon Name
            </Label>
            <Input
              data-ocid="subject_modal.icon.input"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. favorite, psychology, nephrology"
              className="border-2 border-black rounded-lg font-body"
            />
            {icon && (
              <div className="flex items-center gap-2 pt-1">
                <span className="material-symbols-outlined text-primary">
                  {icon}
                </span>
                <span className="text-xs text-zinc-500 font-body">Preview</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Accent Color
            </Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger
                data-ocid="subject_modal.color.select"
                className="border-2 border-black rounded-lg"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCENT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border border-black ${opt.value}`}
                      />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button
            type="button"
            data-ocid="subject_modal.cancel_button"
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border-2 border-black rounded-full font-headline font-bold text-sm hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="subject_modal.save_button"
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="px-6 py-2 bg-primary text-white border-2 border-black rounded-full font-headline font-bold text-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}
            {initial ? "Save Changes" : "Add Subject"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Module Modal ─────────────────────────────────────────────────────────────
function ModuleModal({
  open,
  subjectId,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  subjectId: string;
  initial?: Module;
  onSave: (data: Omit<Module, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<Module["status"]>(
    initial?.status ?? "Active",
  );
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      onSave({
        subjectId,
        name: name.trim(),
        description: description.trim(),
        status,
        icon: icon.trim() || "book",
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-2 border-black rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline font-black text-xl">
            {initial ? "Edit Module" : "Add New Module"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Module Name
            </Label>
            <Input
              data-ocid="module_modal.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Valvular Heart Disease"
              className="border-2 border-black rounded-lg font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Description
            </Label>
            <Textarea
              data-ocid="module_modal.description.textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of what this module covers..."
              rows={3}
              className="border-2 border-black rounded-lg font-body resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Module["status"])}
            >
              <SelectTrigger
                data-ocid="module_modal.status.select"
                className="border-2 border-black rounded-lg"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Material Icon Name
            </Label>
            <Input
              data-ocid="module_modal.icon.input"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. book, science, biotech"
              className="border-2 border-black rounded-lg font-body"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button
            type="button"
            data-ocid="module_modal.cancel_button"
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border-2 border-black rounded-full font-headline font-bold text-sm hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="module_modal.save_button"
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="px-6 py-2 bg-primary text-white border-2 border-black rounded-full font-headline font-bold text-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}
            {initial ? "Save Changes" : "Add Module"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteConfirm({
  open,
  label,
  onConfirm,
  onClose,
}: {
  open: boolean;
  label: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="delete_confirm.dialog"
        className="border-2 border-black rounded-2xl max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="font-headline font-black text-xl">
            Delete Confirmation
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm font-body text-zinc-600 py-2">
          Are you sure you want to delete{" "}
          <span className="font-bold text-black">&ldquo;{label}&rdquo;</span>?
          This action cannot be undone.
        </p>
        <DialogFooter className="gap-2">
          <button
            type="button"
            data-ocid="delete_confirm.cancel_button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-black rounded-full font-headline font-bold text-sm hover:bg-zinc-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="delete_confirm.confirm_button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-red-600 text-white border-2 border-black rounded-full font-headline font-bold text-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SubjectModuleManager({
  subjects,
  modules,
  addSubject,
  updateSubject,
  deleteSubject,
  addModule,
  updateModule,
  deleteModule,
}: Props) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set(),
  );

  // Auto-expand newly added subjects so their modules are immediately visible
  useEffect(() => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      for (const s of subjects) next.add(s.id);
      return next;
    });
  }, [subjects]);

  // Subject modal state
  const [subjectModal, setSubjectModal] = useState<{
    open: boolean;
    editing?: Subject;
  }>({ open: false });

  // Module modal state
  const [moduleModal, setModuleModal] = useState<{
    open: boolean;
    subjectId: string;
    editing?: Module;
  }>({ open: false, subjectId: "" });

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    label: string;
    onConfirm: () => void;
  }>({ open: false, label: "", onConfirm: () => {} });

  function toggleExpand(id: string) {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmDelete(label: string, onConfirm: () => void) {
    setDeleteConfirm({ open: true, label, onConfirm });
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <span className="text-primary font-headline font-bold text-xs tracking-widest uppercase block mb-1">
            Content Management
          </span>
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-black">
            Subject & Module Manager
          </h2>
          <p className="text-secondary mt-1 font-medium text-sm max-w-lg">
            Add, rename or delete subjects and manage their sub-modules with
            status, descriptions, and icons.
          </p>
        </div>
        <button
          type="button"
          data-ocid="subject_manager.add_subject.primary_button"
          onClick={() => setSubjectModal({ open: true })}
          className="bg-primary text-white px-6 py-3 rounded-full border-2 border-black font-headline font-bold flex items-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Subject
        </button>
      </div>

      {/* Empty state */}
      {subjects.length === 0 && (
        <div
          data-ocid="subject_manager.subjects.empty_state"
          className="border-4 border-dashed border-zinc-200 rounded-2xl p-16 flex flex-col items-center justify-center gap-4"
        >
          <span className="material-symbols-outlined text-4xl text-zinc-400">
            folder_open
          </span>
          <p className="font-headline font-bold text-zinc-500">
            No subjects yet. Add your first subject above.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {subjects.map((subject, si) => {
          const subjectModules = modules.filter(
            (m) => m.subjectId === subject.id,
          );
          const isExpanded = expandedSubjects.has(subject.id);

          return (
            <div
              key={subject.id}
              data-ocid={`subject_manager.subject.item.${si + 1}`}
              className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              {/* Subject header */}
              <div className="p-5 flex items-center justify-between bg-[#f3f3f4] border-b-2 border-black gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl border-2 border-black flex items-center justify-center ${
                      subject.color || "bg-red-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary">
                      {subject.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline font-extrabold text-lg truncate">
                      {subject.name}
                    </h3>
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                      {subjectModules.length} Module
                      {subjectModules.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    data-ocid={`subject_manager.subject.edit_button.${si + 1}`}
                    onClick={() =>
                      setSubjectModal({ open: true, editing: subject })
                    }
                    className="p-2 rounded-lg border-2 border-transparent hover:bg-white hover:border-black transition-all"
                    title="Edit subject"
                    aria-label={`Edit ${subject.name}`}
                  >
                    <span className="material-symbols-outlined text-secondary text-sm">
                      edit
                    </span>
                  </button>
                  <button
                    type="button"
                    data-ocid={`subject_manager.subject.delete_button.${si + 1}`}
                    onClick={() =>
                      confirmDelete(subject.name, () => {
                        deleteSubject(subject.id);
                        toast.success(`Subject "${subject.name}" deleted.`);
                      })
                    }
                    className="p-2 rounded-lg border-2 border-transparent hover:bg-red-50 hover:text-red-600 hover:border-black transition-all"
                    title="Delete subject"
                    aria-label={`Delete ${subject.name}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                  </button>
                  <button
                    type="button"
                    data-ocid={`subject_manager.subject.toggle.${si + 1}`}
                    onClick={() => toggleExpand(subject.id)}
                    className="p-2 rounded-lg border-2 border-black bg-white hover:bg-zinc-50 transition-all"
                    title={isExpanded ? "Collapse" : "Expand"}
                    aria-label={
                      isExpanded
                        ? `Collapse ${subject.name}`
                        : `Expand ${subject.name}`
                    }
                  >
                    <span
                      className="material-symbols-outlined text-sm transition-transform duration-200"
                      style={{
                        display: "block",
                        transform: isExpanded ? "rotate(180deg)" : "none",
                      }}
                    >
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Sub-modules */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {subjectModules.length === 0 && (
                    <p className="text-center text-zinc-400 font-body text-sm py-4">
                      No modules yet for this subject.
                    </p>
                  )}
                  {subjectModules.map((mod, mi) => (
                    <div
                      key={mod.id}
                      data-ocid={`subject_manager.module.item.${mi + 1}`}
                      className="flex items-start gap-3 p-4 bg-white border-2 border-black rounded-xl group hover:border-primary transition-colors"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-lg border-2 border-black bg-[#f3f3f4] flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">
                          {mod.icon ?? "book"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-headline font-bold text-sm">
                            {mod.name}
                          </h4>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 border rounded-full uppercase tracking-wider ${statusStyle(mod.status)}`}
                          >
                            {mod.status}
                          </span>
                        </div>
                        {mod.description && (
                          <p className="text-xs text-zinc-500 font-body mt-1 line-clamp-2">
                            {mod.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          data-ocid={`subject_manager.module.edit_button.${mi + 1}`}
                          onClick={() =>
                            setModuleModal({
                              open: true,
                              subjectId: subject.id,
                              editing: mod,
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-primary transition-colors"
                          title="Edit module"
                          aria-label={`Edit ${mod.name}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          data-ocid={`subject_manager.module.delete_button.${mi + 1}`}
                          onClick={() =>
                            confirmDelete(mod.name, () => {
                              deleteModule(mod.id);
                              toast.success(`Module "${mod.name}" deleted.`);
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete module"
                          aria-label={`Delete ${mod.name}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add module button */}
                  <button
                    type="button"
                    data-ocid={`subject_manager.add_module.button.${si + 1}`}
                    onClick={() =>
                      setModuleModal({
                        open: true,
                        subjectId: subject.id,
                      })
                    }
                    className="w-full p-3 border-2 border-dashed border-zinc-400 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:border-black hover:text-black hover:bg-zinc-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add_circle
                    </span>
                    <span className="font-headline font-bold text-xs">
                      Add Sub-module
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subject Modal */}
      {subjectModal.open && (
        <SubjectModal
          key={subjectModal.editing?.id ?? "new-subject"}
          open={subjectModal.open}
          initial={subjectModal.editing}
          onSave={(data) => {
            if (subjectModal.editing) {
              updateSubject(subjectModal.editing.id, data);
              toast.success(
                `Subject "${data.name}" updated — live on student pages.`,
              );
            } else {
              addSubject(data);
              toast.success(
                `Subject "${data.name}" added — now visible on Modules page.`,
              );
            }
          }}
          onClose={() => setSubjectModal({ open: false })}
        />
      )}

      {/* Module Modal */}
      {moduleModal.open && (
        <ModuleModal
          key={moduleModal.editing?.id ?? `new-module-${moduleModal.subjectId}`}
          open={moduleModal.open}
          subjectId={moduleModal.subjectId}
          initial={moduleModal.editing}
          onSave={(data) => {
            if (moduleModal.editing) {
              updateModule(moduleModal.editing.id, data);
              toast.success(
                `Module "${data.name}" updated — live on student pages.`,
              );
            } else {
              addModule(data);
              toast.success(
                `Module "${data.name}" added — now visible on Modules page.`,
              );
            }
          }}
          onClose={() => setModuleModal({ open: false, subjectId: "" })}
        />
      )}

      {/* Delete Confirm */}
      <DeleteConfirm
        open={deleteConfirm.open}
        label={deleteConfirm.label}
        onConfirm={deleteConfirm.onConfirm}
        onClose={() =>
          setDeleteConfirm({ open: false, label: "", onConfirm: () => {} })
        }
      />
    </div>
  );
}
