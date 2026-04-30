import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";

const Index = () => {
  return (
    <GameFrame bgImage={bg}>
      {/* TOP */}
      <header className="pt-8 px-6 text-center animate-float">
        <h1 className="pixel text-glow text-2xl sm:text-3xl text-primary mb-3">
          LAW GUARDIAN
        </h1>
        <p className="text-foreground/95 text-base sm:text-lg max-w-[90%] mx-auto leading-snug bg-background/60 px-3 py-2 border-2 border-primary/60">
          Defend justice across school halls and city streets. Solve cases, learn the law, become a true Law Guardian.
        </p>
      </header>

      {/* MIDDLE — Start (a) */}
      <main className="flex-1 flex items-center justify-center px-6">
        <Link to="/quest" className="pixel-btn w-56 text-base animate-blink" aria-label="Start (a)">
          ▶ START
        </Link>
      </main>

      {/* BOTTOM — b / c / d */}
      <footer className="pb-8 px-6 flex items-end justify-between">
        <Link to="/triumph" className="pixel-btn-circle" aria-label="Triumph (b)">
          🏆<span>TRIUMPH</span>
        </Link>
        <Link to="/settings" className="pixel-btn-circle" aria-label="Settings (c)">
          ⚙<span>SETTINGS</span>
        </Link>
        <Link to="/store" className="pixel-btn-circle" aria-label="Store (d)">
          🛒<span>STORE</span>
        </Link>
      </footer>
    </GameFrame>
  );
};

export default Index;
