import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import AvatarBadge from "@/components/AvatarBadge";
import { getLastPlayed, type LastPlayed } from "@/lib/progress";
import { DailyRewardsModal, ShareModal, SaveLoadModal, FeedbackModal } from "@/components/HomeOverlays";
import LevelBadge from "@/components/LevelBadge";
import LevelUpQuizModal from "@/components/LevelUpQuizModal";
import LevelDetailsModal from "@/components/LevelDetailsModal";
import AvatarPickerModal from "@/components/AvatarPickerModal";
import AvatarDetailsModal from "@/components/AvatarDetailsModal";

const Index = () => {
  const { t, coins, agreedTerms, dailyAvailableDay } = useSettings();
  const [openDaily, setOpenDaily] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [openAvatarDetails, setOpenAvatarDetails] = useState(false);
  const [lastPlayed, setLast] = useState<LastPlayed | null>(null);

  useEffect(() => {
    setLast(getLastPlayed());
  }, []);

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
          {/* Top-left: avatar + coins + level */}
          <div className="hud-bar-purple rounded-sm px-3 py-1.5 flex items-center gap-2 shrink-0">
            <AvatarBadge size={32} onClick={() => setOpenAvatarDetails(true)} />
            <div className="pixel text-[10px] text-white pixel-text flex items-center gap-1">
              <span className="coin-spin text-base leading-none">🪙</span>
            </div>
            <LevelBadge onClick={() => setOpenLevel(true)} />
          </div>

          {/* Top-right: three square icons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setOpenDaily(true)}
              className={`pixel-btn-square ${dailyAvailableDay > 0 ? "pulse-glow" : ""}`}
              style={{ width: 34, height: 34, fontSize: 14 }}
              aria-label="Daily Check-in"
              title="Daily Check-in"
            >
              🎁
            </button>
            <button
              onClick={() => setOpenSave(true)}
              className="pixel-btn-square"
              style={{ width: 34, height: 34, fontSize: 14 }}
              aria-label="Cloud Save"
              title="Cloud Save"
            >
              ☁
            </button>
            <button
              onClick={() => setOpenFeedback(true)}
              className="pixel-btn-square"
              style={{ width: 34, height: 34, fontSize: 14 }}
              aria-label="Feedback"
              title="Feedback"
            >
              ✉
            </button>
          </div>
        </div>

        {/* === TITLE + DESCRIPTION (clear gap below HUD) === */}
        <header className="text-center animate-float space-y-3">
          <h1 className="pixel text-glow text-2xl sm:text-3xl leading-tight px-2">{t("app.title")}</h1>
          <p className="banner-purple text-xs sm:text-sm max-w-[92%] mx-auto leading-snug pixel-text pixel">
            {t("home.tagline")}
          </p>
        </header>

        {/* === CENTER STACK: START in middle, SHARE between START & footer === */}
        <div className="flex-1 flex flex-col items-center justify-evenly py-4 min-h-0">
          <Link
            to="/quest"
            className="pixel-btn-start-orange btn-corners btn-rivets dither-shadow burst-host animate-blink"
            aria-label="Start"
          >
            <span className="text-2xl leading-none">▶</span>
            <span>{t("btn.start")}</span>
            <span className="rivet tl" />
            <span className="rivet tr" />
            <span className="rivet bl" />
            <span className="rivet br" />
          </Link>
          {lastPlayed && (
            <Link
              to={lastPlayed.route}
              className="pixel-btn pixel-btn-secondary w-56 text-xs text-center"
              aria-label="Continue last case"
            >
              ▶ CONTINUE
              <div className="text-[9px] opacity-80 mt-1 normal-case">
                {lastPlayed.title} · {Math.round((lastPlayed.i / Math.max(1, lastPlayed.total)) * 100)}%
              </div>
            </Link>
          )}
          <button
            onClick={() => setOpenShare(true)}
            className="pixel-btn pixel-btn-secondary burst-host text-[10px] px-4 pixel-text"
          >
            🔗 SHARE
          </button>
        </div>

        {/* === BOTTOM CIRCLE MENU: aligned, padded, smaller text === */}
        <footer className="flex items-center justify-around gap-3 pt-2">
          <Link
            to="/triumph"
            className="pixel-btn-circle sparkle-host dither-shadow burst-host font-bold text-white relative z-10"
            aria-label="Triumph"
            style={{ width: 70, height: 70, fontSize: 8 }}
          >
            <span className="text-lg leading-none">🏆</span>
            <span className="mt-1 pixel-text">{t("nav.triumph")}</span>
          </Link>
          <Link
            to="/settings"
            className="pixel-btn-circle sparkle-host dither-shadow burst-host font-bold text-white relative z-10"
            aria-label="Settings"
            style={{ width: 70, height: 70, fontSize: 8 }}
          >
            <span className="text-lg leading-none">⚙</span>
            <span className="mt-1 pixel-text">{t("nav.settings")}</span>
          </Link>
          <Link
            to="/store"
            className="pixel-btn-circle sparkle-host dither-shadow burst-host font-bold text-white relative z-10"
            aria-label="Store"
            style={{ width: 70, height: 70, fontSize: 8 }}
          >
            <span className="text-lg leading-none">🏪</span>
            <span className="mt-1 pixel-text">{t("nav.store")}</span>
          </Link>
        </footer>
      </div>

      <DailyRewardsModal open={openDaily} onClose={() => setOpenDaily(false)} />
      <ShareModal open={openShare} onClose={() => setOpenShare(false)} />
      <SaveLoadModal open={openSave} onClose={() => setOpenSave(false)} />
      <FeedbackModal open={openFeedback} onClose={() => setOpenFeedback(false)} />
      <LevelUpQuizModal />
      <LevelDetailsModal open={openLevel} onClose={() => setOpenLevel(false)} />
      <AvatarPickerModal open={openAvatar} onClose={() => setOpenAvatar(false)} />
      <AvatarDetailsModal
        open={openAvatarDetails}
        onClose={() => setOpenAvatarDetails(false)}
        onChange={() => {
          setOpenAvatarDetails(false);
          setOpenAvatar(true);
        }}
      />
    </GameFrame>
  );
};

export default Index;
