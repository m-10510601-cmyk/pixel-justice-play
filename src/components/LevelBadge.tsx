import { useSettings } from "@/game/SettingsContext";

type Props = { onClick?: () => void };

/** Compact HUD badge showing current level, name, and XP progress. Clickable. */
const LevelBadge = ({ onClick }: Props) => {
  const { level, levelName, xp, xpToNext, pendingQuiz } = useSettings();
  const isMax = xpToNext === 0;
  const pct = isMax ? 100 : Math.min(100, Math.round((xp / xpToNext) * 100));
  return (
    <button
      type="button"
      onClick={onClick}
      className="gold-box gold-box-interactive pixel text-[8px] px-2 py-1.5 text-[hsl(48_100%_80%)] pixel-text flex flex-col items-start gap-1 min-w-[92px] cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label="Level details"
    >
      <span aria-hidden className="gb-rivet tl" />
      <span aria-hidden className="gb-rivet tr" />
      <span aria-hidden className="gb-rivet bl" />
      <span aria-hidden className="gb-rivet br" />
      <div className="flex items-center gap-1 leading-none">
        <span className="text-[hsl(var(--gold))]">LV {level}</span>
        {pendingQuiz && <span className="text-accent animate-pulse">!</span>}
      </div>
      <div className="text-[7px] opacity-90 leading-none truncate max-w-[84px]">{levelName}</div>
      <div className="w-full h-1 bg-black/70 border border-[hsl(var(--gold))/30]">
        <div className="h-full bg-[hsl(48_100%_60%)]" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[7px] opacity-80 leading-none">
        {isMax ? "MAX" : `${xp}/${xpToNext} XP`}
      </div>
    </button>
  );
};

export default LevelBadge;