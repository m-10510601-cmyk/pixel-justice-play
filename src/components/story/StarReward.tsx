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
  const { addCoins, addXp, playCue, t, level, levelName, xp, xpToNext, pendingQuiz, getXpMultiplierForCase, getArmedItem } = useSettings();
  const baseBreakdown = computeStars(story, answers, ending);
  const armedRef = useRef(getArmedItem(slug));
  const gavelBonus = armedRef.current === "gavel" ? 1 : 0;
  // BADGE: forgive one wrong answer (cap at totalChoices); restore perfect bonus if it now applies.
  const badgeActive = armedRef.current === "badge";
  const forgivenBest = badgeActive
    ? Math.min(baseBreakdown.totalChoices, baseBreakdown.bestCount + 1)
    : baseBreakdown.bestCount;
  const newPerfectBonus =
    baseBreakdown.totalChoices > 0 && forgivenBest === baseBreakdown.totalChoices ? 2 : 0;
  const badgeBonus = badgeActive
    ? (forgivenBest - baseBreakdown.bestCount) + (newPerfectBonus - baseBreakdown.perfectBonus)
    : 0;
  const breakdown = {
    ...baseBreakdown,
    bestCount: forgivenBest,
    perfectBonus: newPerfectBonus,
    total: baseBreakdown.base + forgivenBest + newPerfectBonus + gavelBonus,
  };
  const [result, setResult] = useState<ClaimResult | null>(null);
  const baseXp = breakdown.total * 10;
  const multRef = useRef(getXpMultiplierForCase(slug));
  const mult = multRef.current;
  const xpGain = Math.round(baseXp * mult.total);
  const [burst, setBurst] = useState(true);

  // Snapshot pre-claim XP so we can animate from old → new on this completion screen.
  const startXpRef = useRef<number>(xp);
  const startXp = startXpRef.current;
  const need = xpToNext || 1;
  const targetXp = Math.min(need, startXp + xpGain);
  const [displayXp, setDisplayXp] = useState(startXp);

  useEffect(() => {
    const r = claimChapterReward(slug, breakdown.total, addCoins);
    setResult(r);
    addXp(xpGain, r.firstTime ? "chapter" : "replay");
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
        {badgeBonus > 0 && (
          <div>
            🛡 <T>Badge forgive</T>: <span className="pixel text-primary">⭐ +{badgeBonus}</span>
          </div>
        )}
        {gavelBonus > 0 && (
          <div>
            🎁 <T>Gavel bonus</T>: <span className="pixel text-primary">⭐ {gavelBonus}</span>
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
        {(mult.time < 1 || mult.item > 1) && (
          <div className="flex items-center justify-end gap-2 pixel text-[8px] text-muted-foreground">
            <span>base {baseXp}</span>
            {mult.time < 1 && <span className="text-destructive">⏱ ×{mult.time.toFixed(2)}</span>}
            {mult.item > 1 && <span className="text-accent">⚖ ×{mult.item.toFixed(1)}</span>}
          </div>
        )}
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
