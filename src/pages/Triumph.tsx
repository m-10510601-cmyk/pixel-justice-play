import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";

const achievements = [
  {
    id: 1,
    name: "FIRST CASE",
    description: "Complete your very first courtroom investigation.",
    done: true,
    icon: "⚖️",
  },
  {
    id: 2,
    name: "SCHOOL HERO",
    description: "Protect the school from a false accusation.",
    done: true,
    icon: "🏫",
  },
  {
    id: 3,
    name: "TRUTH SEEKER",
    description: "Discover hidden evidence during an investigation.",
    done: false,
    icon: "🔍",
  },
  {
    id: 4,
    name: "CITY DEFENDER",
    description: "Win a major case that changes the city’s future.",
    done: false,
    icon: "🛡️",
  },
  {
    id: 5,
    name: "MASTER GUARDIAN",
    description: "Unlock every major achievement in the game.",
    done: false,
    icon: "👑",
  },
];

const Triumph = () => {
  const { t } = useSettings();

  const completed = achievements.filter((a) => a.done).length;
  const progress = (completed / achievements.length) * 100;

  return (
    <GameFrame bgImage={bg}>
      {/* Header */}
      <header className="pt-6 px-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="pixel-btn-square" aria-label="Back">
            ←
          </Link>

          <h1 className="pixel text-glow text-lg text-primary flex-1 text-center pr-12">{t("triumph.title")}</h1>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1">
            <span className="pixel text-[10px] text-primary">COMPLETION</span>

            <span className="pixel text-[10px] text-muted-foreground">
              {completed}/{achievements.length}
            </span>
          </div>

          <div className="pixel-frame h-4 p-[2px] bg-card/90">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {/* Achievement List */}
      <main className="flex-1 px-5 py-6 flex flex-col gap-4 overflow-y-auto">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`
              pixel-frame
              px-4
              py-4
              flex
              items-start
              gap-4
              transition-all
              duration-200
              hover:translate-y-[1px]
              ${a.done ? "bg-card/90" : "bg-black/70"}
            `}
          >
            {/* Icon */}
            <div className="text-xl leading-none mt-[2px]">{a.icon}</div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className={`pixel text-[11px] ${a.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {a.name}
                </h2>

                {/* Status */}
                <span
                  className={`pixel text-[10px] whitespace-nowrap flex items-center gap-1 ${
                    a.done ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span>{a.done ? "★" : "✕"}</span>

                  <span>{a.done ? t("triumph.done") : t("triumph.locked")}</span>
                </span>
              </div>

              {/* Description */}
              <p
                className={`pixel mt-2 text-[9px] leading-relaxed ${
                  a.done ? "text-muted-foreground" : "text-muted-foreground/70"
                }`}
              >
                {a.description}
              </p>
            </div>
          </div>
        ))}
      </main>
    </GameFrame>
  );
};

export default Triumph;
