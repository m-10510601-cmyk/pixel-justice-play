import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";

const achievements = [
  { name: "FIRST CASE", done: true },
  { name: "SCHOOL HERO", done: true },
  { name: "TRUTH SEEKER", done: false },
  { name: "CITY DEFENDER", done: false },
  { name: "MASTER GUARDIAN", done: false },
];

const Triumph = () => {
  return (
    <GameFrame bgImage={bg}>
      <header className="pt-6 px-5 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-12">TRIUMPH</h1>
      </header>

      <main className="flex-1 px-5 py-6 flex flex-col gap-3 overflow-y-auto">
        {achievements.map((a) => (
          <div
            key={a.name}
            className="pixel-frame px-4 py-3 flex items-center justify-between bg-card/90"
          >
            <span className="pixel text-[11px] text-foreground">{a.name}</span>
            <span className={`pixel text-[10px] ${a.done ? "text-primary" : "text-muted-foreground"}`}>
              {a.done ? "★ DONE" : "✕ LOCKED"}
            </span>
          </div>
        ))}
      </main>
    </GameFrame>
  );
};

export default Triumph;