import { useEffect, useState } from "react";
import T from "@/components/T";
import { useSettings } from "@/game/SettingsContext";
import { claimChapterReward, computeStars, type ClaimResult, type EndingTier } from "@/lib/rewards";

type AnyStep = { kind: string; key?: string; options?: { id: string; best?: boolean }[] };

type Props = {
  slug: string;
  story: AnyStep[];
  answers: Record<string, string>;
  ending: EndingTier;
};

const StarReward = ({ slug, story, answers, ending }: Props) => {
  const { addCoins } = useSettings();
  const breakdown = computeStars(story, answers, ending);
  const [result, setResult] = useState<ClaimResult | null>(null);

  useEffect(() => {
    setResult(claimChapterReward(slug, breakdown.total, addCoins));
    // claim once per mount of completion screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, breakdown.total]);

  return (
    <div className="bg-accent/10 border-2 border-accent p-3 space-y-2">
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
