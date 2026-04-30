import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings, Lang } from "@/game/SettingsContext";

const Settings = () => {
  const { theme, setTheme, volume, setVolume, lang, setLang, t, playCue } = useSettings();

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
        <Link to="/" className="pixel-btn-square" aria-label="Back (e)">←</Link>
        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-12">{t("settings.title")}</h1>
      </header>

      <main className="flex-1 px-5 py-6 flex flex-col gap-4">
        <Row label={t("settings.brightness")}>
          <button
            onClick={() => setTheme(theme === "light" ? "default" : "light")}
            className={`pixel-btn-square ${theme === "light" ? "pixel-btn-active" : "pixel-btn-secondary"}`}
            aria-pressed={theme === "light"}
            title="Light"
          >☀</button>
          <button
            onClick={() => setTheme(theme === "dark" ? "default" : "dark")}
            className={`pixel-btn-square ${theme === "dark" ? "pixel-btn-active" : "pixel-btn-secondary"}`}
            aria-pressed={theme === "dark"}
            title="Dark"
          >☾</button>
        </Row>

        <Row label={t("settings.sound")}>
          <button onClick={() => bumpVol(-10)} className="pixel-btn-square" aria-label="Decrease volume">−</button>
          <div className="pixel-btn pixel-btn-secondary text-xs px-3" style={{ minWidth: 64 }}>
            {volume}%
          </div>
          <button onClick={() => bumpVol(+10)} className="pixel-btn-square" aria-label="Increase volume">+</button>
        </Row>

        <div className="flex flex-col gap-2">
          <div className="pixel-btn pixel-btn-secondary text-xs justify-start">{t("settings.language")}</div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "zh", label: t("lang.zh") },
              { id: "ms", label: t("lang.ms") },
              { id: "en", label: t("lang.en") },
            ] as { id: Lang; label: string }[]).map((l) => (
              <button
                key={l.id}
                onClick={() => { setLang(l.id); playCue(); }}
                className={`pixel-btn text-[10px] ${lang === l.id ? "pixel-btn-active" : "pixel-btn-secondary"}`}
                style={{ padding: "0.6rem 0.4rem" }}
                aria-pressed={lang === l.id}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="pb-6 px-5 flex justify-between gap-3">
        <button className="pixel-btn pixel-btn-secondary text-[10px]">{t("settings.terms")}</button>
        <button className="pixel-btn pixel-btn-secondary text-[10px]">{t("settings.feedback")}</button>
      </footer>
    </GameFrame>
  );
};

export default Settings;
