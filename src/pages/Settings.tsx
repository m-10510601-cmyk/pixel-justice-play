import { Link } from "react-router-dom";
import { useState } from "react";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import Modal from "@/components/Modal";
import { FeedbackModal } from "@/components/HomeOverlays";
import InboxModal from "@/components/InboxModal";
import { Slider } from "@/components/ui/slider";

const Settings = () => {
  const {
    brightness,
    setBrightness,
    brightnessAuto,
    setBrightnessAuto,
    volume,
    setVolume,
    bgmEnabled,
    setBgmEnabled,
    t,
    playCue,
  } = useSettings();
  const [showTerms, setShowTerms] = useState(false);
  const [showFb, setShowFb] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-stretch gap-2">
      <div className="pixel-btn pixel-btn-secondary flex-1 text-xs justify-start" style={{ minWidth: 0 }}>
        {label}
      </div>
      <div className="flex items-stretch gap-2">{children}</div>
    </div>
  );

  const bumpVol = (delta: number) => {
    setVolume(volume + delta);
    // Cue uses the *new* volume on next render; play one quick beep with current too
    setTimeout(() => playCue(), 0);
  };

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-6 px-5 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back (e)">
          ←
        </Link>
        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-12">{t("settings.title")}</h1>
      </header>

      <main className="flex-1 px-5 py-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-stretch gap-2">
            <div className="pixel-btn pixel-btn-secondary flex-1 text-xs justify-start" style={{ minWidth: 0 }}>
              {t("settings.brightness")}
            </div>
            <button
              onClick={() => {
                setBrightnessAuto(!brightnessAuto);
                playCue();
              }}
              className={`pixel-btn text-[10px] px-3 ${brightnessAuto ? "pixel-btn-active" : "pixel-btn-secondary"}`}
              aria-pressed={brightnessAuto}
              title="Auto follow system"
            >
              {t("settings.auto")}
            </button>
            <div className="pixel-btn pixel-btn-secondary text-xs px-3" style={{ minWidth: 64 }}>
              {brightness}%
            </div>
          </div>
          <div className="pixel-frame px-3 py-3 flex items-center gap-3">
            <span className="pixel text-[10px] text-muted-foreground" aria-hidden>☾</span>
            <Slider
              value={[brightness]}
              min={40}
              max={160}
              step={5}
              disabled={brightnessAuto}
              onValueChange={(v) => setBrightness(v[0] ?? 100)}
              onValueCommit={() => playCue()}
              aria-label="Brightness"
              className={brightnessAuto ? "opacity-50" : ""}
            />
            <span className="pixel text-[10px] text-primary" aria-hidden>☀</span>
          </div>
        </div>

        <Row label={t("settings.sound")}>
          <button onClick={() => bumpVol(-10)} className="pixel-btn-square" aria-label="Decrease volume">
            −
          </button>
          <div className="pixel-btn pixel-btn-secondary text-xs px-3" style={{ minWidth: 64 }}>
            {volume}%
          </div>
          <button onClick={() => bumpVol(+10)} className="pixel-btn-square" aria-label="Increase volume">
            +
          </button>
        </Row>

        <Row label={t("settings.bgm")}>
          <button
            onClick={() => {
              setBgmEnabled(!bgmEnabled);
              playCue();
            }}
            className={`pixel-btn text-xs px-4 ${bgmEnabled ? "pixel-btn-active" : "pixel-btn-secondary"}`}
            aria-pressed={bgmEnabled}
            style={{ minWidth: 96 }}
          >
            {bgmEnabled ? t("settings.on") : t("settings.off")}
          </button>
        </Row>

      </main>

      <footer className="pb-6 px-5 flex justify-between gap-3">
        <button onClick={() => setShowTerms(true)} className="pixel-btn pixel-btn-secondary text-[10px]">
          {t("settings.terms")}
        </button>
        <button onClick={() => setShowFb(true)} className="pixel-btn pixel-btn-secondary text-[10px]">
          {t("settings.feedback")}
        </button>
        <button
          onClick={() => setShowInbox(true)}
          className="pixel-btn pixel-btn-secondary text-[10px] opacity-60"
          aria-label={t("inbox.title")}
          title={t("inbox.title")}
        >
          📥
        </button>
      </footer>

      <Modal open={showTerms} onClose={() => setShowTerms(false)} title={t("terms.title")}>
        <div className="space-y-4 text-[13px] leading-snug">
          <section>
            <h3 className="pixel text-[10px] text-primary mb-1">{t("terms.tos")}</h3>
            <p>{t("terms.tos_body")}</p>
          </section>
          <section>
            <h3 className="pixel text-[10px] text-primary mb-1">{t("terms.privacy")}</h3>
            <p>{t("terms.privacy_body")}</p>
          </section>
          <section>
            <h3 className="pixel text-[10px] text-primary mb-1">{t("terms.ai")}</h3>
            <p>{t("terms.ai_body")}</p>
          </section>
        </div>
      </Modal>
      <FeedbackModal open={showFb} onClose={() => setShowFb(false)} />
      <InboxModal open={showInbox} onClose={() => setShowInbox(false)} />
    </GameFrame>
  );
};

export default Settings;
