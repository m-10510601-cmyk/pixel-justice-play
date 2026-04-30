import { Link } from "react-router-dom";
import { useState } from "react";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";

const Settings = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [volume, setVolume] = useState(70);
  const [lang, setLang] = useState<"zh" | "ms" | "en">("en");

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-stretch gap-2">
      <div className="pixel-btn pixel-btn-secondary flex-1 text-xs justify-start" style={{ minWidth: 0 }}>
        {label}
      </div>
      <div className="flex items-stretch gap-2">{children}</div>
    </div>
  );

  return (
    <GameFrame bgImage={bg}>
      {/* TOP */}
      <header className="pt-6 px-5 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back (e)">←</Link>
        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-12">SETTINGS</h1>
      </header>

      {/* MIDDLE */}
      <main className="flex-1 px-5 py-6 flex flex-col gap-4">
        {/* Brightness */}
        <Row label="BRIGHTNESS">
          <button
            onClick={() => setTheme("light")}
            className={`pixel-btn-square ${theme === "light" ? "" : "pixel-btn-secondary"}`}
            aria-pressed={theme === "light"}
          >
            ☀
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`pixel-btn-square ${theme === "dark" ? "" : "pixel-btn-secondary"}`}
            aria-pressed={theme === "dark"}
          >
            ☾
          </button>
        </Row>

        {/* Sound */}
        <Row label="SOUND">
          <button onClick={() => setVolume((v) => Math.max(0, v - 10))} className="pixel-btn-square">−</button>
          <div className="pixel-btn pixel-btn-secondary text-xs px-3" style={{ minWidth: 64 }}>
            {volume}%
          </div>
          <button onClick={() => setVolume((v) => Math.min(100, v + 10))} className="pixel-btn-square">+</button>
        </Row>

        {/* Language */}
        <div className="flex flex-col gap-2">
          <div className="pixel-btn pixel-btn-secondary text-xs justify-start">LANGUAGE</div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "zh", label: "华文" },
              { id: "ms", label: "B. MELAYU" },
              { id: "en", label: "ENGLISH" },
            ] as const).map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`pixel-btn text-[10px] ${lang === l.id ? "" : "pixel-btn-secondary"}`}
                style={{ padding: "0.6rem 0.4rem" }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* BOTTOM */}
      <footer className="pb-6 px-5 flex justify-between gap-3">
        <button className="pixel-btn pixel-btn-secondary text-[10px]">TERMS OF POLICY</button>
        <button className="pixel-btn pixel-btn-secondary text-[10px]">FEEDBACK</button>
      </footer>
    </GameFrame>
  );
};

export default Settings;