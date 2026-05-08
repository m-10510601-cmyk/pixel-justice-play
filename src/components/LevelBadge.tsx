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
      className="pixel text-[8px] px-2 py-1 rounded bg-black/40 border-2 border-black text-[hsl(48_100%_75%)] pixel-text flex flex-col items-start gap-0.5 min-w-[88px] hover:bg-black/60 hover:border-accent transition-colors cursor-pointer text-left"
      aria-label="Level details"
    >
      <div className="flex items-center gap-1 leading-none">
        <span>LV {level}</span>
        {pendingQuiz && <span className="text-accent">!</span>}
      </div>
      <div className="text-[7px] opacity-90 leading-none truncate max-w-[80px]">{levelName}</div>
      <div className="w-full h-1 bg-black/60 mt-0.5">
        <div className="h-full bg-[hsl(48_100%_60%)]" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[7px] opacity-80 leading-none">
        {isMax ? "MAX" : `${xp}/${xpToNext} XP`}
      </div>
    </button>
  );
};

export default LevelBadge;