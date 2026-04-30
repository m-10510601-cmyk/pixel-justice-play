import { Link, useParams, Navigate } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import schoolBg from "@/assets/school-bg.jpg";
import societyBg from "@/assets/society-bg.jpg";
import { casesByChapter } from "@/data/cases";
import { useSettings } from "@/game/SettingsContext";

const Chapter = () => {
  const { chapter } = useParams<{ chapter: "school" | "society" }>();
  const { t } = useSettings();
  if (chapter !== "school" && chapter !== "society") return <Navigate to="/quest" replace />;
  const bg = chapter === "school" ? schoolBg : societyBg;
  const list = casesByChapter(chapter);
  const title = chapter === "school" ? t("chapter.school.title") : t("chapter.society.title");
  const blurb = chapter === "school" ? t("chapter.school.blurb") : t("chapter.society.blurb");

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-6 px-6 flex items-center gap-3">
        <Link to="/quest" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-base sm:text-lg text-primary flex-1 text-center pr-12">{title}</h1>
      </header>

      <main className="flex-1 flex flex-col px-6 py-4 gap-4 overflow-y-auto">
        <p className="text-foreground/95 text-base bg-background/70 p-3 border-2 border-primary/60">{blurb}</p>
        {list.map((c, i) => (
          <Link key={c.id} to={`/case/${c.id}/brief`} className="pixel-btn text-left text-sm" style={{ display: "block" }}>
            <div className="text-[10px] opacity-80">{t("chapter.case")} {i + 1}</div>
            <div className="text-base mt-1">{c.title}</div>
          </Link>
        ))}
      </main>
    </GameFrame>
  );
};

export default Chapter;
