import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";
import SceneDialogue from "@/components/story/SceneDialogue";
import EvidenceBoard, { EvidenceItem } from "@/components/story/EvidenceBoard";
import ChoicePanel from "@/components/story/ChoicePanel";
import sceneBrief from "@/assets/scenes/runner/runner-brief.png";
import sceneCall from "@/assets/scenes/runner/runner-call.png";
import sceneDoor from "@/assets/scenes/runner/runner-door.png";
import sceneStation from "@/assets/scenes/runner/runner-station.png";
import sceneArrest from "@/assets/scenes/runner/runner-arrest.png";
import sceneInterrogation from "@/assets/scenes/runner/runner-interrogation.png";
import sceneReflection from "@/assets/scenes/runner/runner-reflection.png";

type ChoiceKey = "c1" | "c2a" | "c2b" | "c2c" | "c3a" | "c3b" | "c3c" | "q1" | "q2" | "q3" | "qV";
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
  | { kind: "scene"; title: string; image?: string; lines: { who?: string; text: string; inner?: boolean }[] }
  | { kind: "evidence"; title: string; items: EvidenceItem[] }
  | { kind: "choice"; key: ChoiceKey; title: string; prompt: string; options: Choice[]; reveal?: string }
  | { kind: "insight"; title: string; text: string };

