import { useParams, Navigate, useNavigate } from "react-router-dom";
import CaseFrame from "@/components/CaseFrame";
import { getCase, L } from "@/data/cases";
import { useSettings } from "@/game/SettingsContext";

const Brief = () => {
  const { id } = useParams();
  const c = getCase(id ?? "");
  const nav = useNavigate();
  const { t, lang } = useSettings();
  if (!c) return <Navigate to="/quest" replace />;

  const title = L(lang, c.title);

  return (
    <CaseFrame title={title.toUpperCase()} step={1} back={`/chapter/${c.chapter}`}>
      <div className="space-y-4">
        {c.image && (
          <div className="border-2 border-primary shadow-[var(--shadow-pixel)] overflow-hidden">
            <img
              src={c.image}
              alt={title}
              width={1024}
              height={704}
              className="w-full aspect-[3/2] object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        )}
        <div className="bg-card/90 border-2 border-primary p-3 shadow-[var(--shadow-pixel)]">
          <div className="pixel text-[10px] text-primary mb-2">{t("case.brief")}</div>
          <p className="text-base leading-snug">{L(lang, c.brief)}</p>
        </div>

        <div className="space-y-2">
          <div className="pixel text-[10px] text-primary">{t("case.statements")}</div>
          {c.statements.map((s, i) => (
            <div key={i} className="bg-background/80 border-2 border-primary/60 p-2">
              <div className="pixel text-[9px] text-accent">{L(lang, s.speaker).toUpperCase()}</div>
              <p className="text-base mt-1">"{L(lang, s.quote)}"</p>
            </div>
          ))}
        </div>

        <button onClick={() => nav(`/case/${c.id}/evidence`)} className="pixel-btn w-full text-base mt-4">
          {t("btn.next")}
        </button>
      </div>
    </CaseFrame>
  );
};

export default Brief;
