import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddModule,
  useAddQuestion,
  useDeleteQuestion,
  useGetModules,
  useGetQuestions,
} from "../hooks/useQueries";

type AdminTab = "add-question" | "add-module" | "manage";

export default function AdminPage() {
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("add-question");

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      <div className="mt-8 mb-8">
        <h2 className="font-headline text-4xl font-extrabold">Admin Panel</h2>
        <p className="text-[#5e5e5e] mt-1">
          Manage questions, modules, and content.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(
          [
            {
              id: "add-question" as AdminTab,
              label: "Add Question",
              icon: "add_circle",
            },
            {
              id: "add-module" as AdminTab,
              label: "Add Module",
              icon: "library_add",
            },
            {
              id: "manage" as AdminTab,
              label: "Manage Content",
              icon: "manage_search",
            },
          ] as const
        ).map((tab) => (
          <button
            type="button"
            key={tab.id}
            data-ocid={`admin.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 border-black font-label font-bold text-sm uppercase tracking-wide transition-all neo-brutal-shadow-sm ${
              activeTab === tab.id
                ? "bg-[#af101a] text-white"
                : "bg-white text-black hover:bg-[#f3f3f4]"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "add-question" && <AddQuestionForm />}
      {activeTab === "add-module" && <AddModuleForm />}
      {activeTab === "manage" && <ManageContent />}
    </div>
  );
}

function AddQuestionForm() {
  const addQuestion = useAddQuestion();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [moduleCategory, setModuleCategory] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !questionText.trim() ||
      options.some((o) => !o.trim()) ||
      !moduleCategory.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addQuestion.mutate(
      {
        questionText,
        options,
        correctAnswer: BigInt(correctAnswer),
        explanation,
        moduleCategory,
      },
      {
        onSuccess: () => {
          toast.success("Question added successfully!");
          setQuestionText("");
          setOptions(["", "", "", ""]);
          setCorrectAnswer(0);
          setExplanation("");
          setModuleCategory("");
        },
        onError: (e) => toast.error(`Failed: ${e.message}`),
      },
    );
  }

  return (
    <form
      data-ocid="admin.add_question.card"
      onSubmit={handleSubmit}
      className="bg-white border-2 border-black rounded-3xl p-8 neo-brutal-shadow flex flex-col gap-6"
    >
      <h3 className="font-headline text-2xl font-extrabold">
        Add New Question
      </h3>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="question-text"
          className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]"
        >
          Question Text *
        </label>
        <textarea
          id="question-text"
          data-ocid="admin.question_text.textarea"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter the MCQ question..."
          rows={3}
          className="w-full border-2 border-black rounded-xl p-3 font-body text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#af101a]"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]">
          Answer Options *
        </p>
        {(["A", "B", "C", "D"] as const).map((label, oi) => (
          <div key={label} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCorrectAnswer(oi)}
              className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-headline font-black text-sm shrink-0 transition-all ${
                correctAnswer === oi
                  ? "bg-green-500 text-white neo-brutal-shadow-sm"
                  : "bg-[#e2e2e2] text-black hover:bg-green-100"
              }`}
              title={`Set option ${label} as correct answer`}
            >
              {label}
            </button>
            <input
              data-ocid={`admin.option.${oi + 1}.input`}
              value={options[oi]}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[oi] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Option ${label}`}
              className="flex-1 border-2 border-black rounded-xl p-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-[#af101a]"
              required
            />
          </div>
        ))}
        <p className="text-xs text-[#5e5e5e] font-label">
          Click a letter to set it as the correct answer (highlighted in green).
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="module-category"
          className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]"
        >
          Module Category *
        </label>
        <input
          id="module-category"
          data-ocid="admin.module_category.input"
          value={moduleCategory}
          onChange={(e) => setModuleCategory(e.target.value)}
          placeholder="e.g., Cardiology, Neurology..."
          className="w-full border-2 border-black rounded-xl p-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-[#af101a]"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="explanation"
          className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]"
        >
          Explanation (optional)
        </label>
        <textarea
          id="explanation"
          data-ocid="admin.explanation.textarea"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain why the correct answer is correct..."
          rows={2}
          className="w-full border-2 border-black rounded-xl p-3 font-body text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#af101a]"
        />
      </div>

      <button
        data-ocid="admin.add_question.submit_button"
        type="submit"
        disabled={addQuestion.isPending}
        className="self-start bg-[#af101a] text-white px-8 py-4 rounded-full border-2 border-black neo-brutal-shadow neo-brutal-press font-headline font-black text-lg uppercase tracking-tight flex items-center gap-2 disabled:opacity-60"
      >
        {addQuestion.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
        {addQuestion.isPending ? "Adding..." : "Add Question"}
      </button>
    </form>
  );
}

function AddModuleForm() {
  const addModule = useAddModule();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addModule.mutate(
      { title, description, content },
      {
        onSuccess: () => {
          toast.success("Module added successfully!");
          setTitle("");
          setDescription("");
          setContent("");
        },
        onError: (e) => toast.error(`Failed: ${e.message}`),
      },
    );
  }

  return (
    <form
      data-ocid="admin.add_module.card"
      onSubmit={handleSubmit}
      className="bg-white border-2 border-black rounded-3xl p-8 neo-brutal-shadow flex flex-col gap-6"
    >
      <h3 className="font-headline text-2xl font-extrabold">Add New Module</h3>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="module-title"
          className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]"
        >
          Module Title *
        </label>
        <input
          id="module-title"
          data-ocid="admin.module_title.input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Cardiovascular System"
          className="w-full border-2 border-black rounded-xl p-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-[#af101a]"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="module-description"
          className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]"
        >
          Short Description *
        </label>
        <input
          id="module-description"
          data-ocid="admin.module_description.input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief overview of the module"
          className="w-full border-2 border-black rounded-xl p-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-[#af101a]"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="module-content"
          className="font-label font-bold text-sm uppercase tracking-widest text-[#5e5e5e]"
        >
          Module Content *
        </label>
        <textarea
          id="module-content"
          data-ocid="admin.module_content.textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Full learning content for this module..."
          rows={6}
          className="w-full border-2 border-black rounded-xl p-3 font-body text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#af101a]"
          required
        />
      </div>

      <button
        data-ocid="admin.add_module.submit_button"
        type="submit"
        disabled={addModule.isPending}
        className="self-start bg-[#af101a] text-white px-8 py-4 rounded-full border-2 border-black neo-brutal-shadow neo-brutal-press font-headline font-black text-lg uppercase tracking-tight flex items-center gap-2 disabled:opacity-60"
      >
        {addModule.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
        {addModule.isPending ? "Adding..." : "Add Module"}
      </button>
    </form>
  );
}

function ManageContent() {
  const { data: questions = [], isLoading: loadingQ } = useGetQuestions();
  const { data: modules = [], isLoading: loadingM } = useGetModules();
  const deleteQuestion = useDeleteQuestion();
  const [manageTab, setManageTab] = useState<"questions" | "modules">(
    "questions",
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <button
          type="button"
          data-ocid="admin.manage_questions.tab"
          onClick={() => setManageTab("questions")}
          className={`px-5 py-2 rounded-full border-2 border-black font-label font-bold text-sm uppercase tracking-wide transition-all neo-brutal-shadow-sm ${
            manageTab === "questions"
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-[#f3f3f4]"
          }`}
        >
          Questions ({questions.length})
        </button>
        <button
          type="button"
          data-ocid="admin.manage_modules.tab"
          onClick={() => setManageTab("modules")}
          className={`px-5 py-2 rounded-full border-2 border-black font-label font-bold text-sm uppercase tracking-wide transition-all neo-brutal-shadow-sm ${
            manageTab === "modules"
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-[#f3f3f4]"
          }`}
        >
          Modules ({modules.length})
        </button>
      </div>

      {manageTab === "questions" && (
        <div className="flex flex-col gap-3">
          {loadingQ && (
            <div
              data-ocid="admin.questions.loading_state"
              className="flex flex-col gap-3"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-black rounded-2xl p-5 animate-pulse"
                >
                  <div className="h-4 bg-[#e2e2e2] rounded w-3/4" />
                </div>
              ))}
            </div>
          )}
          {!loadingQ && questions.length === 0 && (
            <div
              data-ocid="admin.questions.empty_state"
              className="bg-white border-2 border-black rounded-2xl p-8 neo-brutal-shadow text-center"
            >
              <p className="text-[#5e5e5e] font-label">
                No questions added yet.
              </p>
            </div>
          )}
          {questions.map((q, idx) => (
            <div
              key={q.id.toString()}
              data-ocid={`admin.question.item.${idx + 1}`}
              className="bg-white border-2 border-black rounded-2xl p-5 neo-brutal-shadow-sm flex items-start gap-4"
            >
              <span className="bg-[#d32f2f] text-white font-headline font-black w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border-2 border-black">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-body font-bold text-base leading-snug">
                  {q.questionText}
                </p>
                <span className="text-xs text-[#5e5e5e] font-label">
                  {q.moduleCategory}
                </span>
              </div>
              <button
                type="button"
                data-ocid={`admin.question.delete_button.${idx + 1}`}
                onClick={() =>
                  deleteQuestion.mutate(q.id, {
                    onSuccess: () => toast.success("Question deleted."),
                    onError: () => toast.error("Failed to delete."),
                  })
                }
                disabled={deleteQuestion.isPending}
                className="shrink-0 p-2 rounded-xl border-2 border-black bg-[#ffdad6] hover:bg-red-100 text-[#af101a] neo-brutal-shadow-sm transition-all disabled:opacity-50"
                title="Delete question"
              >
                <span
                  className="material-symbols-outlined text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  delete
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {manageTab === "modules" && (
        <div className="flex flex-col gap-3">
          {loadingM && (
            <div
              data-ocid="admin.modules.loading_state"
              className="flex flex-col gap-3"
            >
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-black rounded-2xl p-5 animate-pulse"
                >
                  <div className="h-4 bg-[#e2e2e2] rounded w-2/3" />
                </div>
              ))}
            </div>
          )}
          {!loadingM && modules.length === 0 && (
            <div
              data-ocid="admin.modules.empty_state"
              className="bg-white border-2 border-black rounded-2xl p-8 neo-brutal-shadow text-center"
            >
              <p className="text-[#5e5e5e] font-label">No modules added yet.</p>
            </div>
          )}
          {modules.map((mod, idx) => (
            <div
              key={mod.id.toString()}
              data-ocid={`admin.module.item.${idx + 1}`}
              className="bg-white border-2 border-black rounded-2xl p-5 neo-brutal-shadow-sm"
            >
              <h4 className="font-headline font-bold text-lg">{mod.title}</h4>
              <p className="text-sm text-[#5e5e5e] mt-1">{mod.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