const STORY: Step[] = [
  {
    kind: "scene",
    title: "📖 Case Brief", image: sceneBrief,
    lines: [
      { text: "Time: 2026 · Location: Singapore." },
      { text: "Victim: Mr. Tan, retired engineer. Suspect: a 40-year-old Malaysian national." },
      { text: "An unknown scam syndicate is suspected to be coordinating impersonation calls and on-the-ground asset collection." },
      { who: "You", inner: true, text: "A real person knocked on a real door — but the call came from somewhere far upstream." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Scene 1 · The Call", image: sceneCall,
    lines: [
      { text: "(Phone ringing)" },
      { who: "Mr. Tan", text: "“Hello?”" },
      { who: "Scammer (telecom)", text: "“This is M1 customer service. You have registered a phone line under your name.”" },
      { who: "Mr. Tan", text: "“That's impossible. I didn't sign anything.”" },
      { who: "Scammer (telecom)", text: "“This number is linked to a money laundering investigation.”" },
      { text: "(Pause. The line clicks. Transferred.)" },
      { who: "Fake MAS Officer", text: "“This is the Monetary Authority. You are under investigation.”" },
      { who: "Mr. Tan", text: "“I didn't do anything wrong!”" },
      { who: "Fake MAS Officer", text: "“Then you must prove your innocence.”" },
      { who: "You", inner: true, text: "Reverse the burden of proof. That's the first manipulation." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Scene 2 · Fear & Manipulation", image: sceneCall,
    lines: [
      { who: "Fake MAS Officer", text: "“You must not tell anyone. This is a confidential investigation.”" },
      { who: "Mr. Tan", text: "“What should I do?”" },
      { who: "Fake MAS Officer", text: "“Prepare your assets — cash, gold, valuables. An officer will collect them for verification.”" },
      { who: "You", inner: true, text: "Isolation. Authority. Urgency. Every textbook lever, in order." },
    ],
  },
  {
    kind: "choice",
    key: "c1",
    title: "🎮 Choice ① · Early Judgement",
    prompt: "Reading the call: how do you classify it?",
    options: [
      { id: "A", label: "This sounds legitimate", hint: "Real agencies don't work like this.", rationale: "No real authority asks for cash collection or secrecy. Treating this as legitimate locks the case shut." },
      { id: "B", label: "This may be a scam", best: true, hint: "Pattern-match the manipulation.", rationale: "Confidentiality threats + asset transfer + impersonation = textbook impersonation scam." },
    ],
    reveal: "Correct: B. Authorities never demand secrecy or asset surrender by phone.",
  },
  {
    kind: "scene",
    title: "🎬 Scene 3 · The Collection", image: sceneDoor,
    lines: [
      { text: "(A knock at Mr. Tan's door.)" },
      { who: "Suspect", text: "“I'm from the Monetary Authority.”" },
      { text: "(He shows a printed badge. He is wearing a wig.)" },
      { who: "Mr. Tan", text: "“…Are you really from the government?”" },
      { who: "Suspect", text: "“Please cooperate. This is for your own protection.”" },
      { text: "(Cash. Gold. Valuables. Everything is taken.)" },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Scene 4 · Suspicion", image: sceneStation,
    lines: [
      { who: "Mr. Tan", text: "“They said they would return everything… but no one has contacted me.”" },
      { text: "Days later. Police station. Mr. Tan walks in, hands shaking." },
      { who: "Mr. Tan", text: "“I think… I've been scammed.”" },
    ],
  },
  {
    kind: "choice",
    key: "c2a",
    title: "🎮 Choice ② · Investigation Path · Trace Identity",
    prompt: "Do you trace the suspect's identity through the badge and CCTV?",
    options: [
      { id: "Y", label: "Yes — pursue identity", best: true, hint: "Establishes who.", rationale: "The fake pass + CCTV give you a face. Without a face there is no arrest.", evidenceRefs: ["fake-pass", "cctv-collect"], evidenceTags: ["impersonation"] },
      { id: "N", label: "No — skip identity work", hint: "You'd never find him.", rationale: "Without identity you cannot arrest, charge, or extradite. Non-starter." },
    ],
    reveal: "Best: Yes. Identity is the foundation of every other step.",
  },
  {
    kind: "choice",
    key: "c2b",
    title: "🎮 Choice ② · Investigation Path · Analyse Call Origin",
    prompt: "Do you trace the originating call infrastructure?",
    options: [
      { id: "Y", label: "Yes — trace the call", ok: true, hint: "Useful, but slow.", rationale: "Spoofed VoIP routes overseas. Likely dead-ends — but logs may hook into a future case.", evidenceTags: ["chain"] },
      { id: "N", label: "No — focus elsewhere", hint: "Defensible if resources are tight.", rationale: "Acceptable triage. The runner is the strongest immediate lead." },
    ],
    reveal: "Acceptable either way. Call tracing is a long-tail lead.",
  },
  {
    kind: "choice",
    key: "c2c",
    title: "🎮 Choice ② · Investigation Path · Track Asset Movement",
    prompt: "Do you track where the cash, gold, and valuables went?",
    options: [
      { id: "Y", label: "Yes — follow the assets", best: true, hint: "Money draws the chain.", rationale: "Asset movement reveals the handler network the runner answers to.", evidenceRefs: ["assets-missing", "crossborder"], evidenceTags: ["money", "chain"] },
      { id: "N", label: "No — assets are gone", hint: "Surrenders the syndicate lead.", rationale: "Without the asset trail, you convict the runner but lose the handler." },
    ],
    reveal: "Best: Yes. The asset trail is the only line that reaches upstream.",
  },
  {
    kind: "evidence",
    title: "🔎 Evidence · Collection Kit",
    items: [
      {
        type: "list", text: "Fake MAS Pass · printed badge · no official record",
        id: "fake-pass", title: "Fake MAS Pass",
        tags: ["impersonation", "forensics"],
        detail: "Cross-checked against the Monetary Authority's internal registry — no match. Print quality and hologram are inconsistent with genuine government credentials. This is direct documentary evidence of impersonation.",
      },
      {
        type: "list", text: "Wig & disguise · recovered at arrest",
        id: "wig", title: "Wig & disguise",
        tags: ["impersonation"],
        detail: "Disguise alone does not prove fraud — but combined with the fake pass, it shows premeditation: the runner knew his appearance had to match an official, not a courier.",
      },
      {
        type: "cctv", label: "Door-cam footage shows the suspect collecting items from Mr. Tan",
        id: "cctv-collect", title: "Door-cam · collection",
        status: "ok",
        tags: ["impersonation", "chain"],
        detail: "Footage timestamped 14:07. Suspect's face partially visible under the wig. Hands receive a sealed envelope and a small box. Establishes direct involvement in the act, not mere proximity.",
      },
      {
        type: "list", text: "Immigration log · suspect re-entered Malaysia within 6 hours",
        id: "crossborder", title: "Cross-border movement",
        tags: ["chain", "crossborder"],
        detail: "Re-entry timing matches a syndicate handover model — collect, hand off, exit jurisdiction. By itself not proof of conspiracy, but it explains why local arrests so often fail.",
      },
      {
        type: "list", text: "None of Mr. Tan's assets were returned · no trace at suspect's residence",
        id: "assets-missing", title: "Assets · disposed",
        tags: ["chain", "money"],
        detail: "Assets were not held — they were forwarded. Suggests a handler downstream who liquidates and laundered through cross-border channels.",
      },
      { type: "note", text: "Following orders ≠ a defence. Cross-border ≠ out of reach." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Scene 5 · The Arrest", image: sceneArrest,
    lines: [
      { who: "Officer Lim", text: "“We tracked the suspect through CCTV and movement records.”" },
      { text: "(The suspect is detained at a budget hotel near the border.)" },
      { who: "You", inner: true, text: "He didn't plan the call. But he's the only physical face in the entire scheme." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Scene 6 · Interrogation", image: sceneInterrogation,
    lines: [
      { who: "Suspect", text: "“I didn't scam anyone. I was just told to collect items.”" },
      { who: "You", inner: true, text: "‘Just told to.’ Said by every link in every chain." },
    ],
  },
  {
    kind: "choice",
    key: "c3a",
    title: "🎮 Choice ③ · Interrogation · Accept Explanation",
    prompt: "Do you accept the 'just a courier' story?",
    options: [
      { id: "Y", label: "Yes — accept it", hint: "Surrenders the case.", rationale: "Accepting the courier framing ignores the wig, the fake pass, and the door-cam." },
      { id: "N", label: "No — keep pressing", best: true, hint: "Evidence already contradicts him.", rationale: "Three independent pieces of evidence contradict the 'just a courier' story." },
    ],
    reveal: "Best: No. The evidence already contradicts the framing.",
  },
  {
    kind: "choice",
    key: "c3b",
    title: "🎮 Choice ③ · Interrogation · Confront with Evidence",
    prompt: "Do you confront the suspect with the fake pass, wig, and CCTV?",
    options: [
      { id: "Y", label: "Yes — confront", best: true, hint: "Force him to explain the disguise.", rationale: "A courier doesn't need a wig and a fake government badge. The contradictions force a real answer.", evidenceRefs: ["fake-pass", "wig", "cctv-collect"], evidenceTags: ["impersonation"] },
      { id: "N", label: "No — hold evidence back", hint: "You waste your leverage.", rationale: "If you don't confront, he sticks to the rehearsed story. Evidence used in silence is evidence wasted." },
    ],
    reveal: "Best: Yes. Confrontation cracks rehearsed lines.",
  },
  {
    kind: "choice",
    key: "c3c",
    title: "🎮 Choice ③ · Interrogation · Ask About Instructions",
    prompt: "Do you press him on who gave the instructions?",
    options: [
      { id: "Y", label: "Yes — ask who instructed him", best: true, hint: "Climb the chain.", rationale: "His handler is the bridge to the syndicate. Without this question, the case ends at the runner.", evidenceRefs: ["crossborder", "assets-missing"], evidenceTags: ["chain"] },
      { id: "N", label: "No — focus only on his act", hint: "Convicts him alone.", rationale: "The runner is convicted, but the handler keeps operating with a new face." },
    ],
    reveal: "Best: Yes. The handler is the next node — only this question reaches it.",
  },
  {
    kind: "scene",
    title: "🎬 Scene 7 · Breaking Point", image: sceneInterrogation,
    lines: [
      { text: "You slide the printed badge and a CCTV still across the table." },
      { who: "You", text: "“You used a fake identity and collected valuables.”" },
      { who: "Suspect", text: "“I didn't know it was illegal…”" },
      { who: "You", text: "“You wore a disguise. Why?”" },
      { text: "(Pause.)" },
      { who: "Suspect", text: "“…They told me to.”" },
      { who: "You", text: "“You impersonated an officer. That is not a mistake.”" },
      { who: "Suspect", text: "“…I needed money.”" },
    ],
  },
  {
    kind: "insight",
    title: "⚖️ Legal Insight · Impersonation & Facilitation",
    text: "Impersonating a public officer is a standalone offence in most jurisdictions, including Singapore (Penal Code s.170/171) and Malaysia. Separately, knowingly assisting another's offence — including collecting and forwarding the proceeds — engages liability for abetment / facilitation. The runner's lack of a master plan does not erase either charge.",
  },
  {
    kind: "choice",
    key: "q1",
    title: "🧠 Legal Reasoning · Q1",
    prompt: "What is the suspect's role in this case?",
    options: [
      { id: "A", label: "Innocent courier", hint: "Ignores the disguise.", rationale: "An innocent courier doesn't wear a wig and a fake government pass. This framing collapses on the evidence." },
      { id: "B", label: "Victim", hint: "He chose to participate.", rationale: "Coercion was not shown. Financial motive (‘I needed money’) was admitted." },
      { id: "C", label: "Accomplice", best: true, hint: "Names his real role.", rationale: "He knowingly executed the in-person stage of an impersonation scam — the legal definition of an accomplice/abettor.", evidenceRefs: ["cctv-collect", "wig", "crossborder"], evidenceTags: ["impersonation", "chain"] },
    ],
    reveal: "Correct: C. Accomplice — he is the in-person actor in a coordinated scheme.",
  },
  {
    kind: "choice",
    key: "q2",
    title: "🧠 Legal Reasoning · Q2",
    prompt: "Does impersonation matter, even if he didn't write the script?",
    options: [
      { id: "A", label: "No — he just collected items", hint: "Ignores the offence itself.", rationale: "Impersonating a public officer is its own crime, regardless of why." },
      { id: "B", label: "Yes — impersonation is itself an offence", best: true, hint: "Standalone charge.", rationale: "Penal Code provisions criminalise impersonation of public officers separately from the underlying fraud.", evidenceRefs: ["fake-pass", "wig"], evidenceTags: ["impersonation"] },
    ],
    reveal: "Correct: B. Impersonation stands as its own charge.",
  },
  {
    kind: "choice",
    key: "q3",
    title: "🧠 Legal Reasoning · Q3",
    prompt: "Handling the assets of a known scam is…",
    options: [
      { id: "A", label: "Legal — he wasn't paid much", hint: "Payment size is irrelevant.", rationale: "Compensation level does not determine criminality of the underlying act." },
      { id: "B", label: "Assisting a crime", best: true, hint: "Facilitation = liability.", rationale: "Knowingly receiving and forwarding scam proceeds is facilitation, an offence in its own right.", evidenceRefs: ["assets-missing", "crossborder"], evidenceTags: ["money", "chain"] },
    ],
    reveal: "Correct: B. Handling scam proceeds is itself assisting the crime.",
  },
  {
    kind: "choice",
    key: "qV",
    title: "⚖️ Final Verdict",
    prompt: "Is the suspect guilty?",
    options: [
      { id: "A", label: "Not Guilty", hint: "Ignores impersonation + facilitation.", rationale: "Acquittal contradicts the evidence and the legal framework. The runner walks; the syndicate restocks." },
      { id: "B", label: "Guilty", best: true, hint: "Both charges are made out.", rationale: "Impersonation is documented. Facilitation is documented. The verdict follows the evidence.", evidenceRefs: ["fake-pass", "wig", "cctv-collect", "crossborder", "assets-missing"], evidenceTags: ["impersonation", "chain", "money"] },
    ],
    reveal: "Correct: B. The evidence supports both impersonation and facilitation.",
  },
  {
    kind: "scene",
    title: "🎬 Ending · Reflection", image: sceneReflection,
    lines: [
      { who: "Narrator", text: "“He did not make the call… but he made the crime possible.”" },
      { who: "You", text: "“Crime is not just about who plans it…”" },
      { who: "You", text: "“…but who helps it happen.”" },
    ],
  },
];

const QUIZ = {
  title: "🎓 Mini Quiz",
  prompt: "Why is the runner legally responsible even though he didn't plan the scam?",
  options: [
    { id: "A", label: "Because he kept some of the money" },
    { id: "B", label: "Because facilitation and impersonation are themselves offences", best: true },
    { id: "C", label: "Because he failed to report it to the police" },
  ] as Choice[],
};

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Hard fails
  if (a.q1 === "A" || a.qV === "A") return "red";
  let score = 0;
  if (a.c1 === "B") score++;
  if (a.c2a === "Y") score++;
  if (a.c2c === "Y") score++;
  if (a.c3a === "N") score++;
  if (a.c3b === "Y") score++;
  if (a.c3c === "Y") score++;
  if (a.q1 === "C") score += 2;
  if (a.q2 === "B") score++;
  if (a.q3 === "B") score++;
  if (a.qV === "B") score += 2;
  if (score >= 10) return "green";
  if (score >= 6) return "yellow";
  return "red";
}

const ENDINGS = {
  green: {
    tag: "🟢 Perfect Ending",
    title: "The Chain Named",
    body: "Guilty verdict on both impersonation and facilitation. The cross-border asset trail and call-origin logs open a fresh lead toward the upstream syndicate. The runner becomes the first node — not the last.",
  },
  yellow: {
    tag: "🟡 Realistic Ending",
    title: "Conviction Without Network",
    body: "The runner is convicted, but the handler escapes upstream. Mr. Tan recovers nothing. The syndicate sends another face within weeks.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Closed as Innocent Courier",
    body: "Charges are dropped or dismissed. The runner walks. Without a face, without a chain, the next victim's call has already been dialled.",
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
    // Try recap board first, then any other board on screen
    const nodes = document.querySelectorAll<HTMLElement>(
      `[data-evidence-id="${CSS.escape(id)}"]`,
    );
    const target = nodes[nodes.length - 1] ?? nodes[0];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("ring-4", "ring-accent");
    window.setTimeout(
      () => target.classList.remove("ring-4", "ring-accent"),
      1400,
    );
    // Auto-expand the detail by clicking its toggle if collapsed
    const toggle = target.querySelector<HTMLButtonElement>(
      'button[aria-expanded="false"]',
    );
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
            <div className="pixel text-[8px] text-accent/80">
              JUMP TO EVIDENCE ↓
            </div>
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

const TheRunner = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<string | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;
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
    setQuiz(null);
    setPendingHighlights(null);
    setActiveHighlights(null);
    setHighlightStepIdx(null);
    setHighlightSource(null);
  };

  const stepHighlights =
    step?.kind === "evidence" && highlightStepIdx === i ? activeHighlights : null;

  // Find last evidence step to render a recap when a late-stage choice highlights it
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
        <Link to="/chapter/society" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          CHAPTER Z · THE RUNNER
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
            {step.image && (
              <div
                className="relative w-full overflow-hidden border-2 border-primary shadow-[var(--shadow-pixel)]"
                style={{ aspectRatio: "16 / 10", imageRendering: "pixelated" }}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 bg-card/90 border-2 border-primary px-2 py-1 shadow-[var(--shadow-pixel)]">
                  <div className="pixel text-[10px] text-primary">{step.title}</div>
                </div>
              </div>
            )}
            {!step.image && (
              <div className="bg-card/90 border-2 border-primary px-3 py-2 shadow-[var(--shadow-pixel)] inline-block">
                <div className="pixel text-[10px] text-primary">{step.title}</div>
              </div>
            )}
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
              <div className="pixel text-[10px] text-primary">📚 Post-Chapter Learning</div>
              <p className="text-sm mt-2">
                A scam syndicate used phone impersonation and a runner to collect cash, gold and valuables in person — exploiting authority, fear and confidentiality.
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ Following orders is not a defence.</li>
                <li>✔ Impersonating a public officer is its own offence.</li>
                <li>✔ Cross-border crime requires cross-border investigation.</li>
              </ul>
            </div>

            <div className="bg-background/80 border-2 border-accent p-3 space-y-2">
              <div className="pixel text-[10px] text-accent">{QUIZ.title}</div>
              <p className="text-sm">{QUIZ.prompt}</p>
              {QUIZ.options.map((o) => {
                const picked = quiz === o.id;
                const tone = quiz
                  ? o.best
                    ? "border-primary bg-primary/25"
                    : picked
                      ? "border-destructive/70 bg-destructive/15"
                      : "border-primary/30 bg-background/60"
                  : "border-primary/40 bg-background/70";
                return (
                  <button
                    key={o.id}
                    onClick={() => setQuiz(o.id)}
                    className={`w-full text-left p-2 border-2 transition-colors ${tone}`}
                  >
                    <span className="pixel text-[10px] text-primary mr-2">{o.id}.</span>
                    <span className="text-sm">{o.label}</span>
                    {quiz && o.best && (
                      <span className="pixel text-[8px] text-primary ml-2">★ CORRECT</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">
                RETRY
              </button>
              <Link to="/chapter/society" className="pixel-btn text-sm text-center">
                CONTINUE
              </Link>
            </div>
          </>
        )}
      </main>
    </GameFrame>
  );
};

export default TheRunner;
