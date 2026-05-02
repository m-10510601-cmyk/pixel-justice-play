import { useEffect, useRef, useState } from "react";
import DialogueLine from "./DialogueLine";

export interface Line {
  who?: string;
  text: string;
  inner?: boolean;
}

interface Props {
  lines: Line[];
  /** ms per character for the typewriter effect */
  charDelay?: number;
  /** ms to pause after a line finishes typing before auto-advance */
  pauseAfter?: number;
  /** called once every line has been revealed */
  onComplete?: () => void;
  /** reset key — when it changes, the sequence restarts from line 0 */
  resetKey?: string | number;
}

/**
 * Auto-advancing dialogue sequence. NPC speech and player inner monologue
 * appear one line at a time with a typewriter effect. Tap anywhere to skip
 * to the next line, or to reveal the rest of the current line instantly.
 */
const SceneDialogue = ({
  lines,
  charDelay = 28,
  pauseAfter = 900,
  onComplete,
  resetKey,
}: Props) => {
  const [shown, setShown] = useState(1); // how many lines are visible
  const [typed, setTyped] = useState(0); // chars typed of the current line
  const [auto, setAuto] = useState(true);
  const tickRef = useRef<number | null>(null);
  const advanceRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // reset
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

  // auto-advance to next line
  useEffect(() => {
    if (!auto) return;
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
  }, [lineDone, isLast, auto, pauseAfter, onComplete, shown]);

  // auto-scroll latest line into view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown, typed]);

  const handleTap = () => {
    if (!lineDone) {
      // reveal full line immediately
      if (tickRef.current) window.clearTimeout(tickRef.current);
      setTyped(fullLen);
    } else if (!isLast) {
      if (advanceRef.current) window.clearTimeout(advanceRef.current);
      setShown((s) => s + 1);
      setTyped(0);
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3" onClick={handleTap} role="button" tabIndex={0}>
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

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="pixel text-[9px] text-primary/80">
          {shown} / {lines.length} {auto ? "▶ AUTO" : "⏸ MANUAL"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAuto((a) => !a)}
            className="pixel text-[9px] px-2 py-1 border-2 border-primary bg-card/80 text-primary"
          >
            {auto ? "PAUSE" : "AUTO"}
          </button>
          <button
            onClick={() => {
              if (tickRef.current) window.clearTimeout(tickRef.current);
              if (advanceRef.current) window.clearTimeout(advanceRef.current);
              setShown(lines.length);
              setTyped(lines[lines.length - 1].text.length);
            }}
            className="pixel text-[9px] px-2 py-1 border-2 border-accent bg-card/80 text-accent"
          >
            SKIP ▶▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneDialogue;
