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

type ChoiceKey = "q1" | "q2" | "q3" | "q4" | "iA" | "iB" | "q5A" | "q5B";
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
    title: "📖 Act I · The Tip-off", sceneKey: "tipoff",
    lines: [
      { who: "Officer Tan", text: "“Recent intelligence suggests a drug trafficking operation has emerged at a local university — and the scale is significant.”" },
      { who: "You", inner: true, text: "Significant means structure. Structure means a chain." },
      { who: "Officer Tan", text: "“This isn't just a substance abuse problem. It's a supply chain problem.”" },
      { who: "You", inner: true, text: "Then I don't chase a user. I follow the money — or the messages." },
    
      { who: "Officer Tan", text: "“Recent intelligence suggests a drug trafficking operation has emerged at a local university — and the scale is significant.”" },
      { who: "You", inner: true, text: "Significant means structure. Structure means a chain." },
      { who: "Officer Tan", text: "“This isn't just a substance abuse problem. It's a supply chain problem.”" },
      { who: "You", inner: true, text: "Then I don't chase a user. I follow the money — or the messages." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Investigation Starting Point",
    prompt: "Where do you begin?",
    options: [
      { id: "A", label: "Raid the student dorms immediately", hint: "Fast, but loud.", rationale: "Tips off the network. Evidence is destroyed before you read the first chat." },
      { id: "B", label: "Tail suspicious transactions", best: true, hint: "Quiet, patient, productive.", rationale: "Surveillance maps the chain without alerting it. Standard early-stage tradecraft.", evidenceTags: ["chat", "chain"] },
      { id: "C", label: "Analyse financial flows", best: true, hint: "Money never lies.", rationale: "E-wallet patterns reveal a distribution model long before any seizure.", evidenceTags: ["money"] },
      { id: "D", label: "Observe the campus environment first", ok: true, hint: "Background, not breakthrough.", rationale: "Useful context, but slow. Won't crack the case alone." },
    ],
    reveal: "Best: B or C. Investigate the chain before you touch the node.",
  },
  {
    kind: "scene",
    title: "🎬 Act II · Surveillance Intercept", sceneKey: "surveillance",
    lines: [
      { text: "A burner phone is mirrored. Group chats spill onto your screen." },
      { who: "You", inner: true, text: "Too clean. No emojis, no slang. Just product words." },
    ],
  },
  {
    kind: "evidence",
    title: "📱 Evidence 1 · Coded Chat Logs",
    items: [
      {
        type: "chat", from: "A", text: "new stock in 🌿",
        id: "chat-stock", title: "Chat · 'new stock in'",
        tags: ["chat", "chain"],
        detail: "Wholesale-style announcement. ‘Stock’ language treats supply as inventory, not personal use. Timestamp aligns with the next inbound wave on the e-wallet.",
      },
      {
        type: "chat", from: "B", text: "green stuff still RM50/pack?",
        id: "chat-pack", title: "Chat · 'RM50/pack'",
        tags: ["chat", "money"],
        detail: "Per-unit pricing + plural ‘pack’ implies retail bundling. Standardised price = a market, not a one-off favour.",
      },
      {
        type: "chat", from: "A", text: "ya. min 5 pack for delivery",
        id: "chat-min", title: "Chat · 'min 5 pack'",
        tags: ["chat", "chain"],
        detail: "Minimum order quantity is a reseller mechanic. A personal user has no need to set MOQs.",
      },
      {
        type: "chat", from: "C", text: "need 10. usual drop?",
        id: "chat-drop", title: "Chat · 'usual drop'",
        tags: ["chat", "chain"],
        detail: "‘Usual drop’ implies a recurring pickup location. Recurrence is the hallmark of distribution, not consumption.",
      },
      {
        type: "chat", from: "A", text: "back gate. 11pm.",
        id: "chat-loc", title: "Chat · 'back gate 11pm'",
        tags: ["chat"],
        detail: "Late-night, low-CCTV corridor. Operationally chosen — not casually agreed.",
      },
      { type: "note", text: "“Stock”, “pack”, “drop” — wholesale vocabulary, not personal use." },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Assessing the Content",
    prompt: "How do you classify these messages?",
    options: [
      { id: "A", label: "Normal commercial transaction", hint: "Ignores the coded language.", rationale: "No legitimate retail talks about “drops at the back gate at 11pm”." },
      { id: "B", label: "Suspicious transaction", best: true, hint: "Cautious, evidence-led.", rationale: "Suspicion is enough to escalate surveillance. Conclusions wait for chemistry.", evidenceRefs: ["chat-stock", "chat-drop"], evidenceTags: ["chat"] },
      { id: "C", label: "Clear illegal contraband", hint: "Premature without lab proof.", rationale: "“Green stuff” is suggestive, not proof. Charging now risks a thrown-out case." },
      { id: "D", label: "Indeterminable", hint: "You have more than nothing.", rationale: "Refusing to assess is also a decision — and the wrong one here." },
    ],
    reveal: "Best: B. Strong suspicion, not yet certainty.",
  },
  {
    kind: "scene",
    title: "🎭 Act III · The Two Faces", sceneKey: "twofaces",
    lines: [
      { text: "Two names recur in the surveillance feed." },
      { who: "Profiler", text: "“Suspect A — average grades, low profile. But unexplained income.”" },
      { who: "Profiler", text: "“Suspect B — wide social circle. Frequent nightclubs. Charismatic.”" },
      { who: "You", inner: true, text: "One handles supply. One handles reach. They look nothing alike — that's the point." },
    ],
  },
  {
    kind: "evidence",
    title: "🪪 Suspect Profiles",
    items: [
      {
        type: "list", text: "Suspect A · 21 · quiet · 3 e-wallets · cash deposits inconsistent with allowance",
        id: "prof-a", title: "Profile · Suspect A",
        tags: ["money", "suspect-a"],
        detail: "Three separate e-wallets is unusual for a student. Splits inflows across accounts to stay under per-account anomaly thresholds.",
      },
      {
        type: "list", text: "Suspect B · 22 · social butterfly · introduces buyers · no direct stock holding observed",
        id: "prof-b", title: "Profile · Suspect B",
        tags: ["chain", "suspect-b"],
        detail: "B never touches the product. Acts as a broker between supply (A) and end buyers — pure distribution role.",
      },
      { type: "note", text: "Different roles. Same chain. Don't fall for the obvious target." },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Who is more suspicious?",
    prompt: "Read the two profiles. Who do you focus on?",
    options: [
      { id: "A", label: "Suspect A — financial anomalies", ok: true, hint: "Half the picture.", rationale: "A holds the supply, but ignoring B leaves the distribution network intact.", evidenceRefs: ["prof-a"] },
      { id: "B", label: "Suspect B — behavioural anomalies", hint: "The flashy one.", rationale: "Easy to suspect, but B alone explains nothing about the supply or the money.", evidenceRefs: ["prof-b"] },
      { id: "C", label: "Both — they fulfil different roles", best: true, hint: "Read the roles, not the vibes.", rationale: "A = supply node. B = distribution node. The chain only works because of both.", evidenceRefs: ["prof-a", "prof-b"], evidenceTags: ["chain"] },
      { id: "D", label: "Both look like ordinary students", hint: "Exactly the cover.", rationale: "“Ordinary” is the disguise. The evidence already contradicts it." },
    ],
    reveal: "Correct: C. The chain has multiple nodes — investigate them as a system.",
  },
  {
    kind: "evidence",
    title: "💰 Evidence 2 · E-Wallet Records",
    items: [
      {
        type: "list", text: "47 inbound transfers in 30 days · RM30–RM250 · 22 unique senders",
        id: "wallet-in", title: "Wallet · 47 inbound",
        tags: ["money", "chain"],
        detail: "High-frequency, low-value, many-to-one inflows = retail demand. Senders cluster within campus geofences.",
      },
      {
        type: "list", text: "Outbound: 3 large transfers to a single account flagged in another state",
        id: "wallet-out", title: "Wallet · 3 outbound",
        tags: ["money", "chain"],
        detail: "Few, large outbound payments to a single cross-state account = upstream wholesaler. The shape of a Ponzi-of-supply.",
      },
      { type: "note", text: "Many small in, few large out. Textbook retail-to-wholesaler structure." },
    ],
  },
  {
    kind: "evidence",
    title: "📦 Evidence 3 · The Package",
    items: [
      {
        type: "list", text: "Recovered from Dorm 4C ceiling panel",
        id: "pkg-loc", title: "Package · ceiling stash",
        tags: ["weight"],
        detail: "Concealment in a ceiling panel = deliberate hiding. Demonstrates knowledge of the contents.",
      },
      {
        type: "list", text: "8 vacuum-sealed bags · uniform weight · plant matter",
        id: "pkg-bags", title: "Package · 8 sealed bags",
        tags: ["weight", "chain"],
        detail: "Uniform sealing implies pre-portioned retail units, not bulk personal stash.",
      },
      {
        type: "list", text: "No personal-use paraphernalia nearby — only packaging supplies",
        id: "pkg-supplies", title: "Package · packaging supplies",
        tags: ["chain"],
        detail: "Vacuum sealer, scales, ziplocks — the tooling of a distributor, not a user.",
      },
      { type: "note", text: "Packaging supplies = preparation to distribute. Not consumption." },
    ],
  },
  {
    kind: "evidence",
    title: "🧪 Evidence 4 · Lab Report",
    items: [
      {
        type: "list", text: "Substance: Cannabis (confirmed)",
        id: "lab-id", title: "Lab · cannabis confirmed",
        tags: ["forensics"],
        detail: "Confirmed by GC-MS. Removes ambiguity — no longer ‘green stuff’, now a controlled substance.",
      },
      {
        type: "list", text: "Total weight: 1.27 kg",
        id: "lab-weight", title: "Lab · 1.27kg total",
        tags: ["weight", "forensics"],
        detail: "Above the statutory threshold under the Dangerous Drugs Act 1952. Triggers the presumption of trafficking.",
      },
      {
        type: "list", text: "Purity consistent across all 8 bags — single source",
        id: "lab-purity", title: "Lab · uniform purity",
        tags: ["chain", "forensics"],
        detail: "Same source = same upstream supplier. Forensic confirmation of the supply chain inferred from the chats.",
      },
      { type: "note", text: "Over 1kg. Under Malaysian law, the threshold matters enormously." },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Nature of the Case",
    prompt: "Given quantity, packaging, and transfer frequency — what is this?",
    options: [
      { id: "A", label: "Personal use", hint: "Ignores 1.27kg + 47 transfers.", rationale: "Dangerous downgrade. Treats a network as a private habit." },
      { id: "B", label: "Small-scale dealing", hint: "Minimises the scale.", rationale: "47 buyers and uniform packaging exceed “small-scale”.", evidenceRefs: ["wallet-in"] },
      { id: "C", label: "Distribution network", best: true, hint: "Quantity + frequency = structure.", rationale: "The financial pattern, packaging, and weight together establish a distribution operation.", evidenceRefs: ["wallet-in", "wallet-out", "pkg-bags", "lab-weight"], evidenceTags: ["chain", "weight", "money"] },
      { id: "D", label: "Uncertain", hint: "The evidence is unusually clear.", rationale: "Refusing to classify wastes the strongest evidence set in the case." },
    ],
    reveal: "Correct: C. This is a distribution network, not personal use.",
  },
  {
    kind: "insight",
    title: "⚖️ Legal Insight · Dangerous Drugs Act 1952",
    text: "Possession of cannabis exceeding statutory thresholds triggers a presumption of trafficking under the Dangerous Drugs Act 1952. Trafficking is a capital offence — punishable by life imprisonment or the death penalty. The burden then shifts to the accused to rebut the presumption.",
  },
  {
    kind: "scene",
    title: "🎬 Act V · Interrogating Suspect A", sceneKey: "interrogation-a",
    lines: [
      { who: "Suspect A", text: "“I was just helping to keep it for someone. I don't even know what's inside.”" },
      { who: "You", inner: true, text: "Then explain the e-wallet ledger. 47 transfers don't ‘keep themselves’." },
    ],
  },
  {
    kind: "choice",
    key: "iA",
    title: "🎮 Interrogation A · Press Point",
    prompt: "Where do you push?",
    options: [
      { id: "A", label: "Believe the story, release on bail", hint: "Hands the chain back its supplier.", rationale: "Ignores documented financial activity. Fatal to the case." },
      { id: "B", label: "Question the source of the funds", best: true, hint: "Money is the contradiction.", rationale: "His own e-wallet contradicts the “just keeping it” story. The crack opens here.", evidenceRefs: ["wallet-in", "wallet-out"], evidenceTags: ["money"] },
      { id: "C", label: "Threaten with maximum sentence", hint: "Coercion taints confessions.", rationale: "Improperly obtained statements get excluded. Don't poison your own evidence." },
      { id: "D", label: "Drop and pivot to Suspect B", hint: "You haven't used your leverage.", rationale: "A still holds key answers about the upstream supplier. Don't waste the room." },
    ],
    reveal: "Best: B. The financial trail is the lever.",
  },
  {
    kind: "scene",
    title: "🎬 Act V · Interrogating Suspect B", sceneKey: "interrogation-b",
    lines: [
      { who: "Suspect B", text: "“Everyone is selling it. I'm just one of many. Why me?”" },
      { who: "You", inner: true, text: "“One of many” means there's a many. So tell me about the many." },
    ],
  },
  {
    kind: "choice",
    key: "iB",
    title: "🎮 Interrogation B · Press Point",
    prompt: "Where do you push?",
    options: [
      { id: "A", label: "Accept the excuse", hint: "Surrenders the lead.", rationale: "“Everyone does it” is deflection, not defence." },
      { id: "B", label: "Press for the upstream supplier", best: true, hint: "Use his own framing against him.", rationale: "If he's “one of many”, he can name the source. This is how you climb the chain.", evidenceRefs: ["chat-drop", "wallet-out"], evidenceTags: ["chain"] },
      { id: "C", label: "Charge him as the sole organiser", hint: "Overreach against the evidence.", rationale: "B is a distributor, not the apex. Charging him as kingpin collapses at trial." },
      { id: "D", label: "Drop the interview", hint: "You're at the breakthrough.", rationale: "Stopping now leaves the syndicate untouched." },
    ],
    reveal: "Best: B. He just admitted there's a network — climb it.",
  },
  {
    kind: "insight",
    title: "💥 Critical Breakthrough",
    text: "Both suspects independently point upstream. A previously unnamed “Supplier” enters the case file — a node neither student fully knows.",
  },
  {
    kind: "choice",
    key: "q5A",
    title: "⚖️ Charge · Suspect A",
    prompt: "Final charge for Suspect A (supply node, 1.27kg, 47 transfers)?",
    options: [
      { id: "A", label: "Possession only", hint: "Ignores statutory threshold.", rationale: "Above the trafficking threshold, possession-only is legally indefensible here." },
      { id: "B", label: "Distributor", ok: true, hint: "Defensible, but understated.", rationale: "Captures the conduct, but the weight presumption pushes higher.", evidenceRefs: ["pkg-bags"] },
      { id: "C", label: "Trafficking", best: true, hint: "Triggered by weight + intent indicators.", rationale: "Quantity over threshold + packaging + ledger = trafficking under the DDA 1952 presumption.", evidenceRefs: ["lab-weight", "pkg-bags", "wallet-in"], evidenceTags: ["weight", "forensics"] },
      { id: "D", label: "Insufficient evidence", hint: "You have a forensic match.", rationale: "Lab report + financial trail + physical seizure: this is among the strongest evidence sets possible." },
    ],
    reveal: "Best: C. The presumption of trafficking is squarely engaged.",
  },
  {
    kind: "choice",
    key: "q5B",
    title: "⚖️ Charge · Suspect B",
    prompt: "Final charge for Suspect B (distribution-side, no stock holding observed)?",
    options: [
      { id: "A", label: "Possession", hint: "He never held stock.", rationale: "No physical possession was observed — the wrong charge frame." },
      { id: "B", label: "Distributor", best: true, hint: "Matches his role exactly.", rationale: "Acts as the broker / introducer between supply (A) and buyers. That is distribution.", evidenceRefs: ["chat-drop", "prof-b"], evidenceTags: ["chain"] },
      { id: "C", label: "Trafficking (capital)", hint: "Over-charge for his role.", rationale: "Without weight in his possession, the trafficking presumption doesn't anchor on him." },
      { id: "D", label: "Insufficient evidence", hint: "Chats and surveillance say otherwise.", rationale: "The intercepted messages and observed introductions are sufficient." },
    ],
    reveal: "Best: B. Charge to the role evidenced — distributor.",
  },
  {
    kind: "evidence",
    title: "📁 Phone Forensics · Beyond the Campus",
    items: [
      {
        type: "phone", label: "Contacts list: 14 entries — all coded numerics, no names", status: "ok",
        id: "phone-contacts", title: "Phone · coded contacts",
        tags: ["chain", "forensics"],
        detail: "Numeric handles instead of names = compartmentalisation. Each student knows only their adjacent node — the syndicate's classic firewall.",
      },
      {
        type: "list", text: "Transaction history links to 3 accounts flagged in 2 other states",
        id: "phone-accounts", title: "Phone · cross-state accounts",
        tags: ["money", "chain"],
        detail: "Account fingerprints match prior intelligence files from other state task forces. This campus is a branch, not the trunk.",
      },
      {
        type: "list", text: "Encrypted folder · same upload signature as content seen in Chapter 1 · Silent Fall",
        id: "phone-link", title: "Phone · syndicate signature",
        tags: ["chain"],
        detail: "Identical upload signature ties this case to the underground content network from Silent Fall — the same syndicate, two faces.",
      },
      { type: "note", text: "This isn't one campus. This is one node in something national." },
    ],
  },
  {
    kind: "insight",
    title: "🔗 Main Story Connection",
    text: "The coded contacts and cross-state account links match the syndicate signature first seen in the Silent Fall investigation. The Green Trade is one branch of a National Drug Syndicate — and the Boss is now in scope.",
  },
  {
    kind: "scene",
    title: "🎬 Act VIII · Final Reflection", sceneKey: "reflection",
    lines: [
      { text: "The case file closes on two students. The map on the wall opens onto the rest of the country." },
      { who: "You", inner: true, text: "Two arrests. One node. The chain still hums somewhere upstream." },
      { who: "You", text: "“We didn't catch a dealer. We found a doorway.”" },
    ],
  },
];

const QUIZ = {
  title: "🎓 Mini Quiz",
  prompt: "Why does the 1.27kg figure matter so much in this case?",
  options: [
    { id: "A", label: "It proves who the buyers are" },
    { id: "B", label: "It triggers the statutory presumption of trafficking", best: true },
    { id: "C", label: "It is needed to prove personal use" },
  ] as Choice[],
};

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  if (a.q4 === "A" || a.q5A === "A") return "red";
  let score = 0;
  if (["B", "C"].includes(a.q1 ?? "")) score++;
  if (a.q2 === "B") score++;
  if (a.q3 === "C") score++;
  if (a.q4 === "C") score += 2;
  if (a.iA === "B") score++;
  if (a.iB === "B") score++;
  if (a.q5A === "C") score += 2;
  if (a.q5B === "B") score++;
  if (score >= 9) return "green";
  if (score >= 5) return "yellow";
  return "red";
}

const ENDINGS = {
  green: {
    tag: "🟢 Perfect Ending",
    title: "The Chain Revealed",
    body: "Both students convicted to the correct charge. Phone metadata exposes the upstream supplier and a cross-state account network. The investigation escalates to the National Drug Syndicate — main storyline unlocked.",
  },
  yellow: {
    tag: "🟡 Realistic Ending",
    title: "Two Caught, Network Intact",
    body: "The students are convicted, but the coded contacts and upstream leads go unanalysed in time. The syndicate quietly reroutes. The campus is quieter — for now.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Closed as Personal Use",
    body: "The severity is underestimated and the case is downgraded. The packaging, ledger, and lab weight are filed away. The main-story lead goes cold.",
  },
};

const GreenTrade = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<string | null>(null);
  // highlights queued by the most recent choice — applied to the next evidence step
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "green-trade", title: "The Green Trade", route: "/story/green-trade", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
  const ending = useMemo(() => (done ? gradeEnding(answers) : null), [done, answers]);
  const step = !done ? STORY[i] : null;

  const next = () => {
    setRevealedAt(null);
    setI((x) => {
      const nx = x + 1;
      // If we have pending highlights and the next step is an evidence board, apply them.
      if (pendingHighlights && STORY[nx]?.kind === "evidence") {
        setActiveHighlights(pendingHighlights);
        setHighlightStepIdx(nx);
        setPendingHighlights(null);
      } else {
        // Clear stale highlights if leaving the highlighted evidence step
        if (highlightStepIdx !== null && nx !== highlightStepIdx) {
          setActiveHighlights(null);
          setHighlightStepIdx(null);
        }
      }
      return nx;
    });
  };

  const choose = (key: ChoiceKey, id: string) => {
    setAnswers((a) => ({ ...a, [key]: id }));
    setRevealedAt(i);
    // Find option to extract evidence refs
    const stepNow = STORY[i];
    if (stepNow?.kind === "choice") {
      const opt = stepNow.options.find((o) => o.id === id);
      if (opt && (opt.evidenceRefs?.length || opt.evidenceTags?.length)) {
        setPendingHighlights({
          ids: opt.evidenceRefs ?? [],
          tags: opt.evidenceTags ?? [],
        });
      } else {
        setPendingHighlights(null);
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
  };

  const stepHighlights =
    step?.kind === "evidence" && highlightStepIdx === i ? activeHighlights : null;

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-5 px-5 flex items-center gap-3">
        {i > 0 ? (<button type="button" onClick={() => { setI(i - 1); setRevealedAt(null); }} className="pixel-btn-square" aria-label="Previous">←</button>) : (<Link to="/quest" className="pixel-btn-square" aria-label="Back">←</Link>)}<Link to="/quest" className="pixel-btn-square" aria-label="Cases" title="Cases">🏠</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          <T>CHAPTER 2 · THE GREEN TRADE</T>
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
              const sceneImg = step.image ?? sceneImageFor("green-trade", step.sceneKey ?? step.title);
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

            <StarReward slug="green-trade" story={STORY} answers={answers as Record<string, string>} ending={ending} />

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 <T>Post-Chapter Learning</T></div>
              <p className="text-sm mt-2">
                <T>A campus distribution ring concealed itself behind ordinary student lives — coded chats, small e-wallet flows, and a single ceiling-panel stash.</T>
              </p>
              <p className="text-sm mt-2 italic">
                <T>“Catching the dealer is not the case. Mapping the chain is.”</T>
              </p>
            </div>

            <div className="bg-background/80 border-2 border-accent p-3 space-y-2">
              <div className="pixel text-[10px] text-accent"><T>{QUIZ.title}</T></div>
              <p className="text-sm"><T>{QUIZ.prompt}</T></p>
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
                    <span className="text-sm"><T>{o.label}</T></span>
                    {quiz && o.best && (
                      <span className="pixel text-[8px] text-primary ml-2"><T>★ CORRECT</T></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">
                <T>RETRY</T>
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

export default GreenTrade;
