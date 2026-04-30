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
      {/* Safe-zone wrapper keeps everything inside the ornate stone frame */}
      <div className="absolute inset-0 z-10 flex flex-col px-6 pt-6 pb-6">
        {/* === TOP HUD: split into two corner clusters with safe padding === */}
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* Top-left: coins + level */}
          <div className="hud-bar rounded-md px-3 py-2 flex items-center gap-2 shrink-0">
            <div className="pixel text-[10px] text-primary flex items-center gap-1">
              <span className="text-base leading-none">⭐</span>
              <span>{coins}</span>
            </div>
            <div className="pixel text-[8px] px-2 py-1 rounded bg-accent/20 border border-accent/60 text-accent">
              LV 1
            </div>
          </div>

          {/* Top-right: three square icons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setOpenDaily(true)}
              className={`pixel-btn-square ${dailyAvailableDay > 0 ? "pulse-glow" : ""}`}
              style={{ width: 34, height: 34, fontSize: 14 }}
              aria-label="Daily Check-in"
              title="Daily Check-in"
            >🎁</button>
            <button
              onClick={() => setOpenSave(true)}
              className="pixel-btn-square"
              style={{ width: 34, height: 34, fontSize: 14 }}
              aria-label="Cloud Save"
              title="Cloud Save"
            >☁</button>
            <button
              onClick={() => setOpenFeedback(true)}
              className="pixel-btn-square"
              style={{ width: 34, height: 34, fontSize: 14 }}
              aria-label="Feedback"
              title="Feedback"
            >✉</button>
          </div>
        </div>

        {/* === TITLE + DESCRIPTION (clear gap below HUD) === */}
        <header className="text-center animate-float space-y-3">
          <h1 className="pixel text-glow text-2xl sm:text-3xl leading-tight px-2">
            {t("app.title")}
          </h1>
          <p className="text-foreground text-sm sm:text-base max-w-[92%] mx-auto leading-snug bg-background/85 px-3 py-2 border-2 border-primary/60 rounded-sm">
            {t("home.tagline")}
          </p>
        </header>

        {/* === CENTER STACK: START in middle, SHARE between START & footer === */}
        <div className="flex-1 flex flex-col items-center justify-evenly py-4 min-h-0">
          <Link to="/quest" className="pixel-btn btn-corners w-56 text-base animate-blink" aria-label="Start">
            {t("btn.start")}
          </Link>
          <button onClick={() => setOpenShare(true)} className="pixel-btn pixel-btn-secondary text-[10px] px-4">
            🔗 SHARE
          </button>
        </div>

        {/* === BOTTOM CIRCLE MENU: aligned, padded, smaller text === */}
        <footer className="flex items-center justify-around gap-3 pt-2">
          <Link to="/triumph" className="pixel-btn-circle" aria-label="Triumph" style={{ width: 70, height: 70, fontSize: 8 }}>
            <span className="text-lg leading-none">🏆</span>
            <span className="mt-1">{t("nav.triumph")}</span>
          </Link>
          <Link to="/settings" className="pixel-btn-circle" aria-label="Settings" style={{ width: 70, height: 70, fontSize: 8 }}>
            <span className="text-lg leading-none">⚙</span>
            <span className="mt-1">{t("nav.settings")}</span>
          </Link>
          <Link to="/store" className="pixel-btn-circle" aria-label="Store" style={{ width: 70, height: 70, fontSize: 8 }}>
            <span className="text-lg leading-none">🛒</span>
            <span className="mt-1">{t("nav.store")}</span>
          </Link>
        </footer>
      </div>

      <DailyRewardsModal open={openDaily} onClose={() => setOpenDaily(false)} />
      <ShareModal open={openShare} onClose={() => setOpenShare(false)} />
      <SaveLoadModal open={openSave} onClose={() => setOpenSave(false)} />
      <FeedbackModal open={openFeedback} onClose={() => setOpenFeedback(false)} />
    </GameFrame>
  );
};

export default Index;
