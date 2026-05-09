import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import T from "@/components/T";
import BackpackButton from "@/components/BackpackButton";

export type ChoiceOption = {
  id: string;
  label: string;
  best?: boolean;
  ok?: boolean;
  hint?: string;        // shown under the label as a short tag
  rationale?: string;   // shown after reveal explaining why
};

interface Props {
  title: string;
  prompt: string;
  options: ChoiceOption[];
  reveal?: string;
  selected?: string;
  revealed: boolean;
  /** stable key that resets pending pick when the question changes */
  resetKey: string | number;
  onSelect: (id: string) => void;
}

const verdictFor = (opt?: ChoiceOption) => {
  if (!opt) return null;
  if (opt.best) return { tag: "★ BEST", tone: "primary", text: "Strong reasoning. This holds up under scrutiny." };
  if (opt.ok) return { tag: "◆ ACCEPTABLE", tone: "accent", text: "Defensible — but not the strongest position." };
  return { tag: "✕ SUBOPTIMAL", tone: "destructive", text: "Weak. The evidence does not support this conclusion." };
};

const ChoicePanel = ({ title, prompt, options, reveal, selected, revealed, resetKey, onSelect }: Props) => {
  const [pending, setPending] = useState<string | null>(null);
  const [thinkSec, setThinkSec] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const location = useLocation();
  const caseSlug = location.pathname.startsWith("/story/")
    ? location.pathname.replace("/story/", "").split("/")[0]
    : undefined;

  // Reset deliberation state when question changes
  useEffect(() => {
    setPending(null);
    setThinkSec(0);
  }, [resetKey]);

  // Deliberation timer (only counts while undecided)
  useEffect(() => {
    if (selected) return;
    const t = window.setInterval(() => setThinkSec((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [selected, resetKey]);

  const selectedOpt = useMemo(
    () => options.find((o) => o.id === selected),
    [options, selected],
  );
  const verdict = revealed ? verdictFor(selectedOpt) : null;

  const handleClick = (id: string) => {
    if (selected) return; // locked
    if (pending === id) {
      onSelect(id);
      setPending(null);
    } else {
      setPending(id);
    }
  };

  const minutes = String(Math.floor(thinkSec / 60)).padStart(2, "0");
  const seconds = String(thinkSec % 60).padStart(2, "0");

  return (
    <div className="relative border-2 border-primary bg-card/95 p-3 space-y-3 shadow-[var(--shadow-pixel)]">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="pixel text-[8px] px-2 py-1 bg-primary text-primary-foreground"
            style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
          >
            DECISION
          </span>
          <span className="pixel text-[10px] text-primary"><T>{title}</T></span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="pixel text-[8px] text-accent border-2 border-accent px-2 py-0.5"
            aria-label="Deliberation timer"
            title="Time spent deliberating"
          >
            ⏱ {minutes}:{seconds}
          </span>
          <BackpackButton caseSlug={caseSlug} />
        </div>
      </div>

      {/* Prompt */}
      <p className="text-sm leading-snug bg-background/70 border-l-4 border-primary pl-2 py-1">
        <T>{prompt}</T>
      </p>

      {/* Toolbar */}
      {!selected && (
        <div className="flex items-center justify-between pixel text-[8px] text-primary/80">
          <span>Tap once to consider · tap again to confirm</span>
          <button
            onClick={() => setShowHints((h) => !h)}
            className="px-2 py-0.5 border-2 border-accent text-accent hover:bg-accent/10"
          >
            HINTS {showHints ? "ON" : "OFF"}
          </button>
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isPicked = selected === opt.id;
          const isPending = pending === opt.id && !selected;
          const tone = revealed
            ? opt.best
              ? "border-primary bg-primary/25"
              : opt.ok
                ? "border-accent bg-accent/15"
                : isPicked
                  ? "border-destructive/70 bg-destructive/15"
                  : "border-primary/30 bg-background/60 opacity-70"
            : isPicked
              ? "border-primary bg-primary/25"
              : isPending
                ? "border-accent bg-accent/15 ring-2 ring-accent/60"
                : "border-primary/40 bg-background/70 hover:border-primary/80";

          return (
            <button
              key={opt.id}
              onClick={() => handleClick(opt.id)}
              disabled={!!selected && !isPicked && !revealed}
              className={`w-full text-left p-2 border-2 transition-colors ${tone} disabled:cursor-not-allowed`}
              style={{ boxShadow: isPicked || isPending ? "2px 2px 0 hsl(0 0% 0%)" : undefined }}
              aria-pressed={isPicked}
            >
              <div className="flex items-start gap-2">
                {/* letter chip */}
                <span
                  className="pixel text-[10px] shrink-0 w-6 h-6 inline-flex items-center justify-center border-2 border-primary bg-card text-primary"
                  aria-hidden
                >
                  {opt.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm leading-snug"><T>{opt.label}</T></span>
                    {revealed && opt.best && (
                      <span className="pixel text-[8px] text-primary border border-primary px-1">★ BEST</span>
                    )}
                    {revealed && opt.ok && !opt.best && (
                      <span className="pixel text-[8px] text-accent border border-accent px-1">◆ OK</span>
                    )}
                    {revealed && !opt.best && !opt.ok && isPicked && (
                      <span className="pixel text-[8px] text-destructive border border-destructive px-1">✕ POOR</span>
                    )}
                  </div>

                  {/* hints only before confirmation; rationales only after reveal */}
                  {!revealed && showHints && opt.hint && (
                    <p className="text-xs text-foreground/70 italic mt-1">💡 <T>{opt.hint}</T></p>
                  )}
                  {revealed && opt.rationale && (
                    <p className="text-xs text-foreground/85 mt-1 leading-snug">
                      <span className="pixel text-[8px] text-primary mr-1">→</span>
                      <T>{opt.rationale}</T>
                    </p>
                  )}

                  {isPending && !selected && (
                    <p className="text-xs text-accent mt-1 pixel text-[9px]">
                      ▶ TAP AGAIN TO CONFIRM
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Verdict / reveal banner */}
      {revealed && verdict && (
        <div
          className={`border-2 p-2 animate-fade-in ${
            verdict.tone === "primary"
              ? "border-primary bg-primary/15"
              : verdict.tone === "accent"
                ? "border-accent bg-accent/15"
                : "border-destructive bg-destructive/15"
          }`}
          style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className={`pixel text-[10px] ${
                verdict.tone === "primary"
                  ? "text-primary"
                  : verdict.tone === "accent"
                    ? "text-accent"
                    : "text-destructive"
              }`}
            >
              {verdict.tag}
            </span>
            <span className="pixel text-[8px] text-foreground/70">
              decision in {minutes}:{seconds}
            </span>
          </div>
          <p className="text-sm mt-1 leading-snug"><T>{verdict.text}</T></p>
          {reveal && (
            <p className="text-xs mt-2 text-foreground/85 border-t-2 border-primary/30 pt-2">
              <span className="pixel text-[8px] text-primary mr-1">REVEAL</span>
              <T>{reveal}</T>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChoicePanel;
