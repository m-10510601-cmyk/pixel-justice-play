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

export const STORY: Step[] = [
  {
    kind: "scene",
    title: "📖 Case Brief", sceneKey: "dorm-night",
    lines: [
      { text: "Time: 2026 · Location: A military university dormitory, Selangor." },
      { text: "Incident: A laptop is reported missing. One junior cadet is singled out — without proof." },
      { who: "You", inner: true, text: "A missing laptop. A closed dorm. A suspect chosen by mood, not evidence. This already smells wrong." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Act I · The Seed of Suspicion (Day 1)", sceneKey: "dorm-night",
    lines: [
      { who: "Student A", text: "“My laptop is gone.”" },
      { who: "Student B", text: "“He was the only one in the room while we were out.”" },
      { who: "Victim", text: "“I… I didn't take it. I swear.”" },
      { who: "Student A", text: "“Then explain why you were here.”" },
      { who: "You", inner: true, text: "Four voices. One target. No proof yet — only momentum." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Initial Judgment",
    prompt: "How should the group treat the accusation?",
    options: [
      { id: "A", label: "Trust the group's intuition", hint: "This is how mobs start.", rationale: "Group certainty without evidence is the seed of every miscarriage in this kind of case." },
      { id: "B", label: "Demand physical evidence", best: true, hint: "Anchor on facts.", rationale: "Bag check, room logs, CCTV at the dorm entrance — evidence is the only legitimate path.", evidenceTags: ["collective"] },
      { id: "C", label: "Escalate to a senior officer / warden", ok: true, hint: "Procedural, but slow.", rationale: "Right channel, but inside this seniority culture, the officer is often part of the problem." },
      { id: "D", label: "Stay a silent bystander", hint: "Silence is consent here.", rationale: "Saying nothing now is what allows the next nine days to happen." },
    ],
    reveal: "Best: B. The case dies — or escalates fatally — at this first choice.",
  },
  {
    kind: "scene",
    title: "🎬 Act II · The Interrogation (Days 2–3)", sceneKey: "interrogation-circle",
    lines: [
      { who: "Student B", text: "“We're just asking questions. If he's innocent, he has nothing to fear.”" },
      { who: "Student C", text: "“Just admit it already, and this can all stop.”" },
      { who: "You", inner: true, text: "No fists. Not yet. But the room is closing around him like a fist." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence Board #1 · Chat Logs",
    items: [
      { id: "chat-pressure", type: "chat", from: "B", text: "“He still won't admit it. Give him a bit more pressure.”", title: "Group chat — Day 2", detail: "No explicit violence, but the language of escalation is unambiguous.", tags: ["escalation", "collective"] },
      { id: "witness-stmt", type: "note", title: "Hallway witness statement", text: "“I heard shouting from Room 14 most nights that week. Nobody went in. Nobody came out for help.”", detail: "An external witness establishes the pattern. The dorm was sealed by social pressure, not by lock.", tags: ["coercion", "collective"] },
      { id: "roster", type: "list", title: "Room 14 attendance log", text: "Six students consistently present across Days 2–9. Same six.", detail: "The group is small, stable, and identifiable. This is not a chaotic crowd — it's a unit.", tags: ["collective"] },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Behavioural Assessment",
    prompt: "What is actually happening in that room?",
    options: [
      { id: "A", label: "Reasonable inquiry", hint: "Not at this volume.", rationale: "Reasonable inquiry doesn't require nightly shouting and a sealed door." },
      { id: "B", label: "Emotional venting", hint: "Too organised for that.", rationale: "Six students, same room, same nights. That's a pattern, not a vent." },
      { id: "C", label: "Peer pressure / mob mentality forming", best: true, hint: "Name the dynamic.", rationale: "The group is constructing shared certainty and shared permission. That's how mobs are made.", evidenceRefs: ["chat-pressure", "roster"], evidenceTags: ["escalation", "collective"] },
      { id: "D", label: "Normal social interaction", hint: "It is not.", rationale: "Normal interaction does not require a witness statement from down the hall." },
    ],
    reveal: "Correct: C. Naming the dynamic is the first defence against it.",
  },
  {
    kind: "scene",
    title: "🎬 Act III · The Escalation (Days 4–6)", sceneKey: "escalation",
    lines: [
      { who: "Student A", text: "“He's being stubborn. He needs to remember this lesson.”" },
      { who: "Student D", text: "“Aren't we taking this too far?”" },
      { who: "Student B", text: "“You want to back out now? That makes you an accomplice in our eyes too.”" },
      { who: "You", inner: true, text: "The cost of leaving the group is now higher than the cost of staying. That is the trap closing." },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Group Dynamic",
    prompt: "How do you classify what the six are doing together?",
    options: [
      { id: "A", label: "Isolated individual acts", hint: "Misses the structure.", rationale: "If it were isolated, no one would need to threaten Student D for wanting out." },
      { id: "B", label: "Formation of collective criminal intent (§34)", best: true, hint: "Common intention.", rationale: "Shared purpose + concerted acts = each is liable for the act of all under §34. The threat to Student D proves it.", evidenceRefs: ["chat-pressure", "witness-stmt", "roster"], evidenceTags: ["collective", "coercion"] },
      { id: "C", label: "A simple conflict", hint: "Conflicts end.", rationale: "Simple conflicts don't require coercion of dissenters to keep them going." },
    ],
    reveal: "Correct: B. §34 (common intention) is the spine of this case.",
  },
  {
    kind: "insight",
    title: "📜 Insight · Common Intention (§34)",
    text:
      "Penal Code §34: when a criminal act is done by several persons in furtherance of the common intention of all, each is liable as if he had done it alone. You don't have to throw the punch. You only have to share the plan and act in concert.",
  },
  {
    kind: "scene",
    title: "🎬 Act IV · The Normalisation of Silence (Days 7–9)", sceneKey: "routine",
    lines: [
      { who: "Student E", text: "“It's been a week and he's still fine. He'll talk eventually.”" },
      { who: "Student A", text: "“If he suffers, that's his own fault for not telling the truth.”" },
      { who: "You", inner: true, text: "Moral rationalisation. The danger isn't louder now — it's quieter. That's worse." },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Critical Perception",
    prompt: "What is happening on Days 7–9?",
    options: [
      { id: "A", label: "Situation has stabilised", hint: "It only looks calm.", rationale: "Routine abuse looks like calm. That's the illusion that kills." },
      { id: "B", label: "Risk level is decreasing", hint: "The opposite.", rationale: "Cumulative trauma compounds. Nine days of 'a little' is not less than one day of 'a lot'." },
      { id: "C", label: "Fatal danger ignored due to habituation", best: true, hint: "Name the trap.", rationale: "Once harm becomes routine, the group stops noticing the line being crossed. That is when people die.", evidenceTags: ["prolonged", "omission"] },
    ],
    reveal: "Correct: C. The most dangerous moment of this case is the quietest one.",
  },
  {
    kind: "evidence",
    title: "🔎 Evidence Board #2 · The Pattern",
    items: [
      { id: "medic-log", type: "list", title: "Campus medical wing log", text: "No visit recorded for the victim across Days 1–9.", detail: "Despite visible deterioration, no one — group, dissenter, or warden — escalated to medical staff. Pure omission.", tags: ["omission"] },
      { id: "bystander-diary", type: "note", title: "Student D's notebook", text: "“Tried twice to leave. They said I'd be next. I stayed.”", detail: "Coercion of the dissenter is documented in his own hand. Reduces — but does not erase — his liability.", tags: ["coercion", "bystander"] },
      { id: "injury-pattern", type: "phone", title: "Forensic report · injury timeline", label: "Bruising in multiple stages of healing across 7–9 days.", detail: "Forensic timeline matches the dorm chat logs. The harm was prolonged, repeated, and foreseeable.", tags: ["prolonged"] },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Act V · The Breaking Point (Day 10)", sceneKey: "collapse",
    lines: [
      { who: "Student C", text: "“He… he doesn't look right. He's barely breathing.”" },
      { who: "Student A", text: "“Wait. If we call for help now, we're all finished. Just give him some water.”" },
      { who: "You", inner: true, text: "This is the last off-ramp. After this, every minute is a charge." },
    ],
  },
  {
    kind: "choice",
    key: "q5",
    title: "🎮 Choice ⑤ · The Decision",
    prompt: "What do you do at the moment of collapse?",
    options: [
      { id: "A", label: "Call medical help immediately", best: true, hint: "Only correct answer.", rationale: "Calling now is the difference between aggravated injury and homicide. Self-preservation does not outrank a dying person.", evidenceTags: ["omission"] },
      { id: "B", label: "Observe for another hour", hint: "The inertia trap.", rationale: "Psychological inertia kills here, not any single blow. 'Just one more hour' is what made this fatal." },
      { id: "C", label: "Keep pressing for the laptop", hint: "Inhuman.", rationale: "The laptop was never the point. By Day 10 it isn't even a pretext — it's an excuse." },
      { id: "D", label: "Do nothing", hint: "Worst case.", rationale: "Doing nothing in the face of imminent death converts knowledge into liability." },
    ],
    reveal: "Correct: A. Every other answer is the killer in this case.",
  },
  {
    kind: "scene",
    title: "🎬 Act VI · Aftermath", sceneKey: "hospital",
    lines: [
      { who: "Doctor", text: "“The delay was fatal. These injuries were sustained over a long period. Hours earlier, we could have saved him.”" },
      { who: "You", inner: true, text: "And the laptop? It was misplaced. Wrong shelf. Found three days ago. No one told him." },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 Evidence Board #3 · Role Allocation",
    items: [
      { id: "student-A-acts", type: "note", title: "Student A · the Instigator", text: "Initiated the accusation. Sustained the pressure. Vetoed the medical call.", detail: "Course of conduct, not a one-off act. Drives the §304 framing.", tags: ["instigator"] },
      { id: "student-B-acts", type: "note", title: "Student B · the Executor", text: "Carried out the physical 'lessons' on most nights. Threatened the dissenter to keep the group in line.", detail: "Direct actor + enforcer of common intention.", tags: ["executor", "collective"] },
      { id: "student-D-silence", type: "chat", from: "C", text: "“I knew. I didn't tell anyone. I was scared they'd turn on me.”", title: "Student D · the silent objector", detail: "Coercion is documented; complete acquittal is not available, but mitigation is.", tags: ["bystander", "coercion"] },
      { id: "laptop-found", type: "list", title: "Laptop recovered", text: "Found on a shelf in the common room. Misplaced, never stolen.", detail: "The original premise of the accusation was false from the beginning.", tags: ["irony"] },
    ],
  },
  {
    kind: "choice",
    key: "q6",
    title: "🎮 Choice ⑥ · Student A — Instigator",
    prompt: "How do you frame Student A's responsibility?",
    options: [
      { id: "A", label: "One-off mistake in judgment", hint: "Not the record.", rationale: "Ten days of sustained, escalating pressure is not a mistake. It's a course of conduct." },
      { id: "B", label: "Persistent course of conduct (foreseeable consequences)", best: true, hint: "Match the timeline.", rationale: "He set the frame, kept the pressure on, and blocked rescue at the critical moment. He owns the foreseeable outcome.", evidenceRefs: ["student-A-acts", "injury-pattern"], evidenceTags: ["instigator", "prolonged"] },
      { id: "C", label: "Not responsible — he didn't strike the victim", hint: "Wrong test.", rationale: "Liability under §34 doesn't require throwing the blow. Direction and concert are enough." },
    ],
    reveal: "Correct: B. Instigation + omission = the spine of the murder/manslaughter analysis.",
  },
  {
    kind: "choice",
    key: "q7",
    title: "🎮 Choice ⑦ · Student B — Executor",
    prompt: "How do you frame Student B's responsibility?",
    options: [
      { id: "A", label: "Just following the group", hint: "Not a defence.", rationale: "“Everyone was doing it” is a sociological fact, not a legal defence." },
      { id: "B", label: "Common intention under §34 — full liability", best: true, hint: "The correct frame.", rationale: "Direct actor + enforcer + sustained participant. He is liable for the acts of the group as if he had done them alone.", evidenceRefs: ["student-B-acts", "chat-pressure"], evidenceTags: ["executor", "collective"] },
      { id: "C", label: "Not responsible — no specific intent to kill", hint: "Wrong section.", rationale: "Specific intent is the §302 question. §34 + §304 doesn't require it." },
    ],
    reveal: "Correct: B. §34 attributes the act of one to all who shared the plan.",
  },
  {
    kind: "insight",
    title: "📜 Insight · The Bystander and the Duty",
    text:
      "Malaysian law imposes a narrower legal duty to rescue than many people expect. Student D's silence is a clear moral failing and may attract charges for failure to report, but it does not generally make him liable for the homicide itself — especially where credible coercion is documented. Mitigation, not acquittal.",
  },
  {
    kind: "scene",
    title: "🎬 Act VI · The Legal Crux", sceneKey: "verdict",
    lines: [
      { text: "Two sections sit on the bench between you and the verdict." },
      { who: "You", inner: true, text: "§302 needs intent to kill. §304 needs knowledge that the acts were likely to cause death. Which one does the evidence actually carry?" },
    ],
  },
  {
    kind: "choice",
    key: "q8",
    title: "🎮 Choice ⑧ · Final Classification",
    prompt: "What is the correct charge?",
    options: [
      { id: "A", label: "Murder (§302)", ok: true, hint: "Emotional, but fragile.", rationale: "§302 demands proof of specific intent to kill. The evidence shows escalation and indifference, not a plan to kill. A §302 conviction here is appealable." },
      { id: "B", label: "Culpable Homicide not amounting to Murder (§304)", best: true, hint: "Match the evidence.", rationale: "Sustained acts with knowledge they were likely to cause death, but without specific intent to kill. This is exactly what §304 was written for.", evidenceRefs: ["injury-pattern", "medic-log", "student-A-acts"], evidenceTags: ["prolonged", "omission"] },
      { id: "C", label: "Accident", hint: "Denial of justice.", rationale: "Ten days of foreseeable harm and a blocked medical call cannot be an accident." },
    ],
    reveal: "Correct: B. The §302 → §304 transition is the legal heart of this case.",
  },
  {
    kind: "insight",
    title: "📜 Insight · §302 vs §304",
    text:
      "§302 (Murder): requires specific intent to cause death (or injury sufficient in the ordinary course to cause death). §304 (Culpable Homicide not amounting to Murder): the act is done with knowledge it is likely to cause death, but without that specific intent. The difference is the entire weight of the sentence — and the entire honesty of the verdict.",
  },
  {
    kind: "scene",
    title: "⚖️ Verdict", sceneKey: "verdict",
    lines: [
      { text: "The court rises. The role of every person in Room 14 is now on the record." },
      { who: "You", inner: true, text: "Name the law honestly. Name the silence too." },
    ],
  },
];

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Hard fails
  if (a.q8 === "C") return "red";
  if (a.q5 === "C" || a.q5 === "D") return "red";

  let score = 0;
  if (a.q1 === "B") score += 2;
  else if (a.q1 === "C") score++;
  if (a.q2 === "C") score += 2;
  if (a.q3 === "B") score += 2;
  if (a.q4 === "C") score += 2;
  if (a.q5 === "A") score += 2;
  if (a.q6 === "B") score += 2;
  if (a.q7 === "B") score += 2;
  if (a.q8 === "B") score += 2;
  else if (a.q8 === "A") score++;

  const justice = a.q8 === "B" && a.q3 === "B" && a.q5 === "A" && a.q6 === "B" && a.q7 === "B" && score >= 13;
  if (justice) return "green";
  if (score <= 6 || a.q5 === "B") return "red";
  return "yellow";
}

const ENDINGS = {
  green: {
    tag: "🟢 Legally Precise Ending",
    title: "The Silence Breaks",
    body: "Students A and B are convicted of culpable homicide under §304 read with §34 — common intention. Student D is censured and charged with failure to report; coercion is reflected in mitigation. The institution's seniority culture is exposed in court, and the trail of 'discipline' rituals opens leads into the syndicate's recruitment pipeline.",
  },
  yellow: {
    tag: "🟡 Emotional Justice Ending",
    title: "Verdict First, Law Second",
    body: "Murder under §302 is recorded. The public feels avenged. On appeal, the absence of specific intent to kill threatens the conviction — and may collapse it into §304 anyway. Student D walks with a caution. The institution issues a statement and changes nothing.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "Filed as an Accident",
    body: "The case is closed as a tragic accident during 'discipline'. Minor administrative action is taken. The seniority culture survives intact. The next dorm, the next laptop, the next victim — already being chosen.",
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

const SilentDormitory = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "silent-dormitory", title: "The Silent Dormitory", route: "/story/silent-dormitory", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
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
          <T>CHAPTER 3 · THE SILENT DORMITORY</T>
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
              const sceneImg = step.image ?? sceneImageFor("silent-dormitory", step.sceneKey ?? step.title);
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

            <StarReward slug="silent-dormitory" story={STORY} answers={answers as Record<string, string>} ending={ending} />

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 What This Teaches</div>
              <p className="text-sm mt-2">
                <T>A missing laptop did not kill anyone. Group certainty, the threat to dissenters, and a normalised silence did. The legal system has language for all of it — if you are willing to use it honestly.</T>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ Mob mentality forms when leaving the group costs more than staying.</li>
                <li>✔ §34 (common intention) attributes the act of one to all who shared the plan.</li>
                <li>✔ §302 needs specific intent; §304 needs knowledge of likely death — pick the one the evidence carries.</li>
                <li>✔ Coercion mitigates the bystander; it does not erase the duty to report.</li>
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

export default SilentDormitory;