import { useEffect, useRef, useState } from "react";
import T from "@/components/T";
import { useSettings } from "@/game/SettingsContext";
import { claimChapterReward, computeStars, type ClaimResult, type EndingTier } from "@/lib/rewards";
import StarBurst from "@/components/story/StarBurst";

type AnyStep = { kind: string; key?: string; options?: { id: string; best?: boolean }[] };

type Props = {
  slug: string;
  story: AnyStep[];
  answers: Record<string, string>;
  ending: EndingTier;
};

const StarReward = ({ slug, story, answers, ending }: Props) => {
  const { addCoins, addXp, playCue, t, level, levelName, xp, xpToNext, pendingQuiz } = useSettings();
  const breakdown = computeStars(story, answers, ending);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const xpGain = breakdown.total * 10;
  const [burst, setBurst] = useState(true);

  // Snapshot pre-claim XP so we can animate from old → new on this completion screen.
  const startXpRef = useRef<number>(xp);
  const startXp = startXpRef.current;
  const need = xpToNext || 1;
  const targetXp = Math.min(need, startXp + xpGain);
  const [displayXp, setDisplayXp] = useState(startXp);

  useEffect(() => {
    setResult(claimChapterReward(slug, breakdown.total, addCoins));
    addXp(xpGain);
    playCue();
    // claim once per mount of completion screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, breakdown.total]);

  // Tween the displayed XP from startXp → targetXp over ~1.2s
  useEffect(() => {
    const duration = 1200;
    const startedAt = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayXp(Math.round(startXp + (targetXp - startXp) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startXp, targetXp]);

  const pct = Math.min(100, Math.round((displayXp / need) * 100));
  const isFull = displayXp >= need;

  return (
    <div className="bg-accent/10 border-2 border-accent p-3 space-y-2">
      {burst && <StarBurst count={breakdown.total} onDone={() => setBurst(false)} />}
      <div className="pixel text-[10px] text-accent">⭐ <T>Stars Earned</T></div>
      <div className="text-sm space-y-1">
        <div>
          <T>Ending bonus</T>: <span className="pixel text-primary">⭐ {breakdown.base}</span>
        </div>
        <div>
          <T>Best decisions</T>: <span className="pixel text-primary">{breakdown.bestCount} / {breakdown.totalChoices}</span> · <span className="pixel text-primary">⭐ {breakdown.bestCount}</span>
        </div>
        {breakdown.perfectBonus > 0 && (
          <div>
            🏆 <T>Perfect run bonus</T>: <span className="pixel text-primary">⭐ {breakdown.perfectBonus}</span>
          </div>
        )}
        <div className="pixel text-xs text-primary mt-2">
          <T>Total this run</T>: ⭐ {breakdown.total}
        </div>
      </div>

      {/* XP settlement block */}
      <div className="mt-2 pt-2 border-t-2 border-accent/40 space-y-1.5">
        <div className="flex items-center justify-between pixel text-[10px]">
          <span className="text-accent">⚡ {t("reward.xpGained")}</span>
          <span className="text-primary">+{xpGain} XP</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="pixel text-primary">LV {level} · {levelName}</span>
          <span className="pixel text-muted-foreground">{displayXp} / {need}</span>
        </div>
        <div className={`w-full h-2 bg-black/60 border border-accent/40 overflow-hidden ${isFull ? "animate-pulse" : ""}`}>
          <div
            className="h-full transition-[width] duration-100 ease-out"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, hsl(48 100% 60%), hsl(36 100% 55%))",
            }}
          />
        </div>
        {(pendingQuiz || isFull) && (
          <div className="pixel text-[9px] text-accent text-center pt-1">{t("quiz.ready")}</div>
        )}
      </div>

      {result && (
        <div className="pixel text-[10px] mt-2 pt-2 border-t-2 border-accent/40">
          {result.firstTime ? (
            <span className="text-accent">✨ <T>First clear! Awarded</T> +⭐ {result.delta}</span>
          ) : result.isImprovement ? (
            <span className="text-accent">📈 <T>New best! Awarded</T> +⭐ {result.delta} (<T>was</T> ⭐ {result.previousBest})</span>
          ) : (
            <span className="text-muted-foreground">🔁 <T>Best so far</T>: ⭐ {result.previousBest} · <T>Beat it for more stars!</T></span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarReward;
