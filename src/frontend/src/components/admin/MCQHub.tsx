import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AdminData, MCQ } from "@/hooks/useAdminData";
import { useState } from "react";
import { toast } from "sonner";

type Props = Pick<
  AdminData,
  "subjects" | "modules" | "mcqs" | "addMCQ" | "updateMCQ" | "deleteMCQ"
>;

type AnswerLetter = "A" | "B" | "C" | "D";

const ANSWER_OPTIONS: AnswerLetter[] = ["A", "B", "C", "D"];

const ANSWER_COLORS: Record<AnswerLetter, string> = {
  A: "bg-blue-100 text-blue-800 border-blue-400",
  B: "bg-green-100 text-green-800 border-green-400",
  C: "bg-amber-100 text-amber-800 border-amber-400",
  D: "bg-purple-100 text-purple-800 border-purple-400",
};

function getAnswerColor(answer: string): string {
  return (
    ANSWER_COLORS[answer as AnswerLetter] ??
    "bg-zinc-100 text-zinc-700 border-zinc-400"
  );
}

// ─── MCQ Form Modal ───────────────────────────────────────────────────────────
function MCQModal({
  open,
  initial,
  subjects,
  modules,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: MCQ;
  subjects: Props["subjects"];
  modules: Props["modules"];
  onSave: (data: Omit<MCQ, "id">) => void;
  onClose: () => void;
}) {
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "");
  const [moduleId, setModuleId] = useState(initial?.moduleId ?? "");
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [optionA, setOptionA] = useState(initial?.optionA ?? "");
  const [optionB, setOptionB] = useState(initial?.optionB ?? "");
  const [optionC, setOptionC] = useState(initial?.optionC ?? "");
  const [optionD, setOptionD] = useState(initial?.optionD ?? "");
  const [correctAnswer, setCorrectAnswer] = useState<string>(
    initial?.correctAnswer ?? "A",
  );
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredModules = modules.filter((m) => m.subjectId === subjectId);

  function handleSubjectChange(val: string) {
    setSubjectId(val);
    setModuleId("");
    setValidationError("");
  }

  function handleSave() {
    if (!subjectId) {
      setValidationError("Please select a subject.");
      return;
    }
    if (!moduleId) {
      setValidationError("Please select a module.");
      return;
    }
    if (!question.trim()) {
      setValidationError("Please enter the question text.");
      return;
    }
    if (
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim()
    ) {
      setValidationError("Please fill in all four answer options.");
      return;
    }
    setValidationError("");
    setSaving(true);
    try {
      onSave({
        subjectId,
        moduleId,
        question: question.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctAnswer,
        explanation: explanation.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-2 border-black rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline font-black text-xl">
            {initial ? "Edit MCQ" : "Add New MCQ"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {/* Subject + Module selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-headline font-bold uppercase tracking-widest text-xs">
                Subject
              </Label>
              <Select value={subjectId} onValueChange={handleSubjectChange}>
                <SelectTrigger
                  data-ocid="mcq_modal.subject.select"
                  className="border-2 border-black rounded-lg"
                >
                  <SelectValue placeholder="Select subject..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-headline font-bold uppercase tracking-widest text-xs">
                Module
              </Label>
              <Select
                value={moduleId}
                onValueChange={(v) => {
                  setModuleId(v);
                  setValidationError("");
                }}
                disabled={!subjectId}
              >
                <SelectTrigger
                  data-ocid="mcq_modal.module.select"
                  className="border-2 border-black rounded-lg"
                >
                  <SelectValue
                    placeholder={
                      subjectId ? "Select module..." : "Select subject first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredModules.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-zinc-400 font-body">
                      No modules for this subject
                    </div>
                  ) : (
                    filteredModules.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Question
            </Label>
            <Textarea
              data-ocid="mcq_modal.question.textarea"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setValidationError("");
              }}
              placeholder="Enter the clinical scenario or question stem..."
              rows={3}
              className="border-2 border-black rounded-lg font-body resize-none"
            />
          </div>

          {/* Answer options */}
          <div className="space-y-2">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Answer Options
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["A", "B", "C", "D"] as const).map((letter) => {
                const val =
                  letter === "A"
                    ? optionA
                    : letter === "B"
                      ? optionB
                      : letter === "C"
                        ? optionC
                        : optionD;
                const setter =
                  letter === "A"
                    ? setOptionA
                    : letter === "B"
                      ? setOptionB
                      : letter === "C"
                        ? setOptionC
                        : setOptionD;
                return (
                  <div key={letter} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 shrink-0 rounded-lg border-2 border-black flex items-center justify-center font-headline font-black text-xs ${ANSWER_COLORS[letter]}`}
                    >
                      {letter}
                    </span>
                    <Input
                      data-ocid={`mcq_modal.option_${letter.toLowerCase()}.input`}
                      value={val}
                      onChange={(e) => {
                        setter(e.target.value);
                        setValidationError("");
                      }}
                      placeholder={`Option ${letter}...`}
                      className="border-2 border-black rounded-lg font-body flex-1"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Correct answer */}
          <div className="space-y-2">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Correct Answer
            </Label>
            <RadioGroup
              value={correctAnswer}
              onValueChange={setCorrectAnswer}
              className="flex gap-4"
            >
              {ANSWER_OPTIONS.map((opt) => (
                <div key={opt} className="flex items-center gap-1.5">
                  <RadioGroupItem
                    data-ocid="mcq_modal.correct_answer.radio"
                    value={opt}
                    id={`ans-${opt}`}
                    className="border-2 border-black"
                  />
                  <Label
                    htmlFor={`ans-${opt}`}
                    className="font-headline font-black cursor-pointer"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <Label className="font-headline font-bold uppercase tracking-widest text-xs">
              Explanation
            </Label>
            <Textarea
              data-ocid="mcq_modal.explanation.textarea"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why the correct answer is right..."
              rows={2}
              className="border-2 border-black rounded-lg font-body resize-none"
            />
          </div>

          {/* Validation error */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-400 rounded-lg">
              <span className="material-symbols-outlined text-red-600 text-sm">
                error
              </span>
              <p className="text-sm font-bold text-red-600 font-body">
                {validationError}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <button
            type="button"
            data-ocid="mcq_modal.cancel_button"
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border-2 border-black rounded-full font-headline font-bold text-sm hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="mcq_modal.save_button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-primary text-white border-2 border-black rounded-full font-headline font-bold text-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}
            {initial ? "Save Changes" : "Add MCQ"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="mcq_delete.dialog"
        className="border-2 border-black rounded-2xl max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="font-headline font-black text-xl">
            Delete MCQ
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm font-body text-zinc-600 py-2">
          Are you sure you want to delete this question? This action cannot be
          undone.
        </p>
        <DialogFooter className="gap-2">
          <button
            type="button"
            data-ocid="mcq_delete.cancel_button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-black rounded-full font-headline font-bold text-sm hover:bg-zinc-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="mcq_delete.confirm_button"
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

// ─── MCQ Card ─────────────────────────────────────────────────────────────────
function MCQCard({
  mcq,
  subjectName,
  moduleName,
  index,
  onEdit,
  onDelete,
}: {
  mcq: MCQ;
  subjectName: string;
  moduleName: string;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-ocid={`mcq_hub.mcq.item.${index}`}
      className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Index badge */}
        <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#f3f3f4] border-2 border-black rounded-lg font-headline font-black text-xs">
          {String(index).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          {/* Question text */}
          <p
            className={`font-body text-sm font-medium text-black ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {mcq.question}
          </p>

          {/* Subject + Module badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] font-black px-2 py-0.5 bg-red-50 text-primary border border-primary rounded-full uppercase tracking-wider">
              {subjectName}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-400 rounded-full uppercase tracking-wider">
              {moduleName}
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 border rounded-full uppercase tracking-wider ${getAnswerColor(mcq.correctAnswer)}`}
            >
              Ans: {mcq.correctAnswer}
            </span>
          </div>

          {/* Expanded content */}
          {expanded && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(["A", "B", "C", "D"] as const).map((letter) => {
                  const optVal =
                    letter === "A"
                      ? mcq.optionA
                      : letter === "B"
                        ? mcq.optionB
                        : letter === "C"
                          ? mcq.optionC
                          : mcq.optionD;
                  const isCorrect = mcq.correctAnswer === letter;
                  return (
                    <div
                      key={letter}
                      className={`flex items-start gap-2 p-2 rounded-lg border-2 ${
                        isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-zinc-200 bg-zinc-50"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 shrink-0 rounded border-2 border-black flex items-center justify-center font-headline font-black text-[10px] ${ANSWER_COLORS[letter]}`}
                      >
                        {letter}
                      </span>
                      <span className="text-xs font-body">{optVal}</span>
                      {isCorrect && (
                        <span className="material-symbols-outlined text-green-600 text-sm ml-auto shrink-0">
                          check_circle
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {mcq.explanation && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-lg">
                  <p className="text-xs font-headline font-bold text-amber-800 uppercase tracking-wider mb-1">
                    Explanation
                  </p>
                  <p className="text-xs font-body text-amber-900">
                    {mcq.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            data-ocid={`mcq_hub.mcq.toggle.${index}`}
            onClick={() => setExpanded((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            title={expanded ? "Collapse" : "Expand"}
            aria-label={expanded ? "Collapse question" : "Expand question"}
          >
            <span
              className="material-symbols-outlined text-sm transition-transform duration-200"
              style={{
                display: "block",
                transform: expanded ? "rotate(180deg)" : "none",
              }}
            >
              expand_more
            </span>
          </button>
          <button
            type="button"
            data-ocid={`mcq_hub.mcq.edit_button.${index}`}
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-primary transition-colors"
            title="Edit"
            aria-label="Edit MCQ"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            type="button"
            data-ocid={`mcq_hub.mcq.delete_button.${index}`}
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete"
            aria-label="Delete MCQ"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main MCQ Hub ─────────────────────────────────────────────────────────────
export default function MCQHub({
  subjects,
  modules,
  mcqs,
  addMCQ,
  updateMCQ,
  deleteMCQ,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("all");
  const [filterModuleId, setFilterModuleId] = useState("all");

  const [mcqModal, setMcqModal] = useState<{ open: boolean; editing?: MCQ }>({
    open: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  const filteredModulesForDropdown = modules.filter(
    (m) => filterSubjectId === "all" || m.subjectId === filterSubjectId,
  );

  function handleFilterSubjectChange(val: string) {
    setFilterSubjectId(val);
    setFilterModuleId("all");
  }

  const filteredMCQs = mcqs.filter((q) => {
    if (filterSubjectId !== "all" && q.subjectId !== filterSubjectId)
      return false;
    if (filterModuleId !== "all" && q.moduleId !== filterModuleId) return false;
    if (
      searchQuery.trim() &&
      !q.question.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  function getSubjectName(id: string) {
    return subjects.find((s) => s.id === id)?.name ?? "Unknown";
  }
  function getModuleName(id: string) {
    return modules.find((m) => m.id === id)?.name ?? "Unknown";
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <span className="text-primary font-headline font-bold text-xs tracking-widest uppercase block mb-1">
            Question Bank
          </span>
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-black">
            MCQ Management Hub
          </h2>
          <p className="text-secondary mt-1 font-medium text-sm max-w-lg">
            Add, edit, and delete MCQs with advanced filtering by subject and
            module.
          </p>
        </div>
        <button
          type="button"
          data-ocid="mcq_hub.add_mcq.primary_button"
          onClick={() => setMcqModal({ open: true })}
          className="bg-primary text-white px-6 py-3 rounded-full border-2 border-black font-headline font-bold flex items-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New MCQ
        </button>
      </div>

      {/* Filter bar */}
      <div
        data-ocid="mcq_hub.filter.panel"
        className="bg-[#f3f3f4] border-2 border-black rounded-xl p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
              search
            </span>
            <input
              data-ocid="mcq_hub.search.search_input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-3 py-2 border-2 border-black rounded-lg font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Subject filter */}
          <Select
            value={filterSubjectId}
            onValueChange={handleFilterSubjectChange}
          >
            <SelectTrigger
              data-ocid="mcq_hub.subject_filter.select"
              className="border-2 border-black rounded-lg bg-white"
            >
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Module filter */}
          <Select
            value={filterModuleId}
            onValueChange={setFilterModuleId}
            disabled={filterSubjectId === "all" && modules.length === 0}
          >
            <SelectTrigger
              data-ocid="mcq_hub.module_filter.select"
              className="border-2 border-black rounded-lg bg-white"
            >
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {filteredModulesForDropdown.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Result count */}
        <div className="mt-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary text-white border-2 border-black flex items-center justify-center font-headline font-black text-xs">
            {filteredMCQs.length}
          </span>
          <span className="text-xs font-headline font-bold text-secondary uppercase tracking-wider">
            Question{filteredMCQs.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* MCQ list */}
      {filteredMCQs.length === 0 ? (
        <div
          data-ocid="mcq_hub.mcqs.empty_state"
          className="border-4 border-dashed border-zinc-200 rounded-2xl p-16 flex flex-col items-center justify-center gap-4"
        >
          <span className="material-symbols-outlined text-4xl text-zinc-400">
            quiz
          </span>
          <p className="font-headline font-bold text-zinc-500">
            {searchQuery ||
            filterSubjectId !== "all" ||
            filterModuleId !== "all"
              ? "No questions match your filters."
              : "No questions yet. Add your first MCQ above."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMCQs.map((mcq, i) => (
            <MCQCard
              key={mcq.id}
              mcq={mcq}
              subjectName={getSubjectName(mcq.subjectId)}
              moduleName={getModuleName(mcq.moduleId)}
              index={i + 1}
              onEdit={() => setMcqModal({ open: true, editing: mcq })}
              onDelete={() => setDeleteConfirm({ open: true, id: mcq.id })}
            />
          ))}
        </div>
      )}

      {/* MCQ Modal */}
      {mcqModal.open && (
        <MCQModal
          key={mcqModal.editing?.id ?? "new-mcq"}
          open={mcqModal.open}
          initial={mcqModal.editing}
          subjects={subjects}
          modules={modules}
          onSave={(data) => {
            if (mcqModal.editing) {
              updateMCQ(mcqModal.editing.id, data);
              toast.success("MCQ updated — live in student quiz.");
            } else {
              addMCQ(data);
              toast.success("MCQ added — live in student quiz.");
            }
          }}
          onClose={() => setMcqModal({ open: false })}
        />
      )}

      {/* Delete Confirm */}
      <DeleteConfirm
        open={deleteConfirm.open}
        onConfirm={() => {
          deleteMCQ(deleteConfirm.id);
          toast.success("MCQ deleted.");
        }}
        onClose={() => setDeleteConfirm({ open: false, id: "" })}
      />
    </div>
  );
}
