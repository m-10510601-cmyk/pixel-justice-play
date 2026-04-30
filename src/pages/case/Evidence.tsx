import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CaseFrame from "@/components/CaseFrame";
import { getCase } from "@/data/cases";
import { useCaseState, caseActions } from "@/store/caseStore";

const Evidence = () => {
  const { id } = useParams();
  const c = getCase(id ?? "");
  const nav = useNavigate();
  const all = useCaseState();
  const stored = all.selectedEvidence[id ?? ""] ?? [];
  const [selected, setLocal] = useState<string[]>(stored);
  const [openId, setOpenId] = useState<string | null>(null);
  const pressTimer = useRef<number | null>(null);

  useEffect(() => () => { if (pressTimer.current) window.clearTimeout(pressTimer.current); }, []);

  if (!c) return <Navigate to="/quest" replace />;

  const toggle = (eid: string) =>
    setLocal((prev) => (prev.includes(eid) ? prev.filter((x) => x !== eid) : [...prev, eid]));

  const startPress = (eid: string) => {
    pressTimer.current = window.setTimeout(() => setOpenId(eid), 450);
  };
  const endPress = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  const submit = () => {
    caseActions.setSelectedEvidence(c.id, selected);
    nav(`/case/${c.id}/legal`);
  };

  return (
    <CaseFrame title="EVIDENCE ANALYSIS" step={2} back={`/case/${c.id}/brief`}>
      <p className="text-sm bg-background/70 border-2 border-primary/60 p-2 mb-3">
        Tap to mark evidence as <span className="text-primary pixel text-[10px]">RELIABLE</span>.
        Long-press for details.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {c.evidence.map((e) => {
          const on = selected.includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggle(e.id)}
              onMouseDown={() => startPress(e.id)}
              onMouseUp={endPress}
              onMouseLeave={endPress}
              onTouchStart={() => startPress(e.id)}
              onTouchEnd={endPress}
              className={`text-left p-3 border-2 transition-colors ${
                on
                  ? "border-primary bg-primary/20 shadow-[var(--shadow-pixel-sm)]"
                  : "border-primary/40 bg-background/70"
              }`}
            >
              <div className="text-2xl">{e.icon}</div>
              <div className="pixel text-[9px] text-primary mt-1">{e.title.toUpperCase()}</div>
              <div className="text-sm mt-1 leading-tight">{e.summary}</div>
              {on && <div className="pixel text-[8px] text-accent mt-2">✓ SELECTED</div>}
            </button>
          );
        })}
      </div>

      {openId && (
        <div
          className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-6"
          onClick={() => setOpenId(null)}
        >
          <div className="bg-card border-4 border-primary p-4 max-w-xs shadow-[var(--shadow-pixel)]">
            {(() => {
              const ev = c.evidence.find((x) => x.id === openId)!;
              return (
                <>
                  <div className="text-3xl">{ev.icon}</div>
                  <div className="pixel text-[10px] text-primary mt-2">{ev.title.toUpperCase()}</div>
                  <p className="text-base mt-2">{ev.detail}</p>
                  <button className="pixel-btn w-full mt-4 text-sm" onClick={() => setOpenId(null)}>
                    CLOSE
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <button
        onClick={submit}
        disabled={selected.length === 0}
        className="pixel-btn w-full text-base mt-5 disabled:opacity-50"
      >
        NEXT ▶
      </button>
    </CaseFrame>
  );
};

export default Evidence;