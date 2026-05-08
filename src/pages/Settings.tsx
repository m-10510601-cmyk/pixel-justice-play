import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import { useSettings, type Lang, type Theme } from "@/game/SettingsContext";

const Settings = () => {
  const { theme, setTheme, lang, setLang, volume, setVolume, bgmEnabled, setBgmEnabled, t } = useSettings();

  const themes: Theme[] = ["default", "light", "dark"];
  const langs: { id: Lang; label: string }[] = [
    { id: "en", label: "English" },
    { id: "zh", label: "中文" },
    { id: "ms", label: "Bahasa" },
  ];

  return (
    <GameFrame>
      <header className="pt-5 px-5 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-12">{t("nav.settings")}</h1>
      </header>

      <main className="flex-1 px-5 py-4 overflow-y-auto space-y-5">
        <section className="border-2 border-primary p-3 bg-card/90">
          <div className="pixel text-[10px] text-primary mb-2">THEME</div>
          <div className="flex gap-2 flex-wrap">
            {themes.map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={`pixel text-[10px] px-3 py-1 border-2 ${theme === th ? "border-primary bg-primary/25" : "border-primary/40 bg-background/70"}`}
              >
                {th.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="border-2 border-primary p-3 bg-card/90">
          <div className="pixel text-[10px] text-primary mb-2">LANGUAGE</div>
          <div className="flex gap-2 flex-wrap">
            {langs.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`pixel text-[10px] px-3 py-1 border-2 ${lang === l.id ? "border-primary bg-primary/25" : "border-primary/40 bg-background/70"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        <section className="border-2 border-primary p-3 bg-card/90">
          <div className="pixel text-[10px] text-primary mb-2">VOLUME · {volume}</div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
          />
        </section>

        <section className="border-2 border-primary p-3 bg-card/90 flex items-center justify-between">
          <div className="pixel text-[10px] text-primary">BACKGROUND MUSIC</div>
          <button
            onClick={() => setBgmEnabled(!bgmEnabled)}
            className={`pixel text-[10px] px-3 py-1 border-2 ${bgmEnabled ? "border-primary bg-primary/25" : "border-primary/40 bg-background/70"}`}
          >
            {bgmEnabled ? "ON" : "OFF"}
          </button>
        </section>
      </main>
    </GameFrame>
  );
};

export default Settings;
