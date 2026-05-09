import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GameFrame from "@/components/GameFrame";
import justiceBg from "@/assets/justice-bg.jpg";
import { useSettings } from "@/game/SettingsContext";
import { TutorialModal } from "@/components/HomeOverlays";
import { loadProgress } from "@/lib/progress";
import T from "@/components/T";
import { CHAPTERS, isChapterUnlocked, computeMaxStars } from "@/lib/chapters";
import { getChapterBest } from "@/lib/rewards";

const TOOL_META: Record<string, { icon: string; name: string; special?: boolean }> = {
  gavel: { icon: "⭐", name: "STAR +1" },
  book: { icon: "📕", name: "LAW BOOK" },
  badge: { icon: "🛡", name: "BADGE" },
  scroll: { icon: "📜", name: "SCROLL" },
  scales: { icon: "⚖", name: "XP +50%" },
  robe: { icon: "👘", name: "XP +100%" },
};

const Quest = () => {
  const { t, tutorialSeen, markTutorialSeen, inventory, playCue, usedItemsByCase, armItemForCase, getArmedItem } = useSettings();
  const [showTut, setShowTut] = useState(false);
  const [pendingItem, setPendingItem] = useState<keyof typeof TOOL_META | null>(null);
  useEffect(() => { if (!tutorialSeen) setShowTut(true); }, [tutorialSeen]);
  const slugFromRoute = (r: string) => r.replace("/story/", "");
  const progressFor = (route: string) => loadProgress(slugFromRoute(route));
  const ownedTools = (Object.keys(TOOL_META) as Array<keyof typeof TOOL_META>).filter(
    (id) => (inventory[id as keyof typeof inventory] ?? 0) > 0,
  );
  const hasArmedAny = Object.keys(usedItemsByCase).length > 0;
  const handleArm = (slug: string) => {
    if (!pendingItem) return;
    const meta = TOOL_META[pendingItem];
    if (armItemForCase(slug, pendingItem as any)) {
      playCue();
      toast(`✓ USED ${meta.name}`);
      setPendingItem(null);
    } else {
      toast("CANNOT USE — already armed this play");
    }
  };
  return (
    <GameFrame bgImage={justiceBg}>
      <header className="pt-6 px-6 flex items-center gap-3">
        <Link to="/" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-lg sm:text-xl text-primary flex-1 text-center pr-12">
          {t("quest.title")}
        </h1>
      </header>

      {ownedTools.length > 0 && (
        <div className="px-6 pt-3">
          <div className="text-[10px] pixel text-primary mb-1">TOOL BELT</div>
          <div className="flex gap-2 flex-wrap">
            {ownedTools.map((id) => {
              const m = TOOL_META[id];
              const count = inventory[id as keyof typeof inventory];
              return (
                <button
                  key={id}
                  onClick={() => handleUse(id)}
                  className="pixel-btn relative text-[10px] px-2 py-1 flex items-center gap-1"
                  title={m.name}
                >
                  <span className="text-base leading-none">{m.icon}</span>
                  <span className="pixel">x{count}</span>
                  {m.special && (
                    <span className="absolute -top-2 -right-2 pixel text-[7px] bg-accent text-accent-foreground px-1">
                      SPECIAL
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col gap-3 px-6 py-4 overflow-y-auto">
        {CHAPTERS.map((c, i) => (
          (() => {
          const p = progressFor(c.to);
          const pct = p ? Math.round((p.i / Math.max(1, p.total)) * 100) : 0;
          const unlocked = isChapterUnlocked(i);
          const prev = i > 0 ? CHAPTERS[i - 1] : null;
          const needStars = prev ? Math.floor(computeMaxStars(prev.story) / 2) + 1 : 0;
          if (!unlocked) {
            const haveStars = prev ? getChapterBest(prev.slug) : 0;
            const prevMax = prev ? computeMaxStars(prev.story) : 0;
            const progressPct = needStars > 0 ? Math.min(100, Math.round((haveStars / needStars) * 100)) : 0;
            return (
              <div
                key={c.to}
                className="pixel-btn text-left text-sm border-accent relative opacity-50 cursor-not-allowed"
                style={{ display: "block" }}
                aria-disabled="true"
              >
                <div className="text-[10px] opacity-80">🔒 <T>{c.chapter}</T></div>
                <div className="text-base mt-1"><T>{c.title}</T></div>
                <div className="text-[10px] opacity-80 mt-1">
                  <T>{`Unlock: earn ${needStars}★ in ${prev?.chapter}`}</T>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 border border-primary/60 bg-background/60">
                    <div className="h-full bg-accent" style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className="text-[10px] pixel text-accent whitespace-nowrap">
                    {haveStars}★ / {needStars}★
                  </div>
                </div>
                <div className="text-[9px] opacity-70 mt-1">
                  <T>{`(max ${prevMax}★ in ${prev?.chapter})`}</T>
                </div>
              </div>
            );
          }
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
            <div className="text-[10px] opacity-80">★ <T>{c.chapter}</T></div>
            <div className="text-base mt-1"><T>{c.title}</T></div>
            <div className="text-[10px] opacity-80 mt-1"><T>{c.tag}</T></div>
            {(() => {
              const have = getChapterBest(c.slug);
              const max = computeMaxStars(c.story);
              const starPct = max > 0 ? Math.round((have / max) * 100) : 0;
              const full = have >= max && max > 0;
              return (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 border border-primary/60 bg-background/60">
                    <div
                      className="h-full"
                      style={{
                        width: `${starPct}%`,
                        background: full ? "hsl(48 100% 60%)" : "hsl(var(--accent))",
                      }}
                    />
                  </div>
                  <div className={`text-[10px] pixel whitespace-nowrap ${full ? "text-accent" : "opacity-90"}`}>
                    {full && "✨ "}{have}★ / {max}★
                  </div>
                </div>
              );
            })()}
            {p && (
              <div className="mt-2">
                <div className="h-1.5 border border-primary/60 bg-background/60">
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[9px] opacity-80 mt-1">▶ <T>CONTINUE</T> · {pct}%</div>
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
