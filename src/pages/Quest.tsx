import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import schoolBg from "@/assets/school-bg.jpg";
import societyBg from "@/assets/society-bg.jpg";
import justiceBg from "@/assets/justice-bg.jpg";

const Quest = () => {
  return (
    <GameFrame bgImage={justiceBg}>
      <header className="pt-6 px-6 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg sm:text-xl text-primary flex-1 text-center pr-12">
          CHOOSE YOUR QUEST
        </h1>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-6 px-6">
        <Link
          to="/quest/school"
          className="pixel-btn relative h-32 overflow-hidden text-lg"
          style={{ padding: 0 }}
        >
          <img src={schoolBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <span className="relative z-10 bg-background/70 px-4 py-2 border-2 border-primary">1. SCHOOL LIFE</span>
        </Link>

        <Link
          to="/quest/society"
          className="pixel-btn relative h-32 overflow-hidden text-lg"
          style={{ padding: 0 }}
        >
          <img src={societyBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <span className="relative z-10 bg-background/70 px-4 py-2 border-2 border-primary">2. SOCIETY LIFE</span>
        </Link>
      </main>

      <div className="pb-6" />
    </GameFrame>
  );
};

export default Quest;