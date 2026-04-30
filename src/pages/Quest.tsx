import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GameFrame from "@/components/GameFrame";
import schoolBg from "@/assets/school-bg.jpg";
import societyBg from "@/assets/society-bg.jpg";
import justiceBg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import { TutorialModal } from "@/components/HomeOverlays";

const Quest = () => {
  const { t, tutorialSeen, markTutorialSeen } = useSettings();
  const [showTut, setShowTut] = useState(false);
  useEffect(() => { if (!tutorialSeen) setShowTut(true); }, [tutorialSeen]);
  return (
    <GameFrame bgImage={justiceBg}>
      <header className="pt-6 px-6 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg sm:text-xl text-primary flex-1 text-center pr-12">
          {t("quest.title")}
        </h1>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-6 px-6">
        {/* Gateway: School Life — split screen preview */}
        <Link
          to="/chapter/school"
          className="pixel-btn btn-corners relative h-36 overflow-hidden text-lg group"
          style={{ padding: 0 }}
          aria-label={t("quest.school")}
        >
          <div className="absolute inset-0 grid grid-cols-2">
            <img src={schoolBg} alt="" aria-hidden className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
            <img src={societyBg} alt="" aria-hidden className="w-full h-full object-cover opacity-30 saturate-50" />
          </div>
          {/* Center divider gate */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-accent to-primary shadow-[0_0_12px_hsl(var(--gold))]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
          <span className="relative z-10 hud-bar px-4 py-2 pixel text-[11px] text-primary text-glow">
            🏫 {t("quest.school")}
          </span>
        </Link>

        {/* Gateway: Society Life — split screen preview */}
        <Link
          to="/chapter/society"
          className="pixel-btn btn-corners relative h-36 overflow-hidden text-lg group"
          style={{ padding: 0 }}
          aria-label={t("quest.society")}
        >
          <div className="absolute inset-0 grid grid-cols-2">
            <img src={schoolBg} alt="" aria-hidden className="w-full h-full object-cover opacity-30 saturate-50" />
            <img src={societyBg} alt="" aria-hidden className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-accent to-primary shadow-[0_0_12px_hsl(var(--gold))]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
          <span className="relative z-10 hud-bar px-4 py-2 pixel text-[11px] text-primary text-glow">
            🏙 {t("quest.society")}
          </span>
        </Link>
      </main>

      <div className="pb-6" />
      <TutorialModal open={showTut} onClose={() => { markTutorialSeen(); setShowTut(false); }} />
    </GameFrame>
  );
};

export default Quest;
