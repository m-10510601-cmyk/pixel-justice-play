import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";

const items = [
  { name: "GAVEL +1", price: 50, icon: "🔨" },
  { name: "LAW BOOK", price: 120, icon: "📕" },
  { name: "BADGE", price: 200, icon: "🛡" },
  { name: "SCROLL", price: 80, icon: "📜" },
  { name: "SCALES", price: 350, icon: "⚖" },
  { name: "ROBE", price: 500, icon: "👘" },
];

const Store = () => {
  const { t } = useSettings();
  return (
    <GameFrame bgImage={bg}>
      <header className="pt-6 px-5 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-4">{t("store.title")}</h1>
        <div className="pixel text-xs text-primary bg-background/70 border-2 border-primary px-2 py-1">⭐ 240</div>
      </header>

      <main className="flex-1 px-5 py-6 grid grid-cols-2 gap-3 overflow-y-auto">
        {items.map((it) => (
          <div key={it.name} className="pixel-frame p-3 flex flex-col items-center gap-2 bg-card/90">
            <div className="text-4xl">{it.icon}</div>
            <div className="pixel text-[10px] text-primary">{it.name}</div>
            <button className="pixel-btn text-[10px] w-full" style={{ padding: "0.5rem" }}>⭐ {it.price}</button>
          </div>
        ))}
      </main>
    </GameFrame>
  );
};

export default Store;
