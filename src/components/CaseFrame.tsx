import { ReactNode } from "react";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import justiceBg from "@/assets/justice-bg.jpg";

interface Props {
  title: string;
  step: number; // 1..5
  back?: string;
  children: ReactNode;
}

const STEPS = ["BRIEF", "EVIDENCE", "LAW", "VERDICT", "RESULT"];

const CaseFrame = ({ title, step, back, children }: Props) => {
  return (
    <GameFrame bgImage={justiceBg}>
      <header className="pt-5 px-5 flex items-center gap-3">
        {back ? (
          <Link to={back} className="pixel-btn-square" aria-label="Back">←</Link>
        ) : (
          <span className="w-12" />
        )}
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          {title}
        </h1>
      </header>

      <div className="px-5 pt-3 flex gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-2 border-2 border-primary/70 ${
              i + 1 <= step ? "bg-primary" : "bg-background/60"
            }`}
            aria-label={`Step ${i + 1} ${s}`}
          />
        ))}
      </div>
      <div className="px-5 pt-1 flex justify-between text-[9px] pixel text-primary/90">
        {STEPS.map((s, i) => (
          <span key={s} className={i + 1 === step ? "text-glow" : "opacity-60"}>{s}</span>
        ))}
      </div>

      <main className="flex-1 px-5 py-4 overflow-y-auto">{children}</main>
    </GameFrame>
  );
};

export default CaseFrame;