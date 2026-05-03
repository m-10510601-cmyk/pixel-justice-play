import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GameFrame from "@/components/GameFrame";
import justiceBg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import { TutorialModal } from "@/components/HomeOverlays";
import { loadProgress } from "@/lib/progress";

const CASES: { to: string; chapter: string; title: string; tag: string }[] = [
  { to: "/story/silent-fall", chapter: "Chapter X", title: "Silent Fall", tag: "Real-case inspired · multi-ending" },
  { to: "/story/green-trade", chapter: "Chapter Y", title: "The Green Trade", tag: "Campus drug trafficking · syndicate hook" },
  { to: "/story/silent-dormitory", chapter: "Chapter W", title: "The Silent Dormitory", tag: "Mob mentality · §302 vs §304" },
  { to: "/story/the-runner", chapter: "Chapter Z", title: "The Runner", tag: "Cross-border impersonation scam" },
  { to: "/story/silent-room", chapter: "Chapter W", title: "The Silent Room", tag: "Child protection · systemic failure" },
  { to: "/story/mask-of-authority", chapter: "Chapter V", title: "The Mask of Authority", tag: "Impersonation scam · syndicate hook" },
  { to: "/story/ritual-of-power", chapter: "Chapter U", title: "The Ritual of Power", tag: "Cult manipulation · consent vs legality" },
  { to: "/story/high-pay-trap", chapter: "Chapter T", title: "The High-Pay Trap", tag: "Trafficking by deception · ATIPSOM 2007" },
];

const Quest = () => {
  const { t, tutorialSeen, markTutorialSeen } = useSettings();
  const [showTut, setShowTut] = useState(false);
  useEffect(() => { if (!tutorialSeen) setShowTut(true); }, [tutorialSeen]);
  const slugFromRoute = (r: string) => r.replace("/story/", "");
  const progressFor = (route: string) => loadProgress(slugFromRoute(route));
  return (
    <GameFrame bgImage={justiceBg}>
      <header className="pt-6 px-6 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg sm:text-xl text-primary flex-1 text-center pr-12">
          {t("quest.title")}
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-3 px-6 py-4 overflow-y-auto">
        {CASES.map((c, i) => (
          (() => {
          const p = progressFor(c.to);
          const pct = p ? Math.round((p.i / Math.max(1, p.total)) * 100) : 0;
          return (
          <Link
            key={c.to}
            to={c.to}
            className="pixel-btn text-left text-sm border-accent relative"
            style={{ display: "block" }}
          >
            {!tutorialSeen && i === 0 && (
              <span
                className="absolute -top-3 -right-2 pixel float-bob text-[14px] z-20 pixel-text"
                style={{ color: "hsl(48 100% 65%)" }}
                aria-hidden="true"
              >!</span>
            )}
            <div className="text-[10px] opacity-80">★ {c.chapter}</div>
            <div className="text-base mt-1">{c.title}</div>
            <div className="text-[10px] opacity-80 mt-1">{c.tag}</div>
            {p && (
              <div className="mt-2">
                <div className="h-1.5 border border-primary/60 bg-background/60">
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[9px] opacity-80 mt-1">▶ CONTINUE · {pct}%</div>
              </div>
            )}
          </Link>
          );
          })()
        ))}
      </main>

      <TutorialModal open={showTut} onClose={() => { markTutorialSeen(); setShowTut(false); }} />
    </GameFrame>
  );
};

export default Quest;
