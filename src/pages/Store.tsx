import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";

type Item = {
  id: string;
  name: string;
  price: number;
  icon: string;
  desc: string;
};

const items: Item[] = [
  { id: "gavel", name: "GAVEL +1", price: 50, icon: "🔨", desc: "Increases judgment power slightly" },
  { id: "book", name: "LAW BOOK", price: 120, icon: "📕", desc: "Boosts case accuracy" },
  { id: "badge", name: "BADGE", price: 200, icon: "🛡", desc: "Improves defense score" },
  { id: "scroll", name: "SCROLL", price: 80, icon: "📜", desc: "Unlocks hidden hints" },
  { id: "scales", name: "SCALES", price: 350, icon: "⚖", desc: "Balances verdict fairness" },
  { id: "robe", name: "ROBE", price: 500, icon: "👘", desc: "Max authority boost" },
];

const TIME_EXTENSION_PRICE = 150;

const Store = () => {
  const { t, coins, spendCoins, timeExtensions, buyTimeExtension, playCue, addItem } = useSettings();
  const [msg, setMsg] = useState<string>("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = (text: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setMsg(text);
    timeoutRef.current = setTimeout(() => setMsg(""), 1500);
  };

  const buy = (it: Item) => {
    const success = spendCoins(it.price);

    if (success) {
      addItem(it.id as any, 1);
      showMsg(`✓ ${it.name}`);
      playCue();
    } else {
      showMsg(t("store.not_enough"));
    }
  };

  const buyExt = () => {
    const success = buyTimeExtension();

    if (success) {
      showMsg(`✓ ${t("store.time_ext")}`);
      playCue();
    } else {
      showMsg(t("store.not_enough"));
    }
  };

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-6 px-5 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">
          ←
        </Link>

        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-4">{t("store.title")}</h1>

        <div className="pixel text-xs text-primary bg-background/70 border-2 border-primary px-2 py-1">⭐ {coins}</div>
      </header>

      <main className="flex-1 px-5 py-4 grid grid-cols-2 gap-3 overflow-y-auto">
        {/* Featured: Time Extension */}
        <div className="col-span-2 pixel-frame p-3 flex items-center gap-3 bg-card/90">
          <div className="text-4xl">⏱</div>

          <div className="flex-1">
            <div className="pixel text-[10px] text-primary">{t("store.time_ext")}</div>

            <div className="pixel text-[8px] text-muted-foreground mt-1">
              {t("store.owned")}: {timeExtensions}
            </div>
          </div>

          <button onClick={buyExt} className="pixel-btn text-[10px]" style={{ padding: "0.5rem 0.75rem" }}>
            ⭐ {TIME_EXTENSION_PRICE}
          </button>
        </div>

        {/* Items */}
        {items.map((it) => (
          <div key={it.id} className="pixel-frame p-3 flex flex-col items-center gap-2 bg-card/90">
            <div className="text-4xl">{it.icon}</div>

            <div className="pixel text-[10px] text-primary text-center">{it.name}</div>

            <div className="pixel text-[8px] text-muted-foreground text-center leading-tight px-1">{it.desc}</div>

            <button
              onClick={() => buy(it)}
              className="pixel-btn text-[10px] w-full"
              style={{ padding: "0.5rem" }}
              disabled={coins < it.price}
            >
              ⭐ {it.price}
            </button>
          </div>
        ))}
      </main>

      {msg && <div className="px-5 pb-4 pixel text-[10px] text-center text-accent">{msg}</div>}
    </GameFrame>
  );
};

export default Store;
