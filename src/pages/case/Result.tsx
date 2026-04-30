import { useParams, Navigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import CaseFrame from "@/components/CaseFrame";
import { getCase } from "@/data/cases";
import { useCaseState } from "@/store/caseStore";

const Bar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between pixel text-[9px] text-primary">
      <span>{label.toUpperCase()}</span>
      <span>{value}</span>
    </div>
    <div className="h-3 border-2 border-primary/70 bg-background/60 mt-1">
      <div
        className="h-full bg-primary"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);

const Result = () => {
  const { id } = useParams();
  const c = getCase(id ?? "");
  const state = useCaseState();
  const [showReal, setShowReal] = useState(false);
  if (!c) return <Navigate to="/quest" replace />;

  const chosenEvidence = state.selectedEvidence[c.id] ?? [];
  const chosenCat = state.selectedCategory[c.id];
  const verdict = state.verdict[c.id];

  const evalScores = useMemo(() => {
    const reliablePicked = chosenEvidence.filter(
      (eid) => c.evidence.find((e) => e.id === eid)?.reliable
    ).length;
    const unreliablePicked = chosenEvidence.length - reliablePicked;
    const totalReliable = c.evidence.filter((e) => e.reliable).length;

    const evidenceScore = Math.round(
      (reliablePicked / Math.max(1, totalReliable)) * 100 - unreliablePicked * 15
    );
    const catCorrect = c.categories.find((x) => x.id === chosenCat)?.correct === true;
    const verdictCorrect = verdict === c.correctVerdict;

    const justice = Math.max(0, Math.min(100, (verdictCorrect ? 70 : 20) + (catCorrect ? 30 : 0)));
    const trust = Math.max(0, Math.min(100, evidenceScore * 0.6 + (verdictCorrect ? 40 : 10)));
    const fairness = Math.max(0, Math.min(100, (catCorrect ? 60 : 25) + evidenceScore * 0.4));
    return { evidenceScore: Math.max(0, evidenceScore), justice, trust, fairness, verdictCorrect, catCorrect };
  }, [chosenEvidence, chosenCat, verdict, c]);

  const headline = evalScores.verdictCorrect
    ? "JUDGEMENT UPHELD"
    : "JUDGEMENT QUESTIONED";

  return (
    <CaseFrame title="EVALUATION" step={5} back={`/case/${c.id}/verdict`}>
      <div className="bg-card/95 border-2 border-primary p-3 mb-3 shadow-[var(--shadow-pixel)]">
        <div className="pixel text-[10px] text-accent">{headline}</div>
        <p className="text-base mt-2 leading-snug">
          {evalScores.verdictCorrect
            ? "Your verdict aligns with the evidence and the standard of proof."
            : "Your verdict diverges from what the reliable evidence supports."}
        </p>
        <p className="text-sm mt-2 opacity-90">
          <span className="pixel text-[9px] text-primary">STANDARD: </span>
          {c.standardOfProof}
        </p>
      </div>

      <div className="space-y-3 bg-background/70 border-2 border-primary/60 p-3 mb-3">
        <div className="pixel text-[10px] text-primary">SOCIETAL IMPACT</div>
        <Bar label="Justice" value={Math.round(evalScores.justice)} />
        <Bar label="Public Trust" value={Math.round(evalScores.trust)} />
        <Bar label="Fairness" value={Math.round(evalScores.fairness)} />
      </div>

      <button
        onClick={() => setShowReal((x) => !x)}
        className="pixel-btn pixel-btn-secondary w-full text-sm"
      >
        {showReal ? "HIDE REAL-WORLD NOTE" : "COMPARE TO REAL CASES"}
      </button>
      {showReal && (
        <div className="bg-background/80 border-2 border-accent p-3 mt-2 text-sm">
          {c.realWorldNote}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Link to={`/case/${c.id}/brief`} className="pixel-btn pixel-btn-secondary text-sm">RETRY</Link>
        <Link to={`/chapter/${c.chapter}`} className="pixel-btn text-sm">CONTINUE</Link>
      </div>
    </CaseFrame>
  );
};

export default Result;