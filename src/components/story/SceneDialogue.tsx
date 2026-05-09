import { useMemo, useRef, useState } from "react";
import DialogueLine from "./DialogueLine";

export interface Line {
  who?: string;
  text: string;
  inner?: boolean;
}

type Mode = "auto" | "manual";
const MODE_KEY = "lg.dialogueMode";

interface Props {
  lines: Line[];
  charDelay?: number;
  pauseAfter?: number;
  onComplete?: () => void;
  resetKey?: string | number;
}

/**
 * Auto / manual / skip dialogue player with typewriter effect.
 *
 * Modes:
 *   AUTO   — lines reveal automatically with a pause between them.
 *   MANUAL — typewriter still runs, but you must tap NEXT (or Space / →) to advance.
 *   SKIP   — instantly reveals every remaining line in the scene.
 *
 * Tapping the dialogue area always:
 *   - completes the current typing line if it's still typing, OR
 *   - advances to the next line (in manual mode).
 *
 * Keyboard:
 *   Space / Enter / →  advance
 *   S                  skip all
 *   M                  toggle auto/manual
 */
const SceneDialogue = ({
  lines: rawLines,
  charDelay = 28,
  pauseAfter = 900,
  onComplete,
  resetKey,
}: Props) => {
  const lines = useMemo(() => rawLines.map((l) => ({ ...l })), [rawLines]);
  const [shown, setShown] = useState(1);
  const [typed, setTyped] = useState(0);
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "auto";
    return (localStorage.getItem(MODE_KEY) as Mode) || "auto";
  });
  const tickRef = useRef<number | null>(null);
  const advanceRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(MODE_KEY, mode);
    }
  }, [mode]);

  // reset whenever the scene changes
  useEffect(() => {
    setShown(1);
    setTyped(0);
  }, [resetKey, lines]);

  const current = lines[shown - 1];
  const fullLen = current?.text.length ?? 0;
  const isLast = shown >= lines.length;
  const lineDone = typed >= fullLen;

  // typewriter
  useEffect(() => {
    if (!current) return;
    if (typed >= fullLen) return;
    tickRef.current = window.setTimeout(() => setTyped((t) => t + 1), charDelay);
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    };
  }, [typed, fullLen, charDelay, current, shown]);

  // auto-advance — only when in AUTO mode
  useEffect(() => {
    if (mode !== "auto") return;
    if (!lineDone) return;
    if (isLast) {
      onComplete?.();
      return;
    }
    advanceRef.current = window.setTimeout(() => {
      setShown((s) => s + 1);
      setTyped(0);
    }, pauseAfter);
    return () => {
      if (advanceRef.current) window.clearTimeout(advanceRef.current);
    };
  }, [lineDone, isLast, mode, pauseAfter, onComplete, shown]);

  // auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown, typed]);

  const advance = () => {
    if (!lineDone) {
      // finish typing the current line instantly
      if (tickRef.current) window.clearTimeout(tickRef.current);
      setTyped(fullLen);
      return;
    }
    if (!isLast) {
      if (advanceRef.current) window.clearTimeout(advanceRef.current);
      setShown((s) => s + 1);
      setTyped(0);
    } else {
      onComplete?.();
    }
  };

  const skipAll = () => {
    if (tickRef.current) window.clearTimeout(tickRef.current);
    if (advanceRef.current) window.clearTimeout(advanceRef.current);
    setShown(lines.length);
    setTyped(lines[lines.length - 1].text.length);
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore when typing in inputs
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        advance();
      } else if (e.key === "s" || e.key === "S") {
        skipAll();
      } else if (e.key === "m" || e.key === "M") {
        setMode((m) => (m === "auto" ? "manual" : "auto"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, typed, lineDone, isLast]);

  const sceneDone = isLast && lineDone;

  return (
    <div className="space-y-3">
      {/* Dialogue area — tap to advance */}
      <div
        className="space-y-3 cursor-pointer select-none"
        onClick={advance}
        role="button"
        tabIndex={0}
        aria-label="Tap to advance dialogue"
      >
        {lines.slice(0, shown).map((l, k) => {
          const isCurrent = k === shown - 1;
          const text = isCurrent ? l.text.slice(0, typed) : l.text;
          return (
            <DialogueLine
              key={k}
              who={l.who}
              text={text + (isCurrent && !lineDone ? "▌" : "")}
              inner={l.inner}
            />
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Control bar */}
      <div className="border-t-2 border-primary/30 pt-2 space-y-2">
        {/* Mode toggle pills */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex border-2 border-primary overflow-hidden">
            <button
              onClick={() => setMode("auto")}
              className={`pixel text-[9px] px-2 py-1 transition-colors ${
                mode === "auto"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/70 text-primary hover:bg-card"
              }`}
              aria-pressed={mode === "auto"}
              title="Lines advance automatically (M)"
            >
              ▶ AUTO
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`pixel text-[9px] px-2 py-1 border-l-2 border-primary transition-colors ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/70 text-primary hover:bg-card"
              }`}
              aria-pressed={mode === "manual"}
              title="Tap to advance each line (M)"
            >
              ✋ MANUAL
            </button>
          </div>

          <div className="pixel text-[9px] text-primary/80">
            {shown} / {lines.length}
            {sceneDone && <span className="text-accent ml-1">✓ END</span>}
          </div>
        </div>

        {/* Action buttons + hint */}
        <div className="flex items-center justify-between gap-2">
          <span className="pixel text-[8px] text-primary/60 hidden sm:inline">
            ⌨ SPACE/→ advance · S skip · M mode
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={advance}
              disabled={sceneDone}
              className="pixel text-[10px] px-3 py-1 border-2 border-primary bg-card/90 text-primary hover:bg-primary/15 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: sceneDone ? undefined : "2px 2px 0 hsl(0 0% 0%)" }}
              title="Advance one line (Space)"
            >
              {!lineDone ? "⏵ FINISH LINE" : isLast ? "DONE" : "NEXT ▶"}
            </button>
            <button
              onClick={skipAll}
              disabled={sceneDone}
              className="pixel text-[10px] px-3 py-1 border-2 border-accent bg-card/90 text-accent hover:bg-accent/15 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: sceneDone ? undefined : "2px 2px 0 hsl(0 0% 0%)" }}
              title="Skip the rest of the scene (S)"
            >
              SKIP ▶▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneDialogue;
