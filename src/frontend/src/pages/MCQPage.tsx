import type { AdminData } from "@/hooks/useAdminData";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type QuizState = "quiz" | "results";

interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0=A, 1=B, 2=C, 3=D
  explanation: string;
  moduleCategory: string;
  subjectId: string;
  moduleId: string;
}

interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  showAnswer: boolean;
}

function getOptionLabel(idx: number): string {
  return ["A", "B", "C", "D"][idx] ?? String(idx + 1);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Extract bullet points from explanation text */
function extractBullets(text: string): string[] {
  const sentences = text
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
  if (sentences.length <= 1) return [];
  return sentences.slice(1).map((s) => (s.endsWith(".") ? s : `${s}.`));
}

const ANSWER_LETTER_TO_IDX: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

function buildQuizQuestions(
  mcqs: AdminData["mcqs"],
  subjects: AdminData["subjects"],
  modules: AdminData["modules"],
): QuizQuestion[] {
  return mcqs.map((q) => {
    const subject = subjects.find((s) => s.id === q.subjectId);
    const module = modules.find((m) => m.id === q.moduleId);
    return {
      id: q.id,
      questionText: q.question,
      options: [q.optionA, q.optionB, q.optionC, q.optionD],
      correctAnswer: ANSWER_LETTER_TO_IDX[q.correctAnswer] ?? 0,
      explanation: q.explanation,
      moduleCategory: module?.name ?? subject?.name ?? "General",
      subjectId: q.subjectId,
      moduleId: q.moduleId,
    };
  });
}

export default function MCQPage({
  adminData,
  subjectFilter,
  autoStart,
  onClearFilter,
  onBackToModules,
}: {
  adminData: AdminData;
  subjectFilter: string | null;
  autoStart: boolean;
  onClearFilter: () => void;
  onBackToModules: () => void;
}) {
  const { mcqs, subjects, modules } = adminData;

  // Derived questions for display (question count, prompt state, etc.)
  // Computed directly from props — always fresh, no stale memo
  const allQuestions = buildQuizQuestions(mcqs, subjects, modules);

  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(600);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionIndexRef = useRef(0);

  // Track the last subjectFilter we auto-started for, so we don't re-trigger
  // on every render — but DO re-trigger if subjectFilter changes to a new value
  const autoStartedForRef = useRef<string | null>(null);

  // Derive the subject name for the active filter banner
  const activeSubjectName = subjectFilter
    ? (subjects.find((s) => s.id === subjectFilter)?.name ?? "Selected Subject")
    : null;

  const currentQuestionIndex = session?.currentIndex ?? 0;

  // Reset and start timer when question changes
  useEffect(() => {
    if (quizState !== "quiz") return;
    setTimerSeconds(600);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    questionIndexRef.current = currentQuestionIndex;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, currentQuestionIndex]);

  // Auto-start quiz when subjectFilter is set and autoStart flag is true.
  // Re-triggers whenever subjectFilter changes to a different subject.
  useEffect(() => {
    if (!autoStart || !subjectFilter) return;
    // Only trigger once per unique subjectFilter value
    if (autoStartedForRef.current === subjectFilter) return;
    autoStartedForRef.current = subjectFilter;

    // Build questions from the current adminData (passed as prop, always fresh)
    const qs = buildQuizQuestions(mcqs, subjects, modules).filter(
      (q) => q.subjectId === subjectFilter,
    );

    if (qs.length === 0) {
      toast.error("No questions available for this subject yet.");
      return;
    }
    setQuizState("quiz");
    setSession({
      questions: [...qs],
      currentIndex: 0,
      answers: new Array(qs.length).fill(null),
      showAnswer: false,
    });
  }, [autoStart, subjectFilter, mcqs, subjects, modules]);

  // When subjectFilter is cleared (user navigates away), reset the auto-start tracker
  useEffect(() => {
    if (!subjectFilter) {
      autoStartedForRef.current = null;
      setQuizState(null);
      setSession(null);
    }
  }, [subjectFilter]);

  function selectAnswer(answerIdx: number) {
    if (!session || session.showAnswer) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSession((prev) => {
      if (!prev) return prev;
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentIndex] = answerIdx;
      return { ...prev, answers: newAnswers, showAnswer: true };
    });
  }

  function nextQuestion() {
    if (!session) return;
    if (session.currentIndex + 1 >= session.questions.length) {
      setQuizState("results");
    } else {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
          showAnswer: false,
        };
      });
    }
  }

  // ─── No subject selected — prompt state ──────────────────────────────────────
  if (!subjectFilter || quizState === null) {
    return (
      <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-8 mb-8">
          <div>
            <h2 className="font-headline text-4xl font-extrabold">MCQ Bank</h2>
            <p className="text-[#5e5e5e] mt-1">
              {allQuestions.length} question
              {allQuestions.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
        <div
          data-ocid="mcq.prompt_state"
          className="bg-white border-2 border-black rounded-3xl p-12 neo-brutal-shadow text-center flex flex-col items-center gap-6"
        >
          <div className="bg-[#bee9ff] w-24 h-24 rounded-full border-2 border-black flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[#005f7b] text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <div>
            <h3 className="font-headline text-2xl font-extrabold mb-2">
              Select a Subject to Start Practicing
            </h3>
            <p className="text-[#5e5e5e] max-w-md">
              Go to the <span className="font-bold text-black">Modules</span>{" "}
              tab, open a module, and tap{" "}
              <span className="font-bold text-[#af101a]">Start Practice</span>{" "}
              to load MCQs for that subject.
            </p>
          </div>
          <button
            type="button"
            data-ocid="mcq.goto_modules.button"
            onClick={onBackToModules}
            className="flex items-center gap-3 bg-[#f3f3f4] border-2 border-black rounded-xl px-6 py-4 font-headline font-bold text-sm uppercase tracking-widest text-[#5e5e5e] hover:bg-[#e8e8e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[#af101a]">
              library_books
            </span>
            Go to Modules
          </button>
        </div>
      </div>
    );
  }

  // ─── Results View ────────────────────────────────────────────────────────────
  if (quizState === "results" && session) {
    const score = session.answers.filter(
      (a, i) => a !== null && a === session.questions[i].correctAnswer,
    ).length;
    const total = session.questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center gap-8">
        <div
          data-ocid="mcq.results.card"
          className="w-full bg-white border-2 border-black rounded-3xl p-8 neo-brutal-shadow text-center flex flex-col items-center gap-6"
        >
          <div className="bg-[#d32f2f] w-20 h-20 rounded-full border-2 border-black flex items-center justify-center neo-brutal-shadow">
            <span
              className="material-symbols-outlined text-white text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emoji_events
            </span>
          </div>
          {activeSubjectName && (
            <span className="bg-[#ffdad6] text-[#af101a] font-headline font-bold text-xs px-3 py-1 rounded-full border-2 border-black uppercase tracking-widest">
              {activeSubjectName}
            </span>
          )}
          <h2 className="font-headline text-4xl font-black">Quiz Complete!</h2>
          <p className="text-[#5e5e5e] text-lg">You scored</p>
          <div className="font-headline text-7xl font-black text-[#af101a]">
            {pct}%
          </div>
          <p className="font-label font-bold text-[#5e5e5e] uppercase tracking-widest">
            {score} / {total} Correct
          </p>
          <div className="w-full h-4 bg-[#e2e2e2] rounded-full overflow-hidden border-2 border-black">
            <div
              className="h-full bg-[#af101a] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct >= 80 && (
            <p className="text-[#005f7b] font-bold text-lg">
              🎉 Excellent work! Keep it up!
            </p>
          )}
          {pct >= 50 && pct < 80 && (
            <p className="text-[#5e5e5e] font-bold text-lg">
              Good effort! Review the explanations below.
            </p>
          )}
          {pct < 50 && (
            <p className="text-red-700 font-bold text-lg">
              Keep practicing — you'll get there!
            </p>
          )}
        </div>

        {/* Answer review */}
        <div className="w-full flex flex-col gap-4">
          <h3 className="font-headline text-2xl font-extrabold">
            Review Answers
          </h3>
          {session.questions.map((q, qi) => {
            const userAnswer = session.answers[qi];
            const correct = q.correctAnswer;
            const isCorrect = userAnswer === correct;
            return (
              <div
                key={q.id}
                data-ocid={`mcq.review.item.${qi + 1}`}
                className={`bg-white border-2 border-black rounded-2xl p-5 neo-brutal-shadow-sm ${
                  isCorrect
                    ? "border-l-4 border-l-green-600"
                    : "border-l-4 border-l-red-600"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isCorrect ? "check_circle" : "cancel"}
                  </span>
                  <p className="font-headline font-bold text-base flex-1">
                    {q.questionText}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oi) => (
                    <div
                      key={`${q.id}-opt-${oi}`}
                      className={`p-2 rounded-lg border-2 text-sm font-label font-bold ${
                        oi === correct
                          ? "bg-green-100 border-green-600 text-green-800"
                          : oi === userAnswer && !isCorrect
                            ? "bg-red-100 border-red-600 text-red-800"
                            : "bg-[#f3f3f4] border-transparent text-[#5e5e5e]"
                      }`}
                    >
                      {getOptionLabel(oi)}. {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="bg-[#f3f3f4] rounded-lg p-3 text-sm text-[#5e5e5e]">
                    <span className="font-bold">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          data-ocid="mcq.back_to_modules.button"
          onClick={() => {
            onClearFilter();
            onBackToModules();
          }}
          className="bg-[#af101a] text-white px-8 py-4 rounded-full border-2 border-black neo-brutal-shadow neo-brutal-press font-headline font-black text-lg uppercase tracking-tight flex items-center gap-3"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Modules
        </button>
      </div>
    );
  }

  // ─── Quiz View ───────────────────────────────────────────────────────────────
  if (quizState === "quiz" && session) {
    const q = session.questions[session.currentIndex];
    const userAnswer = session.answers[session.currentIndex];
    const correctAnswer = q.correctAnswer;
    const isLastQuestion = session.currentIndex + 1 >= session.questions.length;
    const bullets = q.explanation ? extractBullets(q.explanation) : [];
    const introText = q.explanation
      ? q.explanation.split(/\.\s+/)[0]?.trim()
      : "";
    const explanationIntro = introText
      ? introText.endsWith(".")
        ? introText
        : `${introText}.`
      : "";

    return (
      <div className="pt-24 px-4 max-w-2xl mx-auto pb-32">
        {/* Subject banner */}
        {activeSubjectName && (
          <div className="mt-4 mb-2">
            <span className="bg-[#ffdad6] text-[#af101a] font-headline font-bold text-xs px-3 py-1 rounded-full border-2 border-black uppercase tracking-widest">
              {activeSubjectName}
            </span>
          </div>
        )}
        {/* Progress Info */}
        <div className="mb-6 flex justify-between items-end mt-4">
          <div>
            <span className="font-headline font-bold text-primary uppercase text-xs tracking-widest block">
              {q.moduleCategory}
            </span>
            <h2 className="font-headline text-2xl font-extrabold text-black">
              Question {session.currentIndex + 1} of {session.questions.length}
            </h2>
          </div>
          <div
            className={`bg-white border-2 border-black px-3 py-1 rounded-lg neo-brutal-shadow-sm font-headline font-bold text-sm ${
              timerSeconds <= 60 ? "text-red-700" : "text-black"
            }`}
          >
            {formatTime(timerSeconds)}
          </div>
        </div>

        {/* Question Card */}
        <section
          data-ocid="mcq.question.card"
          className="bg-white border-2 border-black rounded-xl p-6 mb-6 neo-brutal-shadow"
        >
          <div className="mb-6">
            <p className="text-lg font-medium leading-relaxed">
              {q.questionText}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-4" data-ocid="mcq.options.list">
            {q.options.map((opt, oi) => {
              const isCorrectOpt = oi === correctAnswer;
              const isUserWrong =
                oi === userAnswer && userAnswer !== correctAnswer;

              if (session.showAnswer) {
                if (isCorrectOpt) {
                  return (
                    <button
                      type="button"
                      key={`opt-${q.id}-${oi}`}
                      data-ocid={`mcq.option.${oi + 1}`}
                      disabled
                      className="w-full text-left p-4 rounded-xl border-2 border-black bg-green-600 text-white neo-brutal-shadow-sm flex justify-between items-center cursor-default"
                    >
                      <div className="flex items-center">
                        <span className="font-headline font-bold mr-4">
                          {getOptionLabel(oi)}
                        </span>
                        <span className="font-bold">{opt}</span>
                      </div>
                      <span
                        className="material-symbols-outlined shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </button>
                  );
                }
                if (isUserWrong) {
                  return (
                    <button
                      type="button"
                      key={`opt-${q.id}-${oi}`}
                      data-ocid={`mcq.option.${oi + 1}`}
                      disabled
                      className="w-full text-left p-4 rounded-xl border-2 border-black bg-red-600 text-white neo-brutal-shadow-sm flex justify-between items-center cursor-default"
                    >
                      <div className="flex items-center">
                        <span className="font-headline font-bold mr-4">
                          {getOptionLabel(oi)}
                        </span>
                        <span className="font-bold">{opt}</span>
                      </div>
                      <span
                        className="material-symbols-outlined shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        cancel
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    type="button"
                    key={`opt-${q.id}-${oi}`}
                    data-ocid={`mcq.option.${oi + 1}`}
                    disabled
                    className="w-full text-left p-4 rounded-xl border-2 border-black bg-white flex justify-between items-center cursor-default opacity-60"
                  >
                    <span className="font-headline font-bold mr-4 opacity-50">
                      {getOptionLabel(oi)}
                    </span>
                    <span className="flex-grow font-medium">{opt}</span>
                  </button>
                );
              }

              return (
                <button
                  type="button"
                  key={`opt-${q.id}-${oi}`}
                  data-ocid={`mcq.option.${oi + 1}`}
                  onClick={() => selectAnswer(oi)}
                  className="w-full text-left p-4 rounded-xl border-2 border-black bg-white hover:bg-[#f3f3f4] active:bg-[#ebebeb] transition-all group flex justify-between items-center"
                >
                  <span className="font-headline font-bold mr-4 opacity-50">
                    {getOptionLabel(oi)}
                  </span>
                  <span className="flex-grow font-medium">{opt}</span>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    radio_button_unchecked
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Unified Answer Feedback Box — shown after answer is selected */}
        {session.showAnswer && (
          <section
            data-ocid="mcq.answer_feedback.box"
            className="border-2 border-black rounded-xl overflow-hidden mb-6 neo-brutal-shadow"
          >
            {/* Correct Answer Label */}
            <div className="bg-green-600 text-white px-5 py-3 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="font-headline font-bold text-sm uppercase tracking-widest">
                Correct Answer
              </span>
            </div>
            <div className="bg-white px-5 py-4 border-b-2 border-black">
              <p className="font-headline font-extrabold text-base text-black">
                {getOptionLabel(correctAnswer)}. {q.options[correctAnswer]}
              </p>
              {userAnswer !== null && userAnswer !== correctAnswer && (
                <p className="mt-1 text-sm font-label text-[#af101a] flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    cancel
                  </span>
                  Your answer:{" "}
                  <span className="font-bold">
                    {getOptionLabel(userAnswer)}. {q.options[userAnswer]}
                  </span>
                </p>
              )}
              {userAnswer !== null && userAnswer === correctAnswer && (
                <p className="mt-1 text-sm font-label text-green-700 flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-bold">You answered correctly!</span>
                </p>
              )}
            </div>

            {/* Explanation */}
            {q.explanation && (
              <div className="bg-[#f9f9fb] px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="material-symbols-outlined text-base text-[#5e5e5e]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lightbulb
                  </span>
                  <span className="font-headline font-bold text-xs uppercase tracking-widest text-[#5e5e5e]">
                    Explanation
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#3d3d3d]">
                  {bullets.length > 0 ? explanationIntro : q.explanation}
                </p>
                {bullets.length > 0 && (
                  <ul className="mt-3 text-sm space-y-1.5 list-disc pl-5 text-[#3d3d3d]">
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-20">
          <button
            type="button"
            data-ocid="mcq.flag.button"
            onClick={() => toast("Question flagged for review.")}
            className="flex-1 bg-white border-2 border-black text-black py-4 rounded-full font-headline font-extrabold uppercase tracking-widest text-sm transition-all hover:bg-[#f3f3f4] active:translate-x-0.5 active:translate-y-0.5"
          >
            Flag Question
          </button>
          {session.showAnswer && (
            <button
              type="button"
              data-ocid="mcq.next.button"
              onClick={nextQuestion}
              className="flex-1 bg-primary border-2 border-black text-white py-4 rounded-full font-headline font-extrabold uppercase tracking-widest text-sm neo-brutal-shadow transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {isLastQuestion ? "See Results" : "Next Question"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback — should not reach here
  return null;
}
