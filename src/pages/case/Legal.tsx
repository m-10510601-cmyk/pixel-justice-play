import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import CaseFrame from "@/components/CaseFrame";
import { getCase } from "@/data/cases";
import { caseActions } from "@/store/caseStore";

const Legal = () => {
  const { id } = useParams();
  const c = getCase(id ?? "");
  const nav = useNavigate();
  const [pick, setPick] = useState<string | null>(null);
  if (!c) return <Navigate to="/quest" replace />;

  const next = () => {
    if (!pick) return;
    caseActions.setCategory(c.id, pick);
    nav(`/case/${c.id}/verdict`);
  };

  return (
    <CaseFrame title="LEGAL REASONING" step={3} back={`/case/${c.id}/evidence`}>
      <p className="text-sm bg-background/70 border-2 border-primary/60 p-2 mb-3">
        Choose the legal category that best fits the evidence. Think — don't guess.
      </p>

      <div className="space-y-3">
        {c.categories.map((cat) => {
          const on = pick === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setPick(cat.id)}
              className={`w-full text-left p-3 border-2 ${
                on ? "border-primary bg-primary/20" : "border-primary/40 bg-background/70"
              }`}
            >
              <div className="pixel text-[10px] text-primary">{cat.label.toUpperCase()}</div>
              {on && <div className="text-sm mt-2 opacity-90">{cat.rationale}</div>}
            </button>
          );
        })}
      </div>

      <button onClick={next} disabled={!pick} className="pixel-btn w-full text-base mt-5 disabled:opacity-50">
        NEXT ▶
      </button>
    </CaseFrame>
  );
};

export default Legal;