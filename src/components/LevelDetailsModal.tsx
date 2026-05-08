import Modal from "@/components/Modal";
import { useSettings } from "@/game/SettingsContext";
import { LEVEL_NAMES, XP_THRESHOLDS } from "@/lib/levels";

const ICONS: Record<number, string> = { 1: "🎓", 2: "🔍", 3: "⚖", 4: "🏛", 5: "👑" };

type Props = { open: boolean; onClose: () => void };

const LevelDetailsModal = ({ open, onClose }: Props) => {
  const { t, level, levelName, xp, xpToNext, pendingQuiz } = useSettings();
  const isMax = xpToNext === 0;
  const pct = isMax ? 100 : Math.min(100, Math.round((xp / xpToNext) * 100));
  const remaining = isMax ? 0 : Math.max(0, xpToNext - xp);

  return (
    <Modal open={open} onClose={onClose} title={t("level.details.title")}>
      <div className="space-y-4 text-sm">
        {/* Current status card */}
        <div className="border-2 border-accent bg-accent/10 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{ICONS[level]}</span>
              <div>
                <div className="pixel text-[10px] text-primary">LV {level}</div>
                <div className="pixel text-[9px] text-accent">{levelName}</div>
              </div>
            </div>
            {pendingQuiz && (
              <span className="pixel text-[8px] text-accent border border-accent px-1 py-0.5 animate-pulse">
                ! QUIZ
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-black/60 border border-accent/40 overflow-hidden">
            <div
              className="h-full transition-[width] duration-300"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, hsl(48 100% 60%), hsl(36 100% 55%))",
              }}
            />
          </div>
          <div className="flex items-center justify-between pixel text-[9px]">
            <span className="text-muted-foreground">
              {isMax ? t("level.maxed") : `${xp} / ${xpToNext} XP`}
            </span>
            {!isMax && (
              <span className="text-primary">
                {t("level.toNext")}: {remaining}
              </span>
            )}
          </div>
          {pendingQuiz && (
            <button
              onClick={onClose}
              className="pixel-btn pixel-btn-primary w-full text-[10px] mt-1"
            >
              ⚖ {t("level.challengeNow")}
            </button>
          )}
        </div>

        {/* Promotion path */}
        <div className="space-y-1.5">
          <div className="pixel text-[10px] text-primary">{t("level.path")}</div>
          {[1, 2, 3, 4, 5].map((lv) => {
            const status =
              lv < level
                ? "done"
                : lv === level
                  ? "current"
                  : "locked";
            const need = XP_THRESHOLDS[lv];
            const badge =
              status === "done"
                ? `✓ ${t("level.statusDone")}`
                : status === "current"
                  ? `◉ ${t("level.statusCurrent")}`
                  : `🔒 ${t("level.statusLocked")}`;
            const badgeColor =
              status === "done"
                ? "text-accent"
                : status === "current"
                  ? "text-primary"
                  : "text-muted-foreground";
            return (
              <div
                key={lv}
                className={`flex items-center justify-between gap-2 p-2 border-2 ${
                  status === "current"
                    ? "border-primary bg-primary/10"
                    : "border-accent/30 bg-accent/5"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg leading-none">{ICONS[lv]}</span>
                  <div className="min-w-0">
                    <div className="pixel text-[9px] text-primary">LV {lv}</div>
                    <div className="pixel text-[8px] truncate">{LEVEL_NAMES[lv]}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`pixel text-[8px] ${badgeColor}`}>{badge}</div>
                  <div className="pixel text-[8px] text-muted-foreground">
                    {need ? `→ ${need} XP` : t("level.maxed")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How to earn */}
        <div className="space-y-1 border-t-2 border-accent/40 pt-2">
          <div className="pixel text-[10px] text-accent">{t("level.howToEarn")}</div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t("level.howBody")}</p>
        </div>
      </div>
    </Modal>
  );
};

export default LevelDetailsModal;