import { useMemo, useState } from "react";
import T from "@/components/T";
import StarReward from "@/components/story/StarReward";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";
import SceneDialogue from "@/components/story/SceneDialogue";
import EvidenceBoard, { EvidenceItem } from "@/components/story/EvidenceBoard";
import ChoicePanel from "@/components/story/ChoicePanel";
import { sceneImageFor } from "@/lib/sceneImages";
import { useStoryProgress } from "@/hooks/useStoryProgress";

type ChoiceKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7";
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

export const STORY: Step[] = [
  {
    kind: "scene",
    title: "📖 Case Brief", sceneKey: "report",
    lines: [
      { text: "Time: 2026 · Location: A neighbourhood police station, Kuala Lumpur." },
      { text: "Victim: Madam Tan (58). Reports being scammed of RM48,000 in cash, handed to a man at her front door." },
      { who: "You", inner: true, text: "Cash. At the door. That detail alone says this is not random." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Act I · The Report", sceneKey: "report",
    lines: [
      { who: "Madam Tan", text: "“He said he was from the Monetary Authority… that my account was used for money laundering.”" },
      { who: "Madam Tan", text: "“I was so scared. He said an officer would come and collect the cash for ‘safekeeping’. So I gave it.”" },
      { who: "You", inner: true, text: "Authority. Fear. Compliance. The three legs of every scam like this." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Initial Assessment",
    prompt: "What kind of crime are you looking at?",
    options: [
      { id: "A", label: "Simple fraud — one bad actor", hint: "Underestimates the operation.", rationale: "A door-to-door cash collector implies a script, a caller, a courier and a launderer. Not one person." },
      { id: "B", label: "Organised crime syndicate", best: true, hint: "Match the complexity.", rationale: "Vishing + on-site collection + cash routing is a multi-role pipeline. Treat it as a syndicate from minute one.", evidenceTags: ["syndicate"] },
      { id: "C", label: "Lone-wolf opportunist", hint: "Doesn't fit the choreography.", rationale: "Lone wolves don't run scripted impersonations across multiple call centres." },
      { id: "D", label: "Indeterminable", ok: true, hint: "Cautious — but slow.", rationale: "Defensible posture, but the call+collection pattern already points to organised activity." },
    ],
    reveal: "Best: B. The complexity of vishing + on-site cash pickup is the signature of a syndicate.",
  },
  {
    kind: "scene",
    title: "🎬 Act II · Deconstructing the Modus Operandi", sceneKey: "call",
    lines: [
      { text: "You pull the victim's call logs and listen to a recording she kept on speaker." },
      { who: "Caller", text: "“You are suspected of illegal activity. You must cooperate with the investigation.”" },
      { who: "Caller", text: "“Your funds must be temporarily frozen for verification. Do not tell anyone — this is confidential.”" },
      { who: "You", inner: true, text: "Authority + intimidation + isolation. Textbook." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Call & Communication Evidence",
    items: [
      { id: "call-recording", type: "video", title: "Recording · ‘Monetary Authority’ call", label: "23 minutes. Calm authoritative voice. Refers to non-existent case number.", detail: "Spoofed Caller ID showing a real BNM exchange prefix. Classic vishing signature.", tags: ["pattern", "syndicate"] },
      { id: "call-script", type: "note", title: "Repeated phrasing across calls", text: "‘Suspected of illegal activity’ · ‘cooperate with the investigation’ · ‘funds must be frozen for verification’.", detail: "Word-for-word phrasing matches three other reports filed this month.", tags: ["pattern", "syndicate"] },
      { id: "victim-stmt", type: "chat", from: "C", text: "“He told me not to tell anyone. He said the bank could be involved too.”", title: "Victim statement", detail: "Isolation tactic — cuts the victim off from anyone who would break the spell.", tags: ["pattern"] },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Assessing the Tactic",
    prompt: "What is the caller actually doing?",
    options: [
      { id: "A", label: "Providing genuine assistance", hint: "Banks don't work this way.", rationale: "No regulator asks the public for cash for ‘safekeeping’. Ever." },
      { id: "B", label: "General information notice", hint: "Too neutral.", rationale: "Misses the deliberate pressure escalation in the script." },
      { id: "C", label: "Creating panic to control behaviour", best: true, hint: "Name the technique.", rationale: "The script is engineered: status threat → urgency → secrecy → instruction. Pure social engineering.", evidenceRefs: ["call-recording", "call-script"], evidenceTags: ["pattern"] },
      { id: "D", label: "Standard regulatory communication", hint: "Wrong frame.", rationale: "Legitimate notices are written, traceable, and never demand cash." },
    ],
    reveal: "Correct: C. Panic + secrecy is the tool that turns a phone call into a transfer.",
  },
  {
    kind: "scene",
    title: "🎬 Act III · On-Site Description", sceneKey: "doorstep",
    lines: [
      { who: "Madam Tan", text: "“He dressed very formally. Dark suit. Wore a wig. He looked just like a real official.”" },
      { who: "Madam Tan", text: "“He showed me an ID card. It looked correct. I didn't think to check it closely.”" },
      { who: "You", inner: true, text: "The wig is not random. The wig is the costume." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 On-Site Evidence",
    items: [
      { id: "doorbell-cctv", type: "cctv", title: "Doorbell camera capture", label: "Suit, briefcase, wig, fake laminated ID lanyard.", detail: "Wardrobe clearly chosen to mimic a regulator/officer — psychological props, not a disguise.", tags: ["pattern", "syndicate"] },
      { id: "fake-id", type: "note", title: "‘Officer ID’ left at scene", text: "Plastic card with a misspelled department name and stock photo.", detail: "Cheap, mass-printed. Designed to hold up for 30 seconds at a doorstep.", tags: ["pattern"] },
      { id: "victim-impression", type: "chat", from: "C", text: "“He looked like he belonged. That's why I opened the door.”", title: "Victim impression", detail: "Confirms the wardrobe achieved its psychological purpose.", tags: ["pattern"] },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Key Insight",
    prompt: "Why does the suspect dress that way?",
    options: [
      { id: "A", label: "Appearance is inherently trustworthy", hint: "That's the trap.", rationale: "The whole scam relies on victims thinking exactly this." },
      { id: "B", label: "Using appearance to manufacture trust", best: true, hint: "Costume = weapon.", rationale: "The suit, wig and ID are tools of psychological compliance — the visual half of the script.", evidenceRefs: ["doorbell-cctv", "fake-id"], evidenceTags: ["pattern"] },
      { id: "C", label: "Irrelevant detail", hint: "It's the whole point.", rationale: "The wardrobe is engineered. It is the most relevant detail." },
      { id: "D", label: "Random personal style", hint: "Too coincidental.", rationale: "Three other victims this month described the same wig and suit." },
    ],
    reveal: "Correct: B. The mask of authority is a tool — the costume completes the script.",
  },
  {
    kind: "scene",
    title: "🎬 Act IV · The Financial Trail", sceneKey: "money",
    lines: [
      { text: "Bank intel comes back. The cash didn't sit." },
      { who: "Bank Liaison", text: "“Deposited within two hours. Split across seven mule accounts. Out to crypto in under a day.”" },
      { who: "You", inner: true, text: "That isn't one person spending stolen money. That is a laundering pipeline." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Money Flow",
    items: [
      { id: "deposit-log", type: "list", title: "CDM deposit log", text: "RM48,000 → 7 accounts · 6 branches · within 110 minutes.", detail: "Coordinated deposit pattern — typical of mule networks operating to a checklist.", tags: ["pattern", "syndicate"] },
      { id: "mule-accounts", type: "note", title: "Mule account profiles", text: "Accounts opened by students and foreign workers, all reporting their cards ‘rented out’.", detail: "Standard mule recruitment — accounts are disposable layers between scammer and money.", tags: ["syndicate"] },
      { id: "crypto-offramp", type: "note", title: "Crypto off-ramp", text: "Final hop converts to USDT via an unlicensed P2P trader.", detail: "Money leaves the regulated system. Recovery becomes nearly impossible past this point.", tags: ["syndicate"] },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Nature of the Case",
    prompt: "What is the structure behind the money flow?",
    options: [
      { id: "A", label: "Single-person fraud", hint: "Doesn't scale to 7 mules.", rationale: "One person cannot coordinate seven simultaneous deposits across six branches." },
      { id: "B", label: "Syndicate operation", best: true, hint: "Match the choreography.", rationale: "Caller + collector + deposit team + off-ramp = a division of labour. That's a syndicate.", evidenceRefs: ["deposit-log", "mule-accounts", "crypto-offramp"], evidenceTags: ["syndicate"] },
      { id: "C", label: "Occasional incident", hint: "Repeat phrasing says otherwise.", rationale: "Identical scripts across multiple cases means a recurring operation." },
      { id: "D", label: "Uncertain", hint: "The flow is unambiguous.", rationale: "The money trail is the clearest fingerprint a syndicate leaves." },
    ],
    reveal: "Correct: B. The money flow is the syndicate's signature.",
  },
  {
    kind: "scene",
    title: "🎬 Act V · Arrest & Interrogation", sceneKey: "interrogation",
    lines: [
      { text: "A patrol picks up the suspect on his next collection run. Same suit. Same wig in the bag." },
      { who: "Suspect", text: "(smirking) “I'm just the guy who picks up the cash. You'll never find the people behind this.”" },
      { who: "You", inner: true, text: "He's right that he's a runner. He's wrong that the trail ends at him." },
    ],
  },
  {
    kind: "choice",
    key: "q5",
    title: "🎮 Choice ⑤ · Interrogation Response",
    prompt: "How do you respond to the smirk?",
    options: [
      { id: "A", label: "Accept his statement at face value", hint: "Lets him define the case.", rationale: "Treats the runner as the ceiling. The whole upstream operation walks." },
      { id: "B", label: "Press him for the source of instructions", best: true, hint: "Follow the script.", rationale: "The runner had to be told where to go and what to say. That source is the lead.", evidenceTags: ["syndicate"] },
      { id: "C", label: "Direct accusation of being the mastermind", hint: "Wrong target.", rationale: "He's a runner. Charging him as mastermind blows the case and tips off the handlers." },
      { id: "D", label: "Change the subject", hint: "Loses momentum.", rationale: "Smirks harden in silence." },
    ],
    reveal: "Correct: B. The runner is a lead, not a destination.",
  },
  {
    kind: "scene",
    title: "🎬 Twist · The Script Folder", sceneKey: "scripts",
    lines: [
      { text: "Forensics opens his phone." },
      { who: "Tech", text: "“There's a folder labelled SCRIPTS. Police Officer. Bank Manager. Court Official. Each role has its own dialogue tree.”" },
      { who: "Tech", text: "“And a contact list — handlers, deposit teams, a P2P trader. Same numbers we saw on three other case files.”" },
      { who: "You", inner: true, text: "Not a scam. A franchise." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Phone Evidence",
    items: [
      { id: "script-folder", type: "list", title: "‘SCRIPTS’ folder", text: "Roles: Police Officer · Bank Manager · Court Official · Customs.", detail: "Standardised dialogue trees with branching responses. This is industrial-scale fraud production.", tags: ["pattern", "syndicate"] },
      { id: "handler-contacts", type: "note", title: "Handler contact list", text: "Numbers shared with three prior open cases.", detail: "Direct link to the upstream cyber-fraud syndicate already on the watchlist.", tags: ["syndicate"] },
      { id: "laundering-link", type: "note", title: "P2P trader overlap", text: "Same off-ramp used in a 2025 drug-money laundering file.", detail: "Suggests the syndicate launders proceeds from multiple criminal streams through the same pipe.", tags: ["syndicate"] },
    ],
  },
  {
    kind: "insight",
    title: "⚖️ Legal Frame · Malaysia",
    text:
      "Penal Code §419 — cheating by personation (impersonating a public officer / institution). Penal Code §420 — cheating and dishonestly inducing delivery of property (the cash handover). Combined with AMLA 2001 for the laundering layer. The runner is liable under §419/§420; the syndicate adds organised crime and money-laundering charges.",
  },
  {
    kind: "scene",
    title: "🎬 Act VI · The Charge", sceneKey: "verdict",
    lines: [
      { text: "Two final calls. Who is he, and what did he do?" },
      { who: "You", inner: true, text: "Frame the role. Then frame the offence." },
    ],
  },
  {
    kind: "choice",
    key: "q6",
    title: "🎮 Choice ⑥ · Suspect's Role",
    prompt: "How do you classify the suspect?",
    options: [
      { id: "A", label: "Mastermind", hint: "Doesn't fit the evidence.", rationale: "The phone shows him receiving instructions, not issuing them." },
      { id: "B", label: "Executor / runner", best: true, hint: "Match the evidence.", rationale: "He is a paid courier inside a larger script. Charge him accurately and use him as the bridge upstream.", evidenceRefs: ["script-folder", "handler-contacts"], evidenceTags: ["syndicate"] },
      { id: "C", label: "Uninvolved bystander", hint: "He had the wig.", rationale: "Caught mid-collection, in costume. Not a bystander." },
      { id: "D", label: "Victim of circumstance", hint: "Sympathy is not evidence.", rationale: "Coercion would need its own proof — none on the record." },
    ],
    reveal: "Correct: B. Name him as a runner — and then follow the wires.",
  },
  {
    kind: "choice",
    key: "q7",
    title: "🎮 Choice ⑦ · Criminal Classification",
    prompt: "What offence does this case constitute?",
    options: [
      { id: "A", label: "Misleading behaviour", hint: "Far too soft.", rationale: "Misses both the impersonation and the property element." },
      { id: "B", label: "Generic fraud (§420 only)", ok: true, hint: "Partial.", rationale: "Captures the cash handover but ignores the impersonation that made it possible." },
      { id: "C", label: "Cheating by personation (§419) + §420", best: true, hint: "The full frame.", rationale: "The mask of authority is the offence. §419 + §420 stacks correctly here, with AMLA on the syndicate layer.", evidenceRefs: ["doorbell-cctv", "fake-id", "script-folder"], evidenceTags: ["pattern", "syndicate"] },
      { id: "D", label: "Simple civil dispute", hint: "Wrong forum.", rationale: "Cash extracted by impersonation is criminal, not civil." },
    ],
    reveal: "Correct: C. The impersonation is what unlocks §419 — and the syndicate charges sit on top.",
  },
];

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Hard fails — treating it as petty / accepting the runner as the ceiling
  if (a.q1 === "A" && a.q4 !== "B") return "red";
  if (a.q5 === "A" || a.q5 === "C") return "red";

  let score = 0;
  if (a.q1 === "B") score += 2;
  else if (a.q1 === "D") score++;
  if (a.q2 === "C") score += 2;
  if (a.q3 === "B") score += 2;
  if (a.q4 === "B") score += 2;
  if (a.q5 === "B") score += 2;
  if (a.q6 === "B") score += 2;
  if (a.q7 === "C") score += 2;
  else if (a.q7 === "B") score++;

  const justice = a.q4 === "B" && a.q5 === "B" && a.q6 === "B" && a.q7 === "C" && score >= 11;
  if (justice) return "green";
  if (a.q7 !== "C" && score < 8) return "red";
  return "yellow";
}

const ENDINGS = {
  green: {
    tag: "🟢 Perfect Ending",
    title: "The Mask Comes Off",
    body: "The runner is charged under §419 + §420. His phone unlocks the upstream chain: handlers, mule recruiters, the P2P launderer. The cyber-fraud syndicate's KL cell is dismantled. A public advisory goes out: no regulator ever asks for cash at your door.",
  },
  yellow: {
    tag: "🟡 Average Ending",
    title: "Runner Down, Operation Up",
    body: "The runner is convicted. The cash is partly recovered. But the handlers are still calling. The script folder leads to numbers that go silent within hours. The syndicate adapts — the wig changes, the script doesn't.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Filed as Petty Crime",
    body: "The case is closed at the runner. Charges are reduced; the upstream operation never sees a file opened on it. The mastermind stays invisible. Madam Tan's neighbour gets the same call next week.",
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

const MaskOfAuthority = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "mask-of-authority", title: "The Mask of Authority", route: "/story/mask-of-authority", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
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
        {i > 0 ? (<button type="button" onClick={() => { setI(i - 1); setRevealedAt(null); }} className="pixel-btn-square" aria-label="Previous">←</button>) : (<Link to="/quest" className="pixel-btn-square" aria-label="Back">←</Link>)}<Link to="/quest" className="pixel-btn-square" aria-label="Cases" title="Cases">🏠</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          <T>CHAPTER 6 · THE MASK OF AUTHORITY</T>
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
              const sceneImg = step.image ?? sceneImageFor("mask-of-authority", step.sceneKey ?? step.title);
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
                    <div className="pixel text-[10px] text-primary"><T>{step.title}</T></div>
                  </div>
                </div>
              ) : (
                <div className="bg-card/90 border-2 border-primary px-3 py-2 shadow-[var(--shadow-pixel)] inline-block">
                  <div className="pixel text-[10px] text-primary"><T>{step.title}</T></div>
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
            <div className="pixel text-[10px] text-primary"><T>{step.title}</T></div>
            <p className="text-base mt-2"><T>{step.text}</T></p>
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
              revealed={!!answers[step.key]}
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
            <T>{i === total - 1 ? "REVEAL ENDING ▶" : "NEXT ▶"}</T>
          </button>
        )}

        {done && ending && (
          <>
            <div className="bg-card/95 border-2 border-primary p-3 shadow-[var(--shadow-pixel)]">
              <div className="pixel text-[10px] text-accent"><T>{ENDINGS[ending].tag}</T></div>
              <div className="pixel text-sm text-primary mt-1"><T>{ENDINGS[ending].title}</T></div>
              <p className="text-base mt-2 leading-snug"><T>{ENDINGS[ending].body}</T></p>
            </div>

            <StarReward slug="mask-of-authority" story={STORY} answers={answers as Record<string, string>} ending={ending} />

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 What This Teaches</div>
              <p className="text-sm mt-2">
                <T>The mask of authority works because we are trained to obey it. The scam is industrial: a script for the call, a costume for the door, a pipeline for the cash. Stopping the runner is not stopping the operation.</T>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ No regulator ever asks the public for cash at the door.</li>
                <li>✔ Spoofed Caller ID can mimic any official number — verify by calling back the real line.</li>
                <li>✔ §419 (personation) + §420 (cheating) is the correct frame, with AMLA on the syndicate.</li>
                <li>✔ The runner is a lead, not a destination — follow the script folder upstream.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">
                REPLAY
              </button>
              <Link to="/quest" className="pixel-btn text-sm text-center">
                <T>CONTINUE</T>
              </Link>
            </div>
          </>
        )}
      </main>
    </GameFrame>
  );
};

export default MaskOfAuthority;
