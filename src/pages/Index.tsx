import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import {
  DailyRewardsModal,
  ShareModal,
  SaveLoadModal,
  FeedbackModal,
} from "@/components/HomeOverlays";

const Index = () => {
  const { t, coins, agreedTerms, dailyAvailableDay } = useSettings();
  const [openDaily, setOpenDaily] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);

  // Auto-open daily rewards once after agreeing to terms, when an unclaimed day is available.
  useEffect(() => {
    if (agreedTerms && dailyAvailableDay > 0) {
      const k = "lawguardian.daily.opened." + new Date().toISOString().slice(0, 10);
      if (!sessionStorage.getItem(k)) {
        sessionStorage.setItem(k, "1");
        setOpenDaily(true);
      }
    }
  }, [agreedTerms, dailyAvailableDay]);

  return (
    <GameFrame bgImage={bg}>
      {/* Top bar: coins + cloud + feedback */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between px-2">
        <div className="pixel text-[10px] text-primary bg-background/80 border-2 border-primary px-2 py-1">
          ⭐ {t("home.coins")}: {coins}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenSave(true)}
            className="pixel-btn-square"
            style={{ width: 36, height: 36, fontSize: 14 }}
            aria-label="Cloud Save"
            title="Cloud Save"
          >☁</button>
          <button
            onClick={() => setOpenFeedback(true)}
            className="pixel-btn-square"
            style={{ width: 36, height: 36, fontSize: 14 }}
            aria-label="Feedback"
            title="Feedback"
          >✉</button>
        </div>
      </div>

      <header className="pt-14 px-6 text-center animate-float">
        <h1 className="pixel text-glow text-2xl sm:text-3xl text-primary mb-3">
          {t("app.title")}
        </h1>
        <p className="text-foreground/95 text-sm sm:text-base max-w-[90%] mx-auto leading-snug bg-background/60 px-3 py-2 border-2 border-primary/60">
          {t("home.tagline")}
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <Link to="/quest" className="pixel-btn w-56 text-base animate-blink" aria-label="Start">
          {t("btn.start")}
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenDaily(true)}
            className={`pixel-btn pixel-btn-secondary text-[10px] ${dailyAvailableDay > 0 ? "ring-2 ring-accent" : ""}`}
          >
            🎁 DAILY {dailyAvailableDay > 0 ? "●" : ""}
          </button>
          <button onClick={() => setOpenShare(true)} className="pixel-btn pixel-btn-secondary text-[10px]">
            🔗 SHARE
          </button>
        </div>
      </main>

      <footer className="pb-8 px-6 flex items-end justify-between">
        <Link to="/triumph" className="pixel-btn-circle" aria-label="Triumph">
          🏆<span>{t("nav.triumph")}</span>
        </Link>
        <Link to="/settings" className="pixel-btn-circle" aria-label="Settings">
          ⚙<span>{t("nav.settings")}</span>
        </Link>
        <Link to="/store" className="pixel-btn-circle" aria-label="Store">
          🛒<span>{t("nav.store")}</span>
        </Link>
      </footer>

      <DailyRewardsModal open={openDaily} onClose={() => setOpenDaily(false)} />
      <ShareModal open={openShare} onClose={() => setOpenShare(false)} />
      <SaveLoadModal open={openSave} onClose={() => setOpenSave(false)} />
      <FeedbackModal open={openFeedback} onClose={() => setOpenFeedback(false)} />
    </GameFrame>
  );
};

export default Index;
