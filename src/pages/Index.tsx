import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";

const Index = () => {
  const { t } = useSettings();
  return (
    <GameFrame bgImage={bg}>
      <header className="pt-8 px-6 text-center animate-float">
        <h1 className="pixel text-glow text-2xl sm:text-3xl text-primary mb-3">
          {t("app.title")}
        </h1>
        <p className="text-foreground/95 text-base sm:text-lg max-w-[90%] mx-auto leading-snug bg-background/60 px-3 py-2 border-2 border-primary/60">
          {t("app.tagline")}
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <Link to="/quest" className="pixel-btn w-56 text-base animate-blink" aria-label="Start (a)">
          {t("btn.start")}
        </Link>
      </main>

      <footer className="pb-8 px-6 flex items-end justify-between">
        <Link to="/triumph" className="pixel-btn-circle" aria-label="Triumph (b)">
          🏆<span>{t("nav.triumph")}</span>
        </Link>
        <Link to="/settings" className="pixel-btn-circle" aria-label="Settings (c)">
          ⚙<span>{t("nav.settings")}</span>
        </Link>
        <Link to="/store" className="pixel-btn-circle" aria-label="Store (d)">
          🛒<span>{t("nav.store")}</span>
        </Link>
      </footer>
    </GameFrame>
  );
};

export default Index;
