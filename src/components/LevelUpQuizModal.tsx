import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { useSettings } from "@/game/SettingsContext";
import { LEVEL_NAMES } from "@/lib/levels";
import { getQuiz, type QuizQuestion } from "@/data/levelQuiz";

type Phase = "intro" | "quiz" | "result";

const LevelUpQuizModal = () => {
  const { pendingQuiz, level, lang, resolveQuiz, t } = useSettings();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);

  // Initialise when modal becomes pending. Tier = current level (capped at 4).
  useEffect(() => {
    if (!pendingQuiz) return;
    const tier = Math.min(4, level) as 1 | 2 | 3 | 4;
    setQuestions(getQuiz(tier));
    setIdx(0);
    setPicks([]);
    setChosen(null);
    setPhase("intro");
  }, [pendingQuiz, level]);

  const correctCount = useMemo(
    () => picks.reduce((acc, p, i) => acc + (p === questions[i]?.answerIdx ? 1 : 0), 0),
    [picks, questions],
  );
  const passed = correctCount >= 3;

  if (!pendingQuiz) return null;

  const nextLevelName = LEVEL_NAMES[Math.min(5, level + 1)];

  const submitChoice = () => {
    if (chosen === null) return;
    const newPicks = [...picks, chosen];
    setPicks(newPicks);
    setChosen(null);
    if (newPicks.length >= questions.length) {
      setPhase("result");
    } else {
      setIdx((i) => i + 1);
    }
  };

  const finish = () => {
    resolveQuiz(passed);
    // local reset; modal will unmount because pendingQuiz becomes false
    setPhase("intro");
  };

  return (
    <Modal open={true} dismissible={false} title={t("quiz.title")}>
      {phase === "intro" && (
        <div className="space-y-3 text-sm">
          <div className="pixel text-[10px] text-primary text-center">
            ⚖ {t("quiz.promotionTo")} {nextLevelName}
          </div>
          <p className="text-xs leading-relaxed">{t("quiz.intro")}</p>
          <ul className="text-[11px] list-disc pl-5 space-y-1 text-muted-foreground">
            <li>{t("quiz.rule1")}</li>
            <li>{t("quiz.rule2")}</li>
            <li>{t("quiz.rule3")}</li>
          </ul>
          <button onClick={() => setPhase("quiz")} className="pixel-btn pixel-btn-primary w-full text-[11px]">
            ▶ {t("quiz.begin")}
          </button>
        </div>
      )}

      {phase === "quiz" && questions[idx] && (
        <div className="space-y-3">
          <div className="pixel text-[10px] text-primary">
            {t("quiz.question")} {idx + 1} / {questions.length}
          </div>
          <div className="text-sm leading-snug">{questions[idx].q[lang]}</div>
          <div className="space-y-2">
            {questions[idx].options[lang].map((opt, i) => (
              <button
                key={i}
                onClick={() => setChosen(i)}
                className={`pixel-btn w-full text-[11px] text-left ${
                  chosen === i ? "pixel-btn-primary" : "pixel-btn-secondary"
                }`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
          <button
            onClick={submitChoice}
            disabled={chosen === null}
            className="pixel-btn pixel-btn-primary w-full text-[11px] disabled:opacity-50"
          >
            {idx + 1 === questions.length ? t("quiz.submit") : t("quiz.next")} ▶
          </button>
        </div>
      )}

      {phase === "result" && (
        <div className="space-y-3 text-sm">
          <div className={`pixel text-[12px] text-center ${passed ? "text-accent" : "text-destructive"}`}>
            {passed ? `✨ ${t("quiz.passed")}` : `✕ ${t("quiz.failed")}`}
          </div>
          <div className="text-center text-xs">
            {t("quiz.score")}: <span className="pixel text-primary">{correctCount} / {questions.length}</span>
          </div>
          <div className="text-[11px] text-center text-muted-foreground">
            {passed
              ? `${t("quiz.promotedTo")} ${nextLevelName}`
              : t("quiz.xpReset")}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 border-t-2 border-primary/30 pt-2">
            {questions.map((q, i) => {
              const ok = picks[i] === q.answerIdx;
              return (
                <div key={i} className="text-[10px] leading-snug">
                  <div className="flex gap-1">
                    <span className={ok ? "text-accent" : "text-destructive"}>{ok ? "✓" : "✕"}</span>
                    <span className="flex-1">{q.q[lang]}</span>
                  </div>
                  <div className="text-muted-foreground pl-4">→ {q.options[lang][q.answerIdx]}</div>
                </div>
              );
            })}
          </div>
          <button onClick={finish} className="pixel-btn pixel-btn-primary w-full text-[11px]">
            {t("quiz.done")}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default LevelUpQuizModal;