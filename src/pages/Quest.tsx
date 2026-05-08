import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GameFrame from "@/components/GameFrame";
import justiceBg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import { TutorialModal } from "@/components/HomeOverlays";
import { loadProgress } from "@/lib/progress";
import T from "@/components/T";
import { CHAPTERS, isChapterUnlocked, computeMaxStars } from "@/lib/chapters";
import { getChapterBest } from "@/lib/rewards";

const Quest = () => {
  const { t, tutorialSeen, markTutorialSeen } = useSettings();
  const [showTut, setShowTut] = useState(false);
  useEffect(() => { if (!tutorialSeen) setShowTut(true); }, [tutorialSeen]);
  const slugFromRoute = (r: string) => r.replace("/story/", "");
  const progressFor = (route: string) => loadProgress(slugFromRoute(route));
  return (
    <GameFrame bgImage={justiceBg}>
      <header className="pt-6 px-6 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg sm:text-xl text-primary flex-1 text-center pr-12">
          {t("quest.title")}
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-3 px-6 py-4 overflow-y-auto">
        {CHAPTERS.map((c, i) => (
          (() => {
          const p = progressFor(c.to);
          const pct = p ? Math.round((p.i / Math.max(1, p.total)) * 100) : 0;
          const unlocked = isChapterUnlocked(i);
          const prev = i > 0 ? CHAPTERS[i - 1] : null;
          const needStars = prev ? Math.floor(computeMaxStars(prev.story) / 2) + 1 : 0;
          if (!unlocked) {
            const haveStars = prev ? getChapterBest(prev.slug) : 0;
            const prevMax = prev ? computeMaxStars(prev.story) : 0;
            const progressPct = needStars > 0 ? Math.min(100, Math.round((haveStars / needStars) * 100)) : 0;
            return (
              <div
                key={c.to}
                className="pixel-btn text-left text-sm border-accent relative opacity-50 cursor-not-allowed"
                style={{ display: "block" }}
                aria-disabled="true"
              >
                <div className="text-[10px] opacity-80">🔒 <T>{c.chapter}</T></div>
                <div className="text-base mt-1"><T>{c.title}</T></div>
                <div className="text-[10px] opacity-80 mt-1">
                  <T>{`Unlock: earn ${needStars}★ in ${prev?.chapter}`}</T>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 border border-primary/60 bg-background/60">
                    <div className="h-full bg-accent" style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className="text-[10px] pixel text-accent whitespace-nowrap">
                    {haveStars}★ / {needStars}★
                  </div>
                </div>
                <div className="text-[9px] opacity-70 mt-1">
                  <T>{`(max ${prevMax}★ in ${prev?.chapter})`}</T>
                </div>
              </div>
            );
          }
          return (
          <Link
            key={c.to}
            to={c.to}
            className="pixel-btn text-left text-sm border-accent relative"
            style={{ display: "block" }}
          >
            {!tutorialSeen && i === 0 && (
              <span
                className="absolute -top-3 -right-2 pixel float-bob text-[14px] z-20 pixel-text"
                style={{ color: "hsl(48 100% 65%)" }}
                aria-hidden="true"
              >!</span>
            )}
            <div className="text-[10px] opacity-80">★ <T>{c.chapter}</T></div>
            <div className="text-base mt-1"><T>{c.title}</T></div>
            <div className="text-[10px] opacity-80 mt-1"><T>{c.tag}</T></div>
            {p && (
              <div className="mt-2">
                <div className="h-1.5 border border-primary/60 bg-background/60">
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[9px] opacity-80 mt-1">▶ <T>CONTINUE</T> · {pct}%</div>
              </div>
            )}
          </Link>
          );
          })()
        ))}
      </main>

      <TutorialModal open={showTut} onClose={() => { markTutorialSeen(); setShowTut(false); }} />
    </GameFrame>
  );
};

export default Quest;
