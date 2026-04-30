import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import CaseFrame from "@/components/CaseFrame";
import { getCase, L } from "@/data/cases";
import { caseActions } from "@/store/caseStore";
import { useSettings } from "@/game/SettingsContext";

const VerdictPage = () => {
  const { id } = useParams();
  const c = getCase(id ?? "");
  const nav = useNavigate();
  const { t, lang } = useSettings();
  const [v, setV] = useState<"guilty" | "not_guilty" | null>(null);
  const [p, setP] = useState<string | null>(null);
  if (!c) return <Navigate to="/quest" replace />;

  const submit = () => {
    if (!v) return;
    caseActions.setVerdict(c.id, v);
    if (v === "guilty" && p) caseActions.setPunishment(c.id, p);
    nav(`/case/${c.id}/result`);
  };

  return (
    <CaseFrame title={t("verdict.title")} step={4} back={`/case/${c.id}/legal`}>
      <p className="text-sm bg-background/70 border-2 border-primary/60 p-2 mb-4">{t("verdict.help")}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => setV("guilty")} className={`pixel-btn text-sm ${v === "guilty" ? "" : "pixel-btn-secondary"}`}>
          {t("verdict.guilty")}
        </button>
        <button onClick={() => setV("not_guilty")} className={`pixel-btn text-sm ${v === "not_guilty" ? "" : "pixel-btn-secondary"}`}>
          {t("verdict.notguilty")}
        </button>
      </div>

      {v === "guilty" && (
        <div className="space-y-2">
          <div className="pixel text-[10px] text-primary">{t("verdict.assign")}</div>
          {c.punishments.map((pn) => (
            <button
              key={pn.id}
              onClick={() => setP(pn.id)}
              className={`w-full text-left p-2 border-2 ${p === pn.id ? "border-primary bg-primary/20" : "border-primary/40 bg-background/70"}`}
            >
              <span className="text-base">{L(lang, pn.label)}</span>
            </button>
          ))}
        </div>
      )}

      <button onClick={submit} disabled={!v || (v === "guilty" && !p)} className="pixel-btn w-full text-base mt-5 disabled:opacity-50">
        {t("verdict.deliver")}
      </button>
    </CaseFrame>
  );
};

export default VerdictPage;
