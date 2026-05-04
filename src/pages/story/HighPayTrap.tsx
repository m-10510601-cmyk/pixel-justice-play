import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";
import SceneDialogue from "@/components/story/SceneDialogue";
import EvidenceBoard, { EvidenceItem } from "@/components/story/EvidenceBoard";
import ChoicePanel from "@/components/story/ChoicePanel";
import { sceneImageFor } from "@/lib/sceneImages";
import { useStoryProgress } from "@/hooks/useStoryProgress";

type ChoiceKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8";
type Answers = Partial<Record<ChoiceKey, string>>;

type Choice = {
  id: string;
  label: string;
  best?: boolean;
  ok?: boolean;
  hint?: string;
  rationale?: string;
  evidenceRefs?: string[];
  evidenceTags?: string[];
};

type Step =
  | { kind: "scene"; title: string; sceneKey?: string; image?: string; lines: { who?: string; text: string; inner?: boolean }[] }
  | { kind: "evidence"; title: string; items: EvidenceItem[] }
  | { kind: "choice"; key: ChoiceKey; title: string; prompt: string; options: Choice[]; reveal?: string }
  | { kind: "insight"; title: string; text: string };

const STORY: Step[] = [
  {
    kind: "scene",
    title: "📖 Case Brief", sceneKey: "cafe",
    lines: [
      { text: "Time: 2026 · Location: A Selangor police station." },
      { text: "Victim: Mei (24). Returned from a 'high-paying overseas job' two days ago. Walked in alone, with no documents." },
      { who: "Mei", text: "“I just wanted a job to support my family… but then things started feeling very wrong.”" },
      { who: "You", inner: true, text: "She walked out. The next ten still haven't." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Act I · The Opportunity", sceneKey: "cafe",
    lines: [
      { who: "Friend", text: "“I know an agent. He says overseas jobs can pay you in one month what you earn here in six.”" },
      { who: "Mei", text: "“Is it really that good? What's the catch?”" },
      { who: "Friend", text: "“He showed me the ad. It looks legit.”" },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence Board #1 · The Lure",
    items: [
      { id: "job-ad", type: "list", title: "Job advertisement (screenshot)", text: "‘High Salary · No Experience Required · Food and Board Provided.’ Vague employer name. WhatsApp-only contact.", detail: "Three classic markers in one image: too-good-to-be-true pay, no skills barrier, no formal company channel.", tags: ["lure"] },
      { id: "agent-card", type: "note", title: "Agent's business card + 'registered' certificate", text: "Holds an SSM number that resolves to a dormant shell company.", detail: "The veneer of legitimacy is part of the trap — registration ≠ legitimacy.", tags: ["legitimacy-mask"] },
      { id: "friend-chat", type: "chat", from: "B", text: "“He said overseas pays 6× what we make here. You should come too.”", title: "Friend's chat", detail: "Peer endorsement is the most effective recruitment channel for trafficking networks.", tags: ["lure"] },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Judging the Ad",
    prompt: "How do you classify this advertisement at first sight?",
    options: [
      { id: "A", label: "Legitimate job opportunity", hint: "Three red flags in one image.", rationale: "‘Vague employer + WhatsApp-only contact + extreme pay’ is not a legitimate offer." },
      { id: "B", label: "Exaggerated marketing", ok: true, hint: "Half right.", rationale: "It is exaggerated, but treating it as marketing puff understates the deception element." },
      { id: "C", label: "Suspicious — needs more detail", best: true, hint: "Investigative posture.", rationale: "The right move is to keep watching how trust is built. Jumping to ‘scam’ now means missing the grooming evidence.", evidenceRefs: ["job-ad", "agent-card"], evidenceTags: ["lure", "legitimacy-mask"] },
      { id: "D", label: "Obvious scam — close the file", hint: "You skip the chain.", rationale: "Closing the file at the ad means the recruiter, transporter and controller are never charged." },
    ],
    reveal: "Best: C. Trafficking cases are won by following the chain, not by labelling the bait.",
  },
  {
    kind: "scene",
    title: "🎬 Act II · Building Trust", sceneKey: "office",
    lines: [
      { who: "Agent", text: "“We're a registered business. Don't commit long-term — just try it for a month.”" },
      { who: "Mei", text: "“What about the contract?”" },
      { who: "Agent", text: "“We'll sign it once you arrive. It's easier for visa processing.”" },
      { who: "You", inner: true, text: "‘Sign on arrival’ is how they make sure no Malaysian court ever sees the terms." },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · The Recruitment Process",
    prompt: "How do you read 'we'll sign the contract on arrival'?",
    options: [
      { id: "A", label: "Reasonable process", hint: "It is not.", rationale: "No legitimate employer cross-border defers the contract until the worker is inside their compound." },
      { id: "B", label: "Risky but acceptable", hint: "Risky and not acceptable.", rationale: "‘Acceptable risk’ is exactly the framing the agent wants you to adopt." },
      { id: "C", label: "Major red flag — lack of documentation", best: true, hint: "Name the tactic.", rationale: "Deferring the contract removes the only enforceable record of what was promised. That's the deception under ATIPSOM s.12.", evidenceTags: ["legitimacy-mask"] },
    ],
    reveal: "Correct: C. ‘On arrival’ is the contract trap.",
  },
  {
    kind: "scene",
    title: "🎬 Act III · The Turning Point", sceneKey: "airport",
    lines: [
      { who: "Manager", text: "“Hand over your passports. The company keeps them — for safety and permit renewals.”" },
      { who: "Mei", text: "“Can I get mine back if I want to leave?”" },
      { who: "Manager", text: "“After you fulfil the contract. Welcome to the team.”" },
      { who: "You", inner: true, text: "Passport seizure. The exact moment the law calls 'control'." },
    ],
  },
  {
    kind: "insight",
    title: "📜 Insight · Document Seizure",
    text:
      "Withholding travel or identity documents is one of the named indicators of trafficking under ATIPSOM 2007 and the Palermo Protocol. The instant the passport leaves the worker's hand into the employer's safe, freedom of movement is structurally extinguished — regardless of what either party calls it.",
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Nature of the Act",
    prompt: "What is the passport seizure?",
    options: [
      { id: "A", label: "Standard company policy", hint: "No it isn't.", rationale: "No lawful employer needs custody of an employee's passport to renew a permit." },
      { id: "B", label: "Safety protocol", hint: "Whose safety?", rationale: "The framing of ‘safety’ inverts who is actually being protected — the employer's leverage, not the worker." },
      { id: "C", label: "Means of physical and psychological control", best: true, hint: "Name the mechanism.", rationale: "Document seizure converts a labour relationship into captivity. It is the single clearest ATIPSOM indicator on this fact pattern.", evidenceTags: ["confinement"] },
    ],
    reveal: "Correct: C. The cage starts at the airport, not the compound.",
  },
  {
    kind: "scene",
    title: "🎬 Act IV · Reality Shatters", sceneKey: "compound",
    lines: [
      { who: "Mei", text: "“This isn't the job you promised. I want to go home.”" },
      { who: "Supervisor", text: "“You already cost us thousands in travel and arrangement fees. You work until you pay it back.”" },
      { who: "You", inner: true, text: "16-hour shifts. Locked gates. A debt that grows faster than wages. That's a textbook." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence Board #2 · Inside the Compound",
    items: [
      { id: "salary-records", type: "list", title: "Salary records (recovered ledger)", text: "Promised pay vs actual: ~18% delivered. ‘Deductions’ for food, lodging, transport, ‘training fees’.", detail: "Income engineered to never clear the debt. This is the financial mechanism of bondage.", tags: ["debt-bondage"] },
      { id: "worker-stmts", type: "chat", from: "C", text: "“We were all told different stories. We all ended up in the same room.”", title: "Other worker testimonies", detail: "Multiple victims with divergent recruitment narratives converging on one site = systemic, not coincidental.", tags: ["pattern"] },
      { id: "gate-log", type: "note", title: "Compound gate log", text: "Outer gate locked from outside between 22:00 and 06:00. Workers escorted, never alone.", detail: "Physical confinement layered on top of document and financial control.", tags: ["confinement"] },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Nature of the Case",
    prompt: "What is this, in legal terms?",
    options: [
      { id: "A", label: "Breach of contract", hint: "Wrong forum.", rationale: "Locked gates and confiscated passports are not arbitrable. This is criminal." },
      { id: "B", label: "Unhappy employee", hint: "Gaslighting label.", rationale: "‘Unhappy’ is what employers say when courts are listening. Don't borrow their vocabulary." },
      { id: "C", label: "Debt bondage / exploitation", best: true, hint: "Match the structure.", rationale: "Engineered debt + confinement + forced labour = exploitation under ATIPSOM s.2.", evidenceRefs: ["salary-records", "gate-log"], evidenceTags: ["debt-bondage", "confinement"] },
    ],
    reveal: "Correct: C. Calling it a labour dispute is itself part of how the case escapes.",
  },
  {
    kind: "scene",
    title: "🎬 Act V · The Sunk-Cost Trap", sceneKey: "scam-floor",
    lines: [
      { who: "Mei", inner: true, text: "“Maybe if I just work harder, they'll let me go… I've already sacrificed so much to come here…”" },
      { text: "Day after day she runs scripts on a screen, calling strangers in three languages." },
      { who: "You", inner: true, text: "‘Consent’ here is just a survival reflex managed by her captors." },
    ],
  },
  {
    kind: "choice",
    key: "q5",
    title: "🎮 Choice ⑤ · The Consent Question",
    prompt: "She did not run. The defence will call that consent. What is it actually?",
    options: [
      { id: "A", label: "She stayed voluntarily", hint: "Volition under coercion isn't volition.", rationale: "‘Voluntary’ in law requires absence of deception, coercion and abuse of position. None of that is satisfied here." },
      { id: "B", label: "She had the physical option to run", hint: "The cage isn't only physical.", rationale: "Without a passport, in a foreign country, watching every escape attempt punished — there is no real ‘option’." },
      { id: "C", label: "Will suppressed by psychological/financial control", best: true, hint: "ATIPSOM s.2.", rationale: "Under ATIPSOM, where deception, coercion or abuse of position are used, the consent of the victim is legally irrelevant. This is exactly that fact pattern.", evidenceRefs: ["salary-records", "gate-log", "agent-card"], evidenceTags: ["debt-bondage", "confinement"] },
    ],
    reveal: "Correct: C. ATIPSOM was written so that this exact defence does not work.",
  },
  {
    kind: "insight",
    title: "📜 Insight · Consent under ATIPSOM",
    text:
      "ATIPSOM 2007 (s.2) defines trafficking by ACT (recruitment, transportation, harbouring, receipt) + MEANS (deception, coercion, abuse of power, debt bondage, etc.) + PURPOSE (exploitation). Where any prohibited means is used, the consent of the trafficked person is irrelevant. That is the entire reason the offence exists separately from labour law.",
  },
  {
    kind: "scene",
    title: "🎬 Act VI · The Hidden Phone", sceneKey: "compound",
    lines: [
      { who: "Mei (whispering)", text: "“I want to come home… they won't let me leave… please…”" },
      { text: "She kept a second phone hidden inside a pillow. The call lasts ninety seconds." },
      { who: "You", inner: true, text: "Ninety seconds is enough to open a file. Now follow the money." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence Board #3 · The Network",
    items: [
      { id: "recruit-bonus", type: "chat", from: "A", text: "“Recruit 5 more people and we'll subtract RM2000 from your debt.”", title: "Compound chat broadcast", detail: "Victims are turned into recruiters. Bondage funds itself.", tags: ["pyramid", "debt-bondage"] },
      { id: "money-flow", type: "list", title: "Financial flow", text: "Recruitment agent → ‘security firm’ shell → offshore e-wallet → cash-out via P2P.", detail: "Same laundering shape seen in the Green Trade case. Same plumbing, different inputs.", tags: ["network", "syndicate"] },
      { id: "network-map", type: "note", title: "Network map", text: "Recruiters (the bait) → Transporters (the delivery) → Controllers (the enforcers) → Exploiters (the end users).", detail: "All four roles are required for an ATIPSOM conviction. All four are visible in this case.", tags: ["network"] },
      { id: "green-trade-link", type: "note", title: "Cross-case link", text: "Two of the wallets receiving the compound's payouts also appear in the Chapter Y ‘Green Trade’ ledger.", detail: "Trafficking supplies the workforce; the e-wallet network supplies the laundering. Same syndicate.", tags: ["syndicate", "network"] },
    ],
  },
  {
    kind: "scene",
    title: "🎬 The Confrontation", sceneKey: "interrogation",
    lines: [
      { who: "Suspect (calmly)", text: "“They signed the papers. They wanted the high pay. I didn't hold a gun to anyone's head.”" },
      { who: "You", inner: true, text: "He's reading the script every trafficker reads. The law has an answer to this one." },
    ],
  },
  {
    kind: "choice",
    key: "q6",
    title: "🎮 Choice ⑥ · The 'Consent' Defence",
    prompt: "How do you answer the suspect?",
    options: [
      { id: "A", label: "Consent means no crime", hint: "That is the trafficker's argument.", rationale: "Adopting it as the prosecutor's position would dismantle the entire ATIPSOM regime." },
      { id: "B", label: "Consent mitigates the crime", hint: "Halfway concession.", rationale: "ATIPSOM does not allow consent to mitigate where prohibited means are used. Even partial recognition is wrong." },
      { id: "C", label: "Consent is irrelevant where deception/coercion is used (ATIPSOM s.2)", best: true, hint: "The full answer.", rationale: "Statute is unambiguous: consent of the trafficked person is irrelevant where any prohibited means has been used. Full stop.", evidenceRefs: ["salary-records", "gate-log"], evidenceTags: ["debt-bondage", "confinement"] },
    ],
    reveal: "Correct: C. The statute exists specifically to defeat this defence.",
  },
  {
    kind: "choice",
    key: "q7",
    title: "🎮 Choice ⑦ · Organisational Nature",
    prompt: "What kind of operation are you actually charging?",
    options: [
      { id: "A", label: "Lone-wolf agent", hint: "Doesn't fit.", rationale: "One person cannot recruit, transport, house, control and exploit across borders without infrastructure." },
      { id: "B", label: "Small team", hint: "Underestimates.", rationale: "Four distinct roles + offshore wallets + a recruitment pyramid is not a small team." },
      { id: "C", label: "Structured criminal network", best: true, hint: "Match the chain.", rationale: "Recruiter → Transporter → Controller → Exploiter, with a laundering tail. That is the textbook structure ATIPSOM was written against.", evidenceRefs: ["network-map", "money-flow", "green-trade-link"], evidenceTags: ["network", "syndicate"] },
      { id: "D", label: "Ad-hoc behaviour", hint: "Not ad-hoc.", rationale: "Bonus structures for recruiting more victims are not improvised. They are designed." },
    ],
    reveal: "Correct: C. Charging it as a network is what unlocks the upstream wallets.",
  },
  {
    kind: "insight",
    title: "📜 Insight · ATIPSOM's Four Pillars",
    text:
      "Recruitment (the ad) · Transportation (the journey) · Control (passport seizure, locked gates) · Exploitation (debt bondage, forced scam labour). All four are present and documented here. The frame for the charge sheet writes itself.",
  },
  {
    kind: "scene",
    title: "⚖️ Verdict", sceneKey: "verdict",
    lines: [
      { text: "The court rises. Three options sit on the bench. Only one fits the evidence." },
      { who: "You", inner: true, text: "Name the offence by the means used, not by what the worker walked into." },
    ],
  },
  {
    kind: "choice",
    key: "q8",
    title: "🎮 Choice ⑧ · Final Verdict",
    prompt: "What is the correct charge?",
    options: [
      { id: "A", label: "Labour dispute", hint: "Wrong forum.", rationale: "Industrial Court has no jurisdiction over passport seizure and confinement." },
      { id: "B", label: "Contractual issue", hint: "Wrong frame.", rationale: "Contract law cannot reach deception used to deliver a person into exploitation." },
      { id: "C", label: "Trafficking in Persons (ATIPSOM 2007)", best: true, hint: "Match all four pillars.", rationale: "Recruitment + Transportation + Control + Exploitation, with deception as the means. Textbook ATIPSOM.", evidenceRefs: ["job-ad", "salary-records", "gate-log", "network-map"], evidenceTags: ["network", "debt-bondage", "confinement"] },
      { id: "D", label: "Voluntary employment", hint: "The trafficker's framing.", rationale: "Adopting this label is the failure ending — by definition." },
    ],
    reveal: "Correct: C. ATIPSOM was written for exactly this fact pattern.",
  },
];

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Hard fails — adopting the trafficker's framing
  if (a.q8 === "A" || a.q8 === "B" || a.q8 === "D") return "red";
  if (a.q5 === "A" || a.q5 === "B") return "red";

  let score = 0;
  if (a.q1 === "C") score += 2;
  else if (a.q1 === "B") score++;
  if (a.q2 === "C") score += 2;
  if (a.q3 === "C") score += 2;
  if (a.q4 === "C") score += 2;
  if (a.q5 === "C") score += 2;
  if (a.q6 === "C") score += 2;
  if (a.q7 === "C") score += 2;
  if (a.q8 === "C") score += 2;

  const justice = a.q5 === "C" && a.q6 === "C" && a.q8 === "C" && a.q7 === "C" && score >= 14;
  if (justice) return "green";
  if (score <= 6) return "red";
  return "yellow";
}

const ENDINGS = {
  green: {
    tag: "🟢 Justice Ending",
    title: "The Cage Without Bars",
    body: "Charges are filed under ATIPSOM 2007 against the recruitment agent, the transporter, and the on-site controller. The compound is raided; ten more victims are identified and protected. The wallet trail crosses into the Green Trade ledger — a thread the syndicate cannot cut without exposing the wider laundering network.",
  },
  yellow: {
    tag: "🟡 Grey Ending",
    title: "The Local Agent Falls — The Network Adapts",
    body: "The Malaysian-based recruiter is convicted. Mei and several others are repatriated. But the overseas controllers stay untouchable, the compound reopens within weeks under a new shell, and the ad goes back online — same wording, different number.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Filed as 'Voluntary Employment'",
    body: "The case is misclassified as a labour matter. The suspect pays a fine and continues operating. Mei is treated as an undocumented worker and deported. The cycle continues — and the next family in her village is already being approached.",
  },
};

type Highlights = { ids: string[]; tags: string[] } | null;
type Source = { choiceTitle: string; optionLabel: string; rationale?: string } | null;

const RecapPanel = ({
  evTitle,
  items,
  highlights,
  source,
}: {
  evTitle: string;
  items: EvidenceItem[];
  highlights: Highlights;
  source: Source;
}) => {
  const ids = new Set(highlights?.ids ?? []);
  const tags = new Set(highlights?.tags ?? []);
  const linked = items.filter(
    (it) =>
      (it.id && ids.has(it.id)) ||
      (it.tags && it.tags.some((t) => tags.has(t))),
  );

  const jumpTo = (id?: string) => {
    if (!id) return;
    const nodes = document.querySelectorAll<HTMLElement>(
      `[data-evidence-id="${CSS.escape(id)}"]`,
    );
    const target = nodes[nodes.length - 1] ?? nodes[0];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("ring-4", "ring-accent");
    window.setTimeout(() => target.classList.remove("ring-4", "ring-accent"), 1400);
    const toggle = target.querySelector<HTMLButtonElement>('button[aria-expanded="false"]');
    toggle?.click();
  };

  const titleFor = (it: EvidenceItem) => {
    if (it.title) return it.title;
    switch (it.type) {
      case "cctv":
      case "phone":
      case "video":
        return it.label.slice(0, 36);
      case "chat":
        return `${it.from}: ${it.text.slice(0, 28)}`;
      case "list":
      case "note":
        return it.text.slice(0, 36);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="border-2 border-accent bg-accent/10 p-2 space-y-2"
        style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="pixel text-[8px] px-2 py-1 bg-accent text-accent-foreground"
            style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
          >
            📂 RECAP
          </span>
          <span className="pixel text-[8px] text-accent">
            {linked.length} LINKED · {evTitle}
          </span>
        </div>

        {source && (
          <div className="border-l-4 border-primary bg-background/70 px-2 py-1">
            <div className="pixel text-[8px] text-primary">
              YOU CHOSE · {source.optionLabel}
            </div>
            {source.rationale && (
              <p className="text-xs leading-snug text-foreground/90 mt-1">
                {source.rationale}
              </p>
            )}
          </div>
        )}

        {linked.length > 0 && (
          <div className="space-y-1">
            <div className="pixel text-[8px] text-accent/80">JUMP TO EVIDENCE ↓</div>
            <div className="flex flex-wrap gap-1">
              {linked.map((it, k) => (
                <button
                  key={(it.id ?? "x") + k}
                  onClick={() => jumpTo(it.id)}
                  disabled={!it.id}
                  className="pixel text-[8px] px-2 py-1 border-2 border-primary text-primary bg-background/80 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
                  title={it.detail ?? "Open in evidence board"}
                >
                  ▸ {titleFor(it)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <EvidenceBoard
        title={`RECAP · ${evTitle}`}
        items={items}
        highlightIds={highlights?.ids}
        highlightTags={highlights?.tags}
        defaultOpen
      />
    </div>
  );
};

const HighPayTrap = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "high-pay-trap", title: "The High-Pay Trap", route: "/story/high-pay-trap", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
  const ending = useMemo(() => (done ? gradeEnding(answers) : null), [done, answers]);
  const step = !done ? STORY[i] : null;

  const next = () => {
    setRevealedAt(null);
    setI((x) => {
      const nx = x + 1;
      if (pendingHighlights && STORY[nx]?.kind === "evidence") {
        setActiveHighlights(pendingHighlights);
        setHighlightStepIdx(nx);
        setPendingHighlights(null);
      } else if (highlightStepIdx !== null && nx !== highlightStepIdx) {
        setActiveHighlights(null);
        setHighlightStepIdx(null);
      }
      return nx;
    });
  };

  const choose = (key: ChoiceKey, id: string) => {
    setAnswers((a) => ({ ...a, [key]: id }));
    setRevealedAt(i);
    const stepNow = STORY[i];
    if (stepNow?.kind === "choice") {
      const opt = stepNow.options.find((o) => o.id === id);
      if (opt && (opt.evidenceRefs?.length || opt.evidenceTags?.length)) {
        const ids = opt.evidenceRefs ?? [];
        const tags = opt.evidenceTags ?? [];
        const source = { choiceTitle: stepNow.title, optionLabel: opt.label, rationale: opt.rationale };
        const futureEvidence = STORY.slice(i + 1).findIndex((st) => st.kind === "evidence");
        if (futureEvidence >= 0) {
          setPendingHighlights({ ids, tags });
          setHighlightSource(source);
        } else {
          let lastEv = -1;
          for (let k = i - 1; k >= 0; k--) {
            if (STORY[k].kind === "evidence") { lastEv = k; break; }
          }
          if (lastEv >= 0) {
            setActiveHighlights({ ids, tags });
            setHighlightStepIdx(lastEv);
            setHighlightSource(source);
          }
        }
      } else {
        setPendingHighlights(null);
        setHighlightSource(null);
      }
    }
  };

  const restart = () => {
    setI(0);
    setAnswers({});
    setRevealedAt(null);
    setPendingHighlights(null);
    setActiveHighlights(null);
    setHighlightStepIdx(null);
    setHighlightSource(null);
  };

  const stepHighlights =
    step?.kind === "evidence" && highlightStepIdx === i ? activeHighlights : null;

  const lateRecap =
    step?.kind === "choice" &&
    activeHighlights &&
    highlightStepIdx !== null &&
    highlightStepIdx < i
      ? { idx: highlightStepIdx, ev: STORY[highlightStepIdx] as Extract<Step, { kind: "evidence" }> }
      : null;

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-5 px-5 flex items-center gap-3">
        <Link to="/quest" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          CHAPTER T · THE HIGH-PAY TRAP
        </h1>
      </header>

      {!done && (
        <div className="px-5 pt-3">
          <div className="h-2 border-2 border-primary/70 bg-background/60">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((i + 1) / total) * 100}%` }}
            />
          </div>
          <div className="pixel text-[9px] text-primary/90 mt-1 text-right">
            {i + 1} / {total}
          </div>
        </div>
      )}

      <main className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        {step?.kind === "scene" && (
          <div className="space-y-3 animate-fade-in">
            {(() => {
              const sceneImg = step.image ?? sceneImageFor("high-pay-trap", step.sceneKey ?? step.title);
              return sceneImg ? (
                <div
                  className="relative w-full overflow-hidden border-2 border-primary shadow-[var(--shadow-pixel)]"
                  style={{ aspectRatio: "16 / 10", imageRendering: "pixelated" }}
                >
                  <img
                    src={sceneImg}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                    loading="lazy"
                    width={1024}
                    height={1024}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 bg-card/90 border-2 border-primary px-2 py-1 shadow-[var(--shadow-pixel)]">
                    <div className="pixel text-[10px] text-primary">{step.title}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-card/90 border-2 border-primary px-3 py-2 shadow-[var(--shadow-pixel)] inline-block">
                  <div className="pixel text-[10px] text-primary">{step.title}</div>
                </div>
              );
            })()}
            <SceneDialogue lines={step.lines} resetKey={i} />
          </div>
        )}

        {step?.kind === "evidence" && (
          <EvidenceBoard
            title={step.title}
            items={step.items}
            highlightIds={stepHighlights?.ids}
            highlightTags={stepHighlights?.tags}
            defaultOpen={!!stepHighlights}
          />
        )}

        {step?.kind === "insight" && (
          <div className="bg-primary/15 border-2 border-primary p-3">
            <div className="pixel text-[10px] text-primary">{step.title}</div>
            <p className="text-base mt-2">{step.text}</p>
          </div>
        )}

        {step?.kind === "choice" && (
          <>
            <ChoicePanel
              title={step.title}
              prompt={step.prompt}
              options={step.options}
              reveal={step.reveal}
              selected={answers[step.key]}
              revealed={revealedAt === i}
              resetKey={`${i}-${step.key}`}
              onSelect={(id) => choose(step.key, id)}
            />
            {lateRecap && (
              <RecapPanel
                evTitle={lateRecap.ev.title}
                items={lateRecap.ev.items}
                highlights={activeHighlights}
                source={highlightSource}
              />
            )}
          </>
        )}

        {!done && (
          <button
            onClick={next}
            disabled={step?.kind === "choice" && !answers[step.key]}
            className="pixel-btn w-full text-base disabled:opacity-50"
          >
            {i === total - 1 ? "REVEAL ENDING ▶" : "NEXT ▶"}
          </button>
        )}

        {done && ending && (
          <>
            <div className="bg-card/95 border-2 border-primary p-3 shadow-[var(--shadow-pixel)]">
              <div className="pixel text-[10px] text-accent">{ENDINGS[ending].tag}</div>
              <div className="pixel text-sm text-primary mt-1">{ENDINGS[ending].title}</div>
              <p className="text-base mt-2 leading-snug">{ENDINGS[ending].body}</p>
            </div>

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 What This Teaches</div>
              <p className="text-sm mt-2">
                Trafficking does not look like kidnapping. It looks like a job ad, a smile, a contract you'll sign “on arrival,” and a passport in someone else's safe. Lies + debt + document seizure = a cage without bars.
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ ATIPSOM = ACT (recruit/transport/harbour) + MEANS (deception/coercion) + PURPOSE (exploitation).</li>
                <li>✔ Where any prohibited means is used, the consent of the victim is irrelevant.</li>
                <li>✔ Document seizure is not safekeeping — it is the named indicator of control.</li>
                <li>✔ Charge it as a network or the upstream wallets stay open for the next victim.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">
                REPLAY
              </button>
              <Link to="/quest" className="pixel-btn text-sm text-center">
                CONTINUE
              </Link>
            </div>
          </>
        )}
      </main>
    </GameFrame>
  );
};

export default HighPayTrap;