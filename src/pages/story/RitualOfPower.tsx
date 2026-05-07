import { useMemo, useState } from "react";
import T from "@/components/T";
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
  | { kind: "scene"; title: string; sceneKey?: string; image?: string; lines: { who?: string; text: string; inner?: boolean }[]; mediaFeed?: { red: string; blue: string } }
  | { kind: "evidence"; title: string; items: EvidenceItem[] }
  | { kind: "choice"; key: ChoiceKey; title: string; prompt: string; options: Choice[]; reveal?: string }
  | { kind: "insight"; title: string; text: string };

const STORY: Step[] = [
  {
    kind: "scene",
    title: "📖 Case Brief", sceneKey: "disappearance",
    lines: [
      { text: "Time: 2026 · Location: Kuala Lumpur." },
      { text: "Subject: Dato' Rahman, prominent political figure. Missing six days." },
      { who: "You", inner: true, text: "When a Dato' goes missing, the city moves. So does the press." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Act I · The Disappearance", sceneKey: "mentor",
    lines: [
      { text: "Bank intel: RM 3.2 million in transfers over four months — all to a single recipient." },
      { who: "Investigator", text: "“The recipient calls himself a 'spiritual mentor'. The Dato' was paying for a ritual to ‘enhance his political power’.”" },
      { who: "You", inner: true, text: "Money + secrecy + a charismatic mentor. Three sides of the same triangle." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Initial Frame",
    prompt: "How do you frame the case?",
    options: [
      { id: "A", label: "Standard missing-person inquiry", hint: "Ignores the money trail.", rationale: "RM 3.2M in transfers is not a missing-person case — it's a fraud case with a missing person attached." },
      { id: "B", label: "Suspicious disappearance + financial fraud", best: true, hint: "Match the evidence.", rationale: "The money proves intent on someone's part. Treat fraud and disappearance as one investigation.", evidenceTags: ["fraud"] },
      { id: "C", label: "Voluntary disappearance", hint: "Convenient for the mentor.", rationale: "‘Voluntary’ is exactly the framing the perpetrator wants you to accept." },
      { id: "D", label: "Ordinary cult activity", ok: true, hint: "Closer.", rationale: "Defensible, but doesn't capture the financial extraction yet." },
    ],
    reveal: "Best: B. The bank trail is the spine. Don't separate the money from the man.",
  },
  {
    kind: "scene",
    title: "🎬 Act II · The Ritual Site", sceneKey: "ritual",
    lines: [
      { text: "A safehouse on the city outskirts. Candles still warm. Sigils chalked across the floor." },
      { who: "Forensics", text: "“We found him. Single fatal injury. Inflicted by another person — not self-administered.”" },
      { text: "On the altar: a phone. On the phone: a 14-minute video of the ritual itself, and an audio file." },
      { who: "You", inner: true, text: "He filmed his own ceremony. Of course he did." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence #1 · ‘It Was Voluntary’",
    items: [
      { id: "ritual-video", type: "video", title: "Ritual video (14 min)", label: "Victim walks in, kneels, participates fully. No visible coercion.", detail: "Looks, on its face, like consent. Reliable as recording — but consent is not the legal question.", tags: ["consent-trap"] },
      { id: "audio-consent", type: "video", title: "Audio · ‘I accept all consequences.’", label: "Victim speaks the line clearly.", detail: "Recorded the night before. Designed to be played back exactly here, at exactly this moment.", tags: ["consent-trap"] },
      { id: "ritual-injury", type: "note", title: "Forensic · fatal injury", text: "Wound inflicted by a second person; angle and force inconsistent with self-infliction.", detail: "The hand on the blade was not the victim's. Whatever was said into the microphone, the act was someone else's.", tags: ["lethal-act"] },
      { id: "cause-of-death", type: "note", title: "Pathology · not survivable", text: "Injury is immediately fatal. No medical aid would have saved him.", detail: "The act was not a procedure that ‘went wrong’. It ends only one way.", tags: ["lethal-act"] },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Does Consent Remove Liability?",
    prompt: "The victim said he accepted all consequences. So?",
    options: [
      { id: "A", label: "Yes — consent erases the offence", hint: "The legal trap.", rationale: "If this were true, every contract killer could walk by recording the victim's voice. The law does not work that way." },
      { id: "B", label: "Reduces it to negligence", ok: true, hint: "Closer, but wrong frame.", rationale: "Negligence assumes accident. A second person inflicted a non-survivable injury — that is not negligence." },
      { id: "C", label: "Consent is not a defence to taking life", best: true, hint: "Anchor on §300/§302.", rationale: "Under the Penal Code, consent does not legalise an act intended to cause death. Agreement does not equal legality.", evidenceRefs: ["ritual-injury", "cause-of-death"], evidenceTags: ["lethal-act"] },
      { id: "D", label: "Need more evidence", hint: "Evidence is on the table.", rationale: "Forensics and pathology already establish a non-survivable injury inflicted by another. The legal question is settled." },
    ],
    reveal: "Correct: C. Consent does not licence killing. The recording is a smokescreen — not a defence.",
  },
  {
    kind: "insight",
    title: "⚖️ Consent and Life — Legal Frame",
    text:
      "Malaysia · Penal Code §300 defines murder; §302 sets the punishment. Consent under §87–§91 covers acts not intended or known to cause death — it does not cover an act the doer knows is likely to be fatal. A pre-recorded ‘I accept all consequences’ has no legal weight against an intentional lethal act.",
  },
  {
    kind: "scene",
    title: "🎬 Act III · The Assistant Lina", sceneKey: "assistant",
    lines: [
      { text: "Lina, 24. The mentor's assistant. Lived inside the safehouse for two years." },
      { who: "Lina", text: "“He chose what I ate. What I read. When I slept. He told me the Dato' was being ‘elevated’.”" },
      { who: "Lina", text: "“I prepared the room. I lit the candles. I tried to leave twice. He found me both times.”" },
      { who: "You", inner: true, text: "Two people stood in that room. Only one was free to walk out." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence #2 · The Assistant's Position",
    items: [
      { id: "lina-prep", type: "note", title: "Lina prepared the ritual", text: "Lit candles, arranged sigils, set up the recording.", detail: "Material participation in the act. Cannot be wished away.", tags: ["participation"] },
      { id: "lina-diary", type: "note", title: "Lina's diary — fear & escape attempts", text: "Two documented attempts to leave. Both ended in being brought back.", detail: "Establishes coercion as a sustained condition, not a one-off claim.", tags: ["coercion"] },
      { id: "mentor-control-log", type: "list", title: "Control log (mentor's own notes)", text: "Sleep schedule · phone access · meal portions · permitted reading.", detail: "Textbook coercive control — written, dated, in his own hand.", tags: ["coercion"] },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Lina's Status",
    prompt: "How do you classify Lina?",
    options: [
      { id: "A", label: "Pure accomplice — full sentence", hint: "Ignores the coercion record.", rationale: "Two escape attempts and the mentor's own control log make ‘pure accomplice’ untenable." },
      { id: "B", label: "Pure victim — no charges", ok: true, hint: "Humane, but ignores participation.", rationale: "She prepared the ritual. The law cannot pretend the preparation didn't happen." },
      { id: "C", label: "Both — accomplice in act, victim of coercion", best: true, hint: "The honest reading.", rationale: "Charges stand under §34, but the coercion is material mitigation at sentencing — the conflict between moral and legal responsibility is the case.", evidenceRefs: ["lina-prep", "lina-diary", "mentor-control-log"], evidenceTags: ["coercion", "participation"] },
    ],
    reveal: "Best: C. Mitigation, not acquittal. The law sees both halves.",
  },
  {
    kind: "scene",
    title: "🎬 Act IV · Money vs Faith", sceneKey: "mentor",
    lines: [
      { text: "On the desk: bank statements stacked beside leather-bound ritual notebooks." },
      { who: "Investigator", text: "“He's been writing this liturgy for nine years. The transfers started four months ago.”" },
      { who: "You", inner: true, text: "He believed something. He also charged for it. Both can be true." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence #3 · Mixed Motive",
    items: [
      { id: "bank-transfers", type: "list", title: "Bank transfers · RM 3.2M / 4 months", text: "Twelve transfers from the Dato' to four mentor-controlled accounts.", detail: "Escalating amounts following each ‘session’ — pricing strategy, not donation pattern.", tags: ["fraud"] },
      { id: "ritual-notes", type: "note", title: "Nine years of ritual notebooks", text: "Hand-written liturgy, dated, internally consistent.", detail: "Suggests genuine personal belief — predates the financial scheme by years.", tags: ["belief"] },
      { id: "client-list", type: "list", title: "Client list", text: "Eleven other paying ‘students’. Politicians, executives, two media owners.", detail: "Belief was monetised at scale. The mentor is sincere AND running a business.", tags: ["fraud"] },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Motive",
    prompt: "What was driving the mentor?",
    options: [
      { id: "A", label: "Pure scam — no real belief", ok: true, hint: "Half right.", rationale: "Captures the §420 element but ignores nine years of unpaid notebooks." },
      { id: "B", label: "Sincere faith — no real fraud", hint: "Half right.", rationale: "Sincere belief does not erase RM 3.2M in escalating extractions." },
      { id: "C", label: "Mixed motive — sincere belief, monetised", best: true, hint: "The honest reading.", rationale: "Real-world manipulators are rarely one-dimensional. The belief is the bait; the money is the business.", evidenceRefs: ["bank-transfers", "ritual-notes", "client-list"], evidenceTags: ["fraud", "belief"] },
    ],
    reveal: "Correct: C. Mixed motives are the norm, not the exception.",
  },
  {
    kind: "scene",
    title: "🎬 Act V · Media Pressure", sceneKey: "media",
    lines: [
      { text: "By morning, every screen in the country is talking about this case." },
      { who: "You", inner: true, text: "Two stories. Both loud. Neither is evidence." },
    ],
    mediaFeed: {
      red: "🔴 OCCULT KILLINGS! Mystic Cult Murders Politician — Capital in Shock",
      blue: "🔵 ‘He Volunteered’ — Insiders Claim Dato' Knew Exactly What He Wanted",
    },
  },
  {
    kind: "choice",
    key: "q5",
    title: "🎮 Choice ⑤ · Media Influence",
    prompt: "How do you handle the press?",
    options: [
      { id: "A", label: "Lean into ‘Occult Killings!’", hint: "Public sentiment is not evidence.", rationale: "Sensational framing produces fast headlines and weak prosecutions." },
      { id: "B", label: "Lean into ‘Victim Volunteered!’", hint: "Apologist framing.", rationale: "The ‘he asked for it’ narrative is exactly the consent trap the case turns on." },
      { id: "C", label: "Anchor on evidence; ignore both feeds", best: true, hint: "The professional answer.", rationale: "High-profile cases are won and lost by which narrative the investigator absorbs. Yours must be the file, not the feed." },
      { id: "D", label: "Issue a calming public statement", ok: true, hint: "Procedural, not investigative.", rationale: "Reasonable for a press officer. Not a substitute for analytic discipline." },
    ],
    reveal: "Best: C. The headline is not the case. The file is the case.",
  },
  {
    kind: "scene",
    title: "🎬 Act VI · The Failed-Ritual Twist", sceneKey: "interrogation",
    lines: [
      { who: "Mentor", text: "“It was a ritual. He wanted power. It was an unintended overreach. A regrettable accident.”" },
      { who: "You", inner: true, text: "Then why does the policy in your name pre-date the ‘accident’ by three weeks?" },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence #4 · Premeditation",
    items: [
      { id: "prior-deaths", type: "list", title: "Two prior ‘ritual deaths’", text: "Both involved the mentor. Both ruled accidental at the time.", detail: "Pattern across years — and across jurisdictions. The ‘accident’ has happened before.", tags: ["premeditation"] },
      { id: "lethal-instructions", type: "note", title: "Mentor's own notes — fatal step", text: "Step 9: ‘the vessel must be opened for the energy to depart’.", detail: "Written instruction, in his own hand, for the lethal act. Knowledge ≠ accident.", tags: ["premeditation"] },
      { id: "insurance-payout", type: "note", title: "Insurance policy — mentor as beneficiary", text: "Policy taken out three weeks before the ritual.", detail: "Financial benefit pre-arranged. The clearest premeditation marker on the file.", tags: ["premeditation", "fraud"] },
    ],
  },
  {
    kind: "choice",
    key: "q6",
    title: "🎮 Choice ⑥ · Was It Murder?",
    prompt: "What is the legal frame for the death?",
    options: [
      { id: "A", label: "Failed ritual / accident", hint: "Refuted by the file.", rationale: "Two prior ‘accidents’ + a written fatal step + an insurance policy is not an accident pattern." },
      { id: "B", label: "Voluntary self-harm by victim", hint: "Forensics already disproved this.", rationale: "The injury was inflicted by a second person. Self-harm is not on the table." },
      { id: "C", label: "Premeditated lethal act — §302", best: true, hint: "The honest reading.", rationale: "Pattern + written instruction + pre-arranged financial benefit = premeditation. §302 stacks with §420 on the fraud and §34 on Lina.", evidenceRefs: ["prior-deaths", "lethal-instructions", "insurance-payout"], evidenceTags: ["premeditation"] },
    ],
    reveal: "Correct: C. The ritual is the costume. The killing was planned.",
  },
  {
    kind: "choice",
    key: "q7",
    title: "🎮 Choice ⑦ · Victim's Responsibility",
    prompt: "Where does the victim sit in the analysis?",
    options: [
      { id: "A", label: "No responsibility — full stop", ok: true, hint: "Legally accurate.", rationale: "Victims of murder do not share criminal liability for their own death. Legally, this is the right answer." },
      { id: "B", label: "No legal liability, but real errors of judgment", best: true, hint: "The honest analytic answer.", rationale: "Risk-taking ≠ liability. Acknowledging poor judgment helps prevention without shifting blame off the perpetrator.", evidenceTags: ["belief"] },
      { id: "C", label: "Partial criminal responsibility", hint: "Legally wrong.", rationale: "Victims do not ‘share’ their own murder. This is the framing that produces failure endings." },
    ],
    reveal: "Best: B. Legally A, analytically B. Never C — that path is how cases get buried.",
  },
  {
    kind: "insight",
    title: "⚖️ Final Legal Frame · Malaysia",
    text:
      "Mentor: Penal Code §302 (murder) + §420 (cheating, on the RM 3.2M extraction). Lina: §34 (acts done by several persons in furtherance of common intention) — charges stand, but coercion is material mitigation at sentencing. The client list opens leads into the wider psychological-control network.",
  },
  {
    kind: "scene",
    title: "🎬 Verdict", sceneKey: "verdict",
    lines: [
      { text: "The bench is set. The file is closed at the door." },
      { who: "You", inner: true, text: "Now we see which story the court takes — yours, or the headline's." },
    ],
  },
];

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Hard fails — accepting consent or accident as the frame
  if (a.q2 === "A" || a.q2 === "B") return "red";
  if (a.q6 === "A" || a.q6 === "B") return "red";
  if (a.q7 === "C") return "red";

  let score = 0;
  if (a.q1 === "B") score += 2;
  else if (a.q1 === "D") score++;
  if (a.q2 === "C") score += 2;
  if (a.q3 === "C") score += 2;
  else if (a.q3 === "B") score++;
  if (a.q4 === "C") score += 2;
  else if (a.q4 === "A") score++;
  if (a.q5 === "C") score += 2;
  else if (a.q5 === "D") score++;
  if (a.q6 === "C") score += 2;
  if (a.q7 === "B") score += 2;
  else if (a.q7 === "A") score++;

  const justice = a.q2 === "C" && a.q3 === "C" && a.q6 === "C" && score >= 11;
  if (justice) return "green";
  if (score <= 6) return "red";
  return "yellow";
}

const ENDINGS = {
  green: {
    tag: "🟢 Perfect Ending",
    title: "The Mask Falls",
    body: "The mentor is convicted under §302 + §420. Lina is convicted under §34 with a substantially reduced sentence — coercion is on the record. The client list opens leads into the psychological-control network feeding the wider syndicate arc.",
  },
  yellow: {
    tag: "🟡 Ambiguous Ending",
    title: "Verdict Without Closure",
    body: "The mentor is convicted of murder. The court accepts §302. But the public still debates whether the victim ‘asked for it’, and Lina's coercion was argued thinly — her sentence is harsher than it needed to be. The client list goes uninvestigated.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Filed as ‘Ritual Accident’",
    body: "The case is recorded as accidental death during a ritual. The mentor walks. The client list never sees a warrant. Within a year, another name appears on his appointment book — and the headline writes itself again.",
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

const RitualOfPower = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "ritual-of-power", title: "The Ritual of Power", route: "/story/ritual-of-power", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
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
          <T>CHAPTER 7 · THE RITUAL OF POWER</T>
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
              const sceneImg = step.image ?? sceneImageFor("ritual-of-power", step.sceneKey ?? step.title);
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
            {step.mediaFeed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="border-2 border-destructive bg-destructive/15 p-2" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>
                  <div className="pixel text-[8px] text-destructive">📺 TABLOID FEED</div>
                  <p className="text-xs mt-1 leading-snug">{step.mediaFeed.red}</p>
                </div>
                <div className="border-2 border-primary bg-primary/15 p-2" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>
                  <div className="pixel text-[8px] text-primary">📰 OPINION FEED</div>
                  <p className="text-xs mt-1 leading-snug">{step.mediaFeed.blue}</p>
                </div>
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

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 What This Teaches</div>
              <p className="text-sm mt-2">
                <T>Belief and crime are not opposites. The mentor was sincere AND criminal. The victim consented AND was murdered. Lina helped AND was held captive. The whole case is the discipline to hold both halves at once.</T>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ Consent is not a defence to taking life — agreement does not equal legality.</li>
                <li>✔ Real motives are usually mixed; pure scam vs pure faith is rarely the truth.</li>
                <li>✔ Coercion is mitigation, not acquittal — Lina is both accomplice and victim.</li>
                <li>✔ The headline is not the file. Anchor on evidence, not on which feed is louder.</li>
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

export default RitualOfPower;
