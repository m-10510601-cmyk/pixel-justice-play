import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";
import SceneDialogue from "@/components/story/SceneDialogue";
import EvidenceBoard, { EvidenceItem } from "@/components/story/EvidenceBoard";
import ChoicePanel from "@/components/story/ChoicePanel";
import { sceneImageFor } from "@/lib/sceneImages";
import { useStoryProgress } from "@/hooks/useStoryProgress";

type ChoiceKey = "q1" | "q2" | "q3" | "q4" | "q5b" | "q5c" | "q6" | "q7";
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
    title: "📖 Case Brief", sceneKey: "er",
    lines: [
      { text: "Time: 2026 · Location: A district hospital in Malaysia." },
      { text: "Victim: Adi (6). Brought into the ER unresponsive. The guardian says he fell from the bed." },
      { who: "You", inner: true, text: "Some cases feel wrong from the very first second." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Act I · The Unexpected Report", sceneKey: "er",
    lines: [
      { who: "Doctor", text: "“He was non-responsive on arrival… the family says it was a fall from the bed.”" },
      { who: "Guardian", text: "“It was just a fall! A total accident!”" },
      { who: "You", inner: true, text: "The doctor whispered. The guardian shouted. Two volumes — one truth." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Initial Judgement",
    prompt: "What is your first reading of the case?",
    options: [
      { id: "A", label: "Looks like a standard accident", hint: "Closes the inquiry too early.", rationale: "Most real-world cases fail here — the file gets stamped 'accident' before evidence is even reviewed." },
      { id: "B", label: "Verify whether the injuries match the explanation", best: true, hint: "Anchor on the medical record.", rationale: "An investigator's first move: compare the story to the body. Mismatches surface fast." },
      { id: "C", label: "The guardian's account is credible", hint: "Trust without verification.", rationale: "Credibility is earned by evidence, not volume. Premature trust closes doors." },
      { id: "D", label: "Insufficient information to judge", best: true, hint: "Hold every theory open.", rationale: "Right posture: no theory wins until the evidence speaks." },
    ],
    reveal: "Best: B or D. A and C are how silent cases get filed and forgotten.",
  },
  {
    kind: "scene",
    title: "🎬 Act II · Medical Anomalies", sceneKey: "medical",
    lines: [
      { who: "Doctor", text: "“Multiple bruises. Fractures in different stages of healing.”" },
      { who: "Doctor", text: "“One accident cannot explain scars from three months ago and a fresh wound from today.”" },
      { who: "You", inner: true, text: "A 'single fall' does not heal in layers." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Medical Evidence",
    items: [
      { id: "med-report", type: "note", title: "Medical Report — multi-stage injuries", text: "Bruises and fractures at distinct healing stages.", detail: "Forensic radiology cannot reconcile these with a single fall.", tags: ["pattern", "medical"] },
      { id: "xray-old", type: "video", title: "X-ray · Old fracture (~3 months)", label: "Calcified callus on left ulna — old, partly remodelled.", detail: "Classic indicator of a healed prior break.", tags: ["pattern", "medical"] },
      { id: "xray-new", type: "video", title: "X-ray · Fresh fracture (today)", label: "Acute fracture, no callus formation.", detail: "Hours-old injury, unrelated to the older break.", tags: ["pattern", "medical"] },
      { id: "guardian-stmt", type: "chat", from: "C", text: "“He fell from the bed. That's all.”", title: "Guardian statement", detail: "Single-event explanation. Inconsistent with multi-stage findings.", tags: ["statement"] },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Evidence Interpretation",
    prompt: "How do you read the medical findings?",
    options: [
      { id: "A", label: "Active child — frequent minor injuries", hint: "Common excuse.", rationale: "Activity does not produce healing layers across months in this distribution." },
      { id: "B", label: "Possible recurring injuries", ok: true, hint: "Closer — but vague.", rationale: "Defensible, but stops short of naming the legal frame." },
      { id: "C", label: "Possible chart error", hint: "Two independent X-rays?", rationale: "Two timestamped X-rays make a chart error implausible." },
      { id: "D", label: "Inconsistent with a single-event accident", best: true, hint: "The legal anchor.", rationale: "This is the strongest finding — it directly contradicts the only explanation on record.", evidenceRefs: ["med-report", "xray-old", "xray-new"], evidenceTags: ["pattern"] },
    ],
    reveal: "Correct: D. This finding is what unlocks the rest of the investigation.",
  },
  {
    kind: "scene",
    title: "🎬 Act III · The Neighbourhood", sceneKey: "neighborhood",
    lines: [
      { who: "Neighbour A", text: "“I often heard crying… but I didn't want to interfere in family matters.”" },
      { who: "Neighbour B", text: "“I once saw the child alone outside, very late at night.”" },
      { who: "You", inner: true, text: "Silence is its own kind of evidence." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Community Testimony",
    items: [
      { id: "neigh-a", type: "chat", from: "A", text: "“I often heard crying — but it isn't my business.”", title: "Neighbour A", detail: "Recurring distress over months. Hearsay weight, but corroborates the medical pattern.", tags: ["pattern", "system-failure"] },
      { id: "neigh-b", type: "chat", from: "B", text: "“The child was outside alone, late at night.”", title: "Neighbour B", detail: "Suggests neglect of supervision. Independent of Neighbour A.", tags: ["pattern", "system-failure"] },
      { id: "school-silence", type: "note", title: "School log — bruises noted, never reported", text: "Form-teacher recorded visible bruises three times. No referral made.", detail: "Mandatory reporting under the Child Act 2001 was not triggered.", tags: ["system-failure"] },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Assessing Testimony",
    prompt: "What pattern do these testimonies establish?",
    options: [
      { id: "A", label: "Standard family friction", hint: "Downplays severity.", rationale: "The 'normal family' frame is exactly how long-term abuse stays invisible." },
      { id: "B", label: "Possible neglect of care", ok: true, hint: "Partial.", rationale: "Captures part of it, but misses the recurring physical pattern." },
      { id: "C", label: "Neighbours are unreliable sources", hint: "Two independent reports?", rationale: "Two independent witnesses + a school log is not unreliable — it's a chorus." },
      { id: "D", label: "Long-term abnormal pattern", best: true, hint: "Name what you see.", rationale: "Independent voices + school silence = a sustained pattern, not a single bad night.", evidenceRefs: ["neigh-a", "neigh-b", "school-silence"], evidenceTags: ["pattern"] },
    ],
    reveal: "Best: D. Multiple independent sources converge — that's a pattern, not a coincidence.",
  },
  {
    kind: "scene",
    title: "🎬 Act IV · Hidden Records", sceneKey: "records",
    lines: [
      { text: "You pull cross-clinic records." },
      { who: "You", inner: true, text: "Different hospitals. Different doctors. Same explanation, every time." },
      { text: "Seven 'minor injury' visits across four clinics in eighteen months. Every entry: 'accident'." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Historical Records",
    items: [
      { id: "clinic-records", type: "list", title: "Cross-clinic visit log", text: "7 visits · 4 clinics · 18 months · all logged 'accident'.", detail: "No clinic ran a child-protection check; each treated its own visit in isolation.", tags: ["pattern", "system-failure"] },
      { id: "school-log", type: "note", title: "School incident log", text: "Bruises noted on three separate dates. No referral filed.", detail: "Mandatory reporting failure — Child Act 2001 §31 obligations.", tags: ["system-failure"] },
      { id: "cps-no-referral", type: "note", title: "Child Protection — no prior referral", text: "JKM has no record of this child.", detail: "The system never opened a file. The room stayed silent.", tags: ["system-failure"] },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Pattern Recognition",
    prompt: "What does the cross-clinic record show?",
    options: [
      { id: "A", label: "Coincidence", hint: "Seven? Across four clinics?", rationale: "Statistically and clinically untenable." },
      { id: "B", label: "A clumsy child", hint: "The phrase that hides abuse.", rationale: "This is precisely the cover story that kept every prior file closed." },
      { id: "C", label: "Pattern of systemic physical abuse", best: true, hint: "Behaviour, not event.", rationale: "Shifts the frame from a single act to a course of conduct — the legal threshold for ill-treatment.", evidenceRefs: ["clinic-records", "school-log", "cps-no-referral"], evidenceTags: ["pattern", "system-failure"] },
      { id: "D", label: "General parental negligence", ok: true, hint: "Closer, but soft.", rationale: "Defensible, but understates the active component the records imply." },
    ],
    reveal: "Correct: C. The shift from 'accident' to 'pattern' is the case.",
  },
  {
    kind: "scene",
    title: "🎬 Act V · Interrogation", sceneKey: "interrogation",
    lines: [
      { who: "Guardian", text: "“I tried my best! You have no idea how hard it is to raise a child like him!”" },
      { who: "You", inner: true, text: "Sympathy is a door. The question is who walks through it." },
      { who: "You", text: "“The medical report shows these injuries happened weeks apart. How did he 'fall' every Tuesday for a month?”" },
      { who: "Guardian", text: "(quietly) “He was so naughty… I was just disciplining him.”" },
      { who: "You", inner: true, text: "There it is. The line between discipline and abuse just spoke." },
    ],
  },
  {
    kind: "choice",
    key: "q5b",
    title: "🎮 Choice ⑤a · Focus on Timeline",
    prompt: "Do you anchor the interrogation on the timeline of injuries?",
    options: [
      { id: "Y", label: "Yes — pin down dates and explanations", best: true, hint: "Forces consistency.", rationale: "A timeline turns vague excuses into testable claims. Every gap becomes a question.", evidenceTags: ["pattern"] },
      { id: "N", label: "No — skip the timeline", hint: "You lose the frame.", rationale: "Without a timeline the guardian's story stays slippery." },
    ],
    reveal: "Best: Yes. The timeline is the spine of the case.",
  },
  {
    kind: "choice",
    key: "q5c",
    title: "🎮 Choice ⑤b · Confront Medical Contradictions",
    prompt: "Do you confront the guardian with the medical contradictions?",
    options: [
      { id: "Y", label: "Yes — present the X-rays directly", best: true, hint: "Evidence speaks.", rationale: "Confrontation with concrete evidence is what produced the 'discipline' admission.", evidenceRefs: ["xray-old", "xray-new"] },
      { id: "N", label: "No — keep evidence in reserve", ok: true, hint: "Tactically defensible.", rationale: "Reasonable, but slower. Risk of the guardian rebuilding the story." },
    ],
    reveal: "Best: Yes. Combined with the timeline, this is the strongest interrogation strategy.",
  },
  {
    kind: "insight",
    title: "⚖️ Discipline vs Abuse — Legal Frame",
    text:
      "Malaysia · Penal Code §302 (murder) and §304 (culpable homicide not amounting to murder) cover lethal outcomes. Child Act 2001 specifically criminalises ill-treatment, neglect, abandonment or exposure of a child. 'Discipline' is not a defence to a sustained pattern of physical harm.",
  },
  {
    kind: "scene",
    title: "🎬 Act VI · Legal Junction", sceneKey: "verdict",
    lines: [
      { text: "The file is on the bench. Two questions remain." },
      { who: "You", inner: true, text: "What was the conduct? And what did it cause?" },
    ],
  },
  {
    kind: "choice",
    key: "q6",
    title: "🎮 Choice ⑥ · Nature of the Conduct",
    prompt: "How do you classify the guardian's conduct?",
    options: [
      { id: "A", label: "Strict discipline", hint: "Within parental rights?", rationale: "Discipline does not produce repeated fractures across months." },
      { id: "B", label: "Excessive discipline", ok: true, hint: "Closer.", rationale: "Recognises harm but still frames it as discipline gone wrong." },
      { id: "C", label: "Persistent abuse / physical harm", best: true, hint: "Course of conduct.", rationale: "Matches the Child Act 2001 definition of ill-treatment — sustained, intentional, harmful." },
    ],
    reveal: "Correct: C. The pattern is the offence.",
  },
  {
    kind: "choice",
    key: "q7",
    title: "🎮 Choice ⑦ · Nature of the Death",
    prompt: "What caused the child's death?",
    options: [
      { id: "A", label: "A single accidental fall", hint: "The original story.", rationale: "Refuted by the multi-stage injury record." },
      { id: "B", label: "Compound accidents", hint: "Statistically impossible.", rationale: "Seven 'accidents' across four clinics is not a sequence — it is a pattern." },
      { id: "C", label: "Death resulting from long-term abuse / neglect", best: true, hint: "The honest finding.", rationale: "Fits both the medical record and the course-of-conduct frame.", evidenceTags: ["pattern", "system-failure"] },
    ],
    reveal: "Correct: C. The cause of death is the pattern, not the last fall.",
  },
];

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Hard fails — closing the case at the door
  if ((a.q1 === "A" || a.q1 === "C") && a.q2 !== "D") return "red";

  let score = 0;
  if (a.q1 === "B" || a.q1 === "D") score++;
  if (a.q2 === "D") score += 2;
  else if (a.q2 === "B") score++;
  if (a.q3 === "D") score += 2;
  else if (a.q3 === "B") score++;
  if (a.q4 === "C") score += 2;
  else if (a.q4 === "D") score++;
  if (a.q5b === "Y") score++;
  if (a.q5c === "Y") score++;
  else if (a.q5c === "N") score += 0; // tactical, not punished
  if (a.q6 === "C") score += 2;
  else if (a.q6 === "B") score++;
  if (a.q7 === "C") score += 2;

  const justice = a.q4 === "C" && a.q6 === "C" && a.q7 === "C" && score >= 9;
  if (justice) return "green";
  if (a.q7 !== "C" && score < 7) return "red";
  return "yellow";
}

const ENDINGS = {
  green: {
    tag: "🟢 Justice Ending",
    title: "The Room Speaks",
    body: "Abuse is proven on the record. The guardian is convicted under the Child Act 2001 and §304 of the Penal Code. The district announces a mandatory cross-clinic flagging system and mandatory school referrals. The next child like Adi will not go unseen.",
  },
  yellow: {
    tag: "🟡 Realistic Ending",
    title: "Too Little, Too Late",
    body: "Conviction lands on negligence causing death. Specific intent could not be proved beyond reasonable doubt. The guardian goes to prison. The school, the neighbours and the clinics walk free — even though the silence was theirs too.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Closed as Accident",
    body: "The file is stamped 'accidental fall'. The case closes. The clinic records remain unlinked, the school never reports, and the neighbours never speak again. The room stays silent. So does the system.",
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

const SilentRoom = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "silent-room", title: "The Silent Room", route: "/story/silent-room", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
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
        <Link to="/chapter/society" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          CHAPTER W · THE SILENT ROOM
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
              const sceneImg = step.image ?? sceneImageFor("silent-room", step.sceneKey ?? step.title);
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
                The Silent Room was never silent because of one villain. The school noticed the bruises and stayed quiet. The neighbours heard the crying and stayed quiet. Four clinics treated the same child and never linked their files.
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ A pattern of injuries is the legal frame, not a single event.</li>
                <li>✔ "Discipline" is not a defence to sustained physical harm.</li>
                <li>✔ Mandatory reporting (Child Act 2001) exists for exactly this case.</li>
                <li>✔ System failure is everyone's silence, not just the guardian's act.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">
                REPLAY
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

export default SilentRoom;