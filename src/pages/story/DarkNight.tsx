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

type ChoiceKey =
  | "q1" | "q2" | "q3" | "q4" | "q5"
  | "q6" | "q7" | "q8" | "q9a" | "q9b" | "q9c";
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
  // --- Act I ---
  {
    kind: "scene",
    title: "🎬 Act I · The Impact", sceneKey: "highway",
    lines: [
      { text: "Time: just past midnight. Location: a quiet stretch of trunk road outside the city." },
      { who: "Driver", inner: true, text: "“Almost home…”" },
      { text: "🚨 Screeching brakes. A dull, sickening thud." },
      { who: "Driver", text: "“What happened?! What did I hit?!”" },
      { who: "You", inner: true, text: "Figures lie scattered across the lane. Bicycle frames bent at angles bicycles aren't supposed to bend at." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Initial Impression",
    prompt: "Standing over the wreckage, what is your honest first read?",
    options: [
      { id: "A", label: "The driver is clearly at fault", hint: "Too early to call it.", rationale: "There's a car and there are bodies. There is no investigation yet. Do not write the verdict before the report." },
      { id: "B", label: "The situation is unclear", best: true, hint: "Investigator's posture.", rationale: "First scene. No measurements, no scene reconstruction, no lighting survey, no toxicology. ‘Unclear’ is the only honest read." },
      { id: "C", label: "Likely caused by external factors", hint: "Speculation.", rationale: "‘External factors’ is a story, not evidence. Naming a culprit before reading the road is bias dressed as analysis." },
      { id: "D", label: "Indeterminable", ok: true, hint: "Close to right.", rationale: "Acceptable as a holding position, but ‘unclear, pending evidence’ (B) is the more workable frame for an officer who still has to investigate." },
    ],
    reveal: "Best: B / D. Cases like this are lost the moment the first officer writes the conclusion before the report.",
  },

  // --- Act II ---
  {
    kind: "scene",
    title: "🎬 Act II · Chaos at the Scene", sceneKey: "scene",
    lines: [
      { who: "Bystander", text: "“You must have been flying! Look what you've done!”" },
      { who: "Driver", text: "“I really didn't see anything… they were just there…”" },
      { who: "You", inner: true, text: "Public opinion is forming faster than the first police report." },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Social Influence",
    prompt: "Whose account do you anchor on right now?",
    options: [
      { id: "A", label: "Believe the bystanders", hint: "They didn't see the impact either.", rationale: "Bystanders arrive after the crash. Their certainty is reconstructed from the wreckage, not observed." },
      { id: "B", label: "Believe the driver", hint: "Self-serving by definition.", rationale: "The driver is the most exposed party. His unverified statement cannot be your baseline." },
      { id: "C", label: "Maintain neutrality", best: true, hint: "Both accounts are evidence — neither is conclusion.", rationale: "Both statements go in the file. Neither becomes the theory of the case until the physical evidence supports it." },
    ],
    reveal: "Correct: C. ‘Believing’ a witness is not the job. Recording, then testing, is.",
  },

  // --- Evidence Board #1 ---
  {
    kind: "evidence",
    title: "🔎 Evidence Board #1 · The Road",
    items: [
      { id: "lighting", type: "list", title: "Lighting survey", text: "Stretch unlit between km 14.2 and km 15.8. Nearest streetlamp 220 m back; non-functional.", detail: "Driver visibility on this stretch is governed almost entirely by headlight throw — roughly 40–60 m for low beams.", tags: ["road", "visibility"] },
      { id: "signage", type: "note", title: "Signage / road type", text: "Federal trunk road. No bicycle lane. No ‘shared use’ markings. No warning of recreational night activity.", detail: "Drivers on a trunk road at midnight have no statutory expectation of large groups of unlit cyclists." },
      { id: "scene-photos", type: "video", label: "Scene photographs · scattered modified bicycles, no front/rear lights, no reflectors", title: "Scene photographs", detail: "Modified ‘basikal lajak’ frames lowered for speed. Brakes removed or non-functional on inspection. No lights, no reflective gear.", tags: ["bikes", "visibility"] },
    ],
  },

  // --- Act III ---
  {
    kind: "scene",
    title: "🎬 Act III · The First Report", sceneKey: "station",
    lines: [
      { who: "Officer", text: "“This isn't a typical traffic accident. Multiple teenagers, a federal road at midnight, modified bikes with no lights.”" },
      { who: "You", inner: true, text: "He's right. Run this as a complex case from day one or it falls apart at trial." },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Nature of the Case",
    prompt: "How do you classify the case in the file?",
    options: [
      { id: "A", label: "Standard traffic accident", hint: "Strips out everything that matters.", rationale: "Filing it as ‘standard’ erases the unlit road, the modified bikes, the group risk-taking. The complexity is the case." },
      { id: "B", label: "Suspicious / high-complexity case", best: true, hint: "Match the facts.", rationale: "Multiple deaths, federal road, modified vehicles, group activity, public attention. This is a multi-factor liability case from minute one." },
      { id: "C", label: "Single-party liability", hint: "You haven't proven that.", rationale: "Pre-deciding ‘one party is liable’ before the reconstruction is the failure pattern that gets verdicts overturned on appeal." },
    ],
    reveal: "Correct: B. The case wins or loses on whether you allow it its full complexity.",
  },

  // --- Act IV ---
  {
    kind: "scene",
    title: "🎬 Act IV · The Driver's Memory", sceneKey: "flashback",
    lines: [
      { who: "Driver", text: "“That stretch is usually dead. I've driven it a hundred times. I never expected anyone to be on it.”" },
      { text: "Flashback: low silhouettes — no lights, no reflectors — dart into the headlight cone." },
      { who: "You", inner: true, text: "Foreseeability is the entire legal hinge. Get this question wrong and the whole case tilts." },
    ],
  },
  {
    kind: "choice",
    key: "q4",
    title: "🎮 Choice ④ · Foreseeability",
    prompt: "Was this hazard foreseeable to a reasonable driver?",
    options: [
      { id: "A", label: "Completely foreseeable", hint: "Overstates duty.", rationale: "Duty of care does not require drivers to anticipate every theoretically possible hazard. ‘A group of unlit cyclists at midnight on a trunk road’ is not a default expectation." },
      { id: "B", label: "Partially foreseeable", best: true, hint: "Closest to the doctrine.", rationale: "A reasonable driver foresees pedestrians and the occasional cyclist anywhere there is road. They do not foresee a group activity in this configuration. Partial foreseeability is the honest answer." },
      { id: "C", label: "Almost impossible to foresee", ok: true, hint: "Defensible, but absolute.", rationale: "Defensible on these facts, but ‘almost impossible’ removes any duty at all. Courts rarely accept the absolute version." },
    ],
    reveal: "Best: B. Partial foreseeability is what creates partial — not full — driver liability.",
  },

  // --- Act V ---
  {
    kind: "scene",
    title: "🎬 Act V · Earlier That Night", sceneKey: "flashback",
    lines: [
      { who: "Teen A", text: "“Bro, tonight's gonna be epic. New brakes off, frame lowered.”" },
      { who: "Teen B", text: "“Relax la, no cars come here this hour.”" },
      { who: "You", inner: true, text: "Reckless. And tragic. Both can be true at the same time." },
    ],
  },
  {
    kind: "choice",
    key: "q5",
    title: "🎮 Choice ⑤ · Judging the Group",
    prompt: "How do you characterise the teenagers' conduct?",
    options: [
      { id: "A", label: "They are innocent victims", hint: "Sentiment, not analysis.", rationale: "Their deaths are tragic. That does not make their conduct lawful or risk-free." },
      { id: "B", label: "Their behaviour was dangerous", best: true, hint: "Yes — by every objective measure.", rationale: "Group activity, unlit modified vehicles, federal trunk road, midnight. Every individual factor multiplies risk; together they manufacture it.", evidenceRefs: ["scene-photos", "lighting"], evidenceTags: ["bikes", "visibility"] },
      { id: "C", label: "Understandable but reckless", ok: true, hint: "Honest framing.", rationale: "Captures both the human context and the legal classification. Courts accept this more readily than the bare ‘dangerous’ label." },
    ],
    reveal: "Best: B / C. Empathy for the dead does not erase the conduct that put them in the lane.",
  },

  // --- Evidence Board #2 ---
  {
    kind: "evidence",
    title: "🔎 Evidence Board #2 · The Reconstruction",
    items: [
      { id: "speed", type: "list", title: "Speed data (EDR + skid analysis)", text: "Estimated impact speed: 64 km/h. Posted limit on segment: 70 km/h. Not speeding.", detail: "Within the legal limit, but in the upper band for an unlit segment with reduced visibility. ‘Legal’ is not synonymous with ‘safe’.", tags: ["speed"] },
      { id: "bikes", type: "note", title: "Modified bicycles · technical inspection", text: "Brakes removed or non-functional on 6 of 8 inspected units. No front lamp, no rear reflector. Frame geometry altered for downhill speed.", detail: "Vehicles built specifically to go faster, with the safety systems specifically removed.", tags: ["bikes"] },
      { id: "uploads", type: "chat", from: "A", text: "“Tonight's run uploaded. Likes already at 4k. Sponsor said keep posting.”", title: "Recovered chat — uploads + sponsor", detail: "The ‘run’ was being filmed for an online audience and a paying sponsor. The risk-taking had a business model.", tags: ["online", "syndicate"] },
    ],
  },

  // --- Act VI ---
  {
    kind: "scene",
    title: "🎬 Act VI · The Social Media Explosion", sceneKey: "feed",
    lines: [
      { text: "📱 ‘DRIVER IS A KILLER. JAIL HIM.’ 18k shares." },
      { text: "📱 ‘Where were the parents? At midnight? On a federal road?’ 22k shares." },
      { who: "Journalist (TV)", text: "“The nation is divided down the middle.”" },
      { who: "You", inner: true, text: "Both sides are loud. The case file does not care which side is louder." },
    ],
  },
  {
    kind: "choice",
    key: "q6",
    title: "🎮 Choice ⑥ · Bias Test",
    prompt: "How does public opinion enter your reasoning?",
    options: [
      { id: "A", label: "Lean toward the driver (he's being lynched online)", hint: "Hidden bias penalty.", rationale: "Defending against a mob is still bias. The mob's noise does not flip the burden of proof in the driver's favour." },
      { id: "B", label: "Lean toward the victims (they're dead, somebody must answer)", hint: "Hidden bias penalty.", rationale: "Grief is real and important. It is not a charging document. ‘Somebody must answer’ is how innocent people get over-charged." },
      { id: "C", label: "Maintain objectivity — both noises stay outside the file", best: true, hint: "The only safe posture.", rationale: "The case is decided on lighting, speed, foreseeability, vehicle condition and duty of care — not on share counts." },
    ],
    reveal: "Correct: C. Choosing A or B silently lowers your final ending grade — that's the bias penalty.",
  },

  // --- Act VII ---
  {
    kind: "scene",
    title: "🎬 Act VII · Technical Testimony", sceneKey: "court",
    lines: [
      { who: "Expert", text: "“Under those lighting conditions, with non-reflective targets entering at oblique angles, mean human reaction time is pushed to roughly the limit of what's physiologically possible.”" },
      { who: "You", inner: true, text: "Translation: even a careful driver may not have avoided this. ‘May not’ — not ‘cannot’." },
    ],
  },
  {
    kind: "choice",
    key: "q7",
    title: "🎮 Choice ⑦ · Technical Reality",
    prompt: "How do you state the avoidability finding?",
    options: [
      { id: "A", label: "The driver could have avoided it entirely", hint: "Expert evidence does not support that.", rationale: "Imposes a standard of perfection courts have repeatedly rejected." },
      { id: "B", label: "Inherent risk regardless of normal care", best: true, hint: "Matches the testimony.", rationale: "The expert evidence shows the hazard configuration eats into reaction-time margins normal care provides. Risk was structural, not personal failure.", evidenceRefs: ["lighting", "speed"], evidenceTags: ["road", "visibility", "speed"] },
      { id: "C", label: "Completely unavoidable", hint: "Overstated.", rationale: "Removes all driver duty. Even a marginal speed reduction widens the reaction window. ‘Completely’ is wrong." },
    ],
    reveal: "Correct: B. Inherent risk ≠ no responsibility. It calibrates the responsibility.",
  },

  // --- Act VIII ---
  {
    kind: "scene",
    title: "🎬 Act VIII · The Legal Showdown", sceneKey: "court",
    lines: [
      { who: "Prosecution", text: "“The driver failed the basic Duty of Care owed to every road user.”" },
      { who: "Defence", text: "“The configuration of this hazard exceeded any reasonable expectation of a driver.”" },
      { who: "You", inner: true, text: "Both statements are partially true. That's the whole problem and the whole answer." },
    ],
  },
  {
    kind: "choice",
    key: "q8",
    title: "🎮 Choice ⑧ · Negligence",
    prompt: "What is the negligence finding?",
    options: [
      { id: "A", label: "Clear negligence — driver wholly at fault", hint: "Ignores foreseeability and victim conduct.", rationale: "Cannot stand once Q4 (partial foreseeability) and Q5 (dangerous victim conduct) are on the record." },
      { id: "B", label: "No negligence at all", hint: "Ignores duty of care.", rationale: "A driver always owes some duty — minimum safe speed for visibility on an unlit segment, scanning, braking. ‘Zero’ is not on the menu." },
      { id: "C", label: "Partial / contributory negligence", best: true, hint: "The doctrine that fits the facts.", rationale: "Driver's duty of care was partially engaged but not breached to the standard of full liability. Victim conduct contributed materially. Contributory negligence apportions both." },
    ],
    reveal: "Correct: C. Contributory negligence is the doctrine the facts were waiting for.",
  },

  // --- Act IX: 9a, 9b, 9c ---
  {
    kind: "scene",
    title: "⚖️ Act IX · The Final Judgment", sceneKey: "verdict",
    lines: [
      { text: "Three apportionment questions. None of them have a clean answer." },
      { who: "You", inner: true, text: "Weigh, don't pick a villain." },
    ],
  },
  {
    kind: "choice",
    key: "q9a",
    title: "🎮 Choice ⑨a · The Driver",
    prompt: "Allocate the driver's share.",
    options: [
      { id: "A", label: "Full liability", hint: "Foreseeability says no.", rationale: "Q4 and Q7 are on the record. Full liability contradicts your own findings." },
      { id: "B", label: "Partial liability", best: true, hint: "Match the doctrine.", rationale: "Duty of care was engaged on speed and scanning, but not breached to the standard of sole cause. Partial liability is the legally coherent finding.", evidenceRefs: ["speed", "lighting"] },
      { id: "C", label: "No liability", hint: "Removes duty entirely.", rationale: "Even on these facts, a driver does not get to ‘zero’ on a road they chose to drive at speed." },
      { id: "D", label: "Uncertain", hint: "You've already done the analysis.", rationale: "Acceptable on Q1, not here. By Act IX you have the evidence to apportion." },
    ],
    reveal: "Recommended: B.",
  },
  {
    kind: "choice",
    key: "q9b",
    title: "🎮 Choice ⑨b · The Teenagers",
    prompt: "Allocate the cyclists' share.",
    options: [
      { id: "A", label: "No liability", hint: "Ignores manufactured risk.", rationale: "Modified vehicles + no lights + group activity + federal road at midnight is not a no-liability scenario." },
      { id: "B", label: "Partial liability", best: true, hint: "Defensible if driver is also partial.", rationale: "Splits the cause. Compatible with contributory negligence framing.", evidenceRefs: ["bikes", "scene-photos"] },
      { id: "C", label: "Primary liability", ok: true, hint: "Defensible on the physical evidence.", rationale: "Given that the hazard was largely manufactured by the cyclists' own choices (bikes, location, time), calling them primary is also legally defensible.", evidenceRefs: ["bikes", "scene-photos"] },
      { id: "D", label: "Uncertain", hint: "You've done the analysis.", rationale: "By this point ‘uncertain’ reads as avoidance." },
    ],
    reveal: "Recommended: B or C, depending on how you weighted manufactured vs shared risk.",
  },
  {
    kind: "choice",
    key: "q9c",
    title: "🎮 Choice ⑨c · The Social System",
    prompt: "What about the system around them?",
    options: [
      { id: "A", label: "No system responsibility", hint: "Misses the upstream cause.", rationale: "Treating this as ‘just two parties’ is exactly why the same accident keeps happening." },
      { id: "B", label: "Parental responsibility only", hint: "True, but partial.", rationale: "Parents matter. So does enforcement, road design and the online economy that pays kids to film these runs." },
      { id: "C", label: "Lack of regulatory oversight only", hint: "True, but partial.", rationale: "Enforcement is one piece. Parents and the upload economy are the others." },
      { id: "D", label: "Multi-party responsibility (parents + enforcement + road design + online economy)", best: true, hint: "The hidden high-score answer.", rationale: "This is the only finding that names the entire causal chain. It's also what makes the verdict useful as policy, not just as punishment.", evidenceRefs: ["uploads", "signage"], evidenceTags: ["online", "syndicate", "road"] },
    ],
    reveal: "Advanced answer: D. ‘Multi-party’ is the finding that turns a tragedy into a structural lesson.",
  },

  {
    kind: "insight",
    title: "📜 Insight · The Syndicate Hook",
    text:
      "The night-run footage from this case was being uploaded to a sponsor's channel. The same channel was monetised through ad placements that funnelled into illegal online gambling and recruiter campaigns — the same plumbing seen in the Green Trade and High-Pay Trap cases. The kids on the road were the content. Someone upstream was the business.",
  },
];

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  // Failure: extreme one-sided allocation or doctrinal failure on negligence
  if (a.q9a === "A" || a.q9a === "C") return "red";
  if (a.q9b === "A") return "red";
  if (a.q8 === "A" || a.q8 === "B") return "red";

  // Bias penalty: leaning either way under public-opinion pressure
  const bias = a.q6 === "A" || a.q6 === "B";

  let score = 0;
  if (a.q1 === "B") score += 2;
  else if (a.q1 === "D") score += 1;
  if (a.q2 === "C") score += 2;
  if (a.q3 === "B") score += 2;
  if (a.q4 === "B") score += 2;
  else if (a.q4 === "C") score += 1;
  if (a.q5 === "B" || a.q5 === "C") score += 2;
  if (a.q6 === "C") score += 2;
  if (a.q7 === "B") score += 2;
  if (a.q8 === "C") score += 2;
  if (a.q9a === "B") score += 2;
  if (a.q9b === "B" || a.q9b === "C") score += 2;
  if (a.q9c === "D") score += 3;
  else if (a.q9c === "B" || a.q9c === "C") score += 1;

  if (bias) score -= 4;

  if (score >= 18) return "green";
  if (score >= 10) return "yellow";
  return "red";
}

const ENDINGS = {
  green: {
    tag: "🟢 Balanced Ending",
    title: "Justice as Apportionment",
    body: "The court records contributory negligence. The driver receives a calibrated sentence and a license suspension. The cyclists' conduct is officially recognised as a primary risk factor. A multi-party policy recommendation goes to local council, road authority and the platforms hosting the run footage. The next family that loses a child on this road can point to a paper trail.",
  },
  yellow: {
    tag: "🟡 Emotion-Driven Ending",
    title: "A Verdict Built on Sentiment",
    body: "The verdict swings with the public mood. The driver is over- or under-punished depending on which hashtag won the week. Appeal is likely. The structural causes — modified bikes, unlit roads, paid-upload economy — go untouched. The case will repeat.",
  },
  red: {
    tag: "🔴 Failure Ending",
    title: "One Villain, No Lesson",
    body: "Full liability is dropped on a single party. Doctrine is misapplied: foreseeability, contributory negligence and duty of care all ignored. The verdict is overturned on appeal. Public faith in the courts erodes a little further, and on the next moonless midnight the headlights find the same silhouettes.",
  },
};

type Highlights = { ids: string[]; tags: string[] } | null;
type Source = { choiceTitle: string; optionLabel: string; rationale?: string } | null;

const RecapPanel = ({
  evTitle, items, highlights, source,
}: { evTitle: string; items: EvidenceItem[]; highlights: Highlights; source: Source }) => {
  const ids = new Set(highlights?.ids ?? []);
  const tags = new Set(highlights?.tags ?? []);
  const linked = items.filter(
    (it) => (it.id && ids.has(it.id)) || (it.tags && it.tags.some((t) => tags.has(t))),
  );
  const jumpTo = (id?: string) => {
    if (!id) return;
    const nodes = document.querySelectorAll<HTMLElement>(`[data-evidence-id="${CSS.escape(id)}"]`);
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
      case "cctv": case "phone": case "video": return it.label.slice(0, 36);
      case "chat": return `${it.from}: ${it.text.slice(0, 28)}`;
      case "list": case "note": return it.text.slice(0, 36);
    }
  };
  return (
    <div className="space-y-2">
      <div className="border-2 border-accent bg-accent/10 p-2 space-y-2" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>
        <div className="flex items-center justify-between gap-2">
          <span className="pixel text-[8px] px-2 py-1 bg-accent text-accent-foreground" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>📂 RECAP</span>
          <span className="pixel text-[8px] text-accent">{linked.length} LINKED · {evTitle}</span>
        </div>
        {source && (
          <div className="border-l-4 border-primary bg-background/70 px-2 py-1">
            <div className="pixel text-[8px] text-primary">YOU CHOSE · {source.optionLabel}</div>
            {source.rationale && <p className="text-xs leading-snug text-foreground/90 mt-1">{source.rationale}</p>}
          </div>
        )}
        {linked.length > 0 && (
          <div className="space-y-1">
            <div className="pixel text-[8px] text-accent/80">JUMP TO EVIDENCE ↓</div>
            <div className="flex flex-wrap gap-1">
              {linked.map((it, k) => (
                <button key={(it.id ?? "x") + k} onClick={() => jumpTo(it.id)} disabled={!it.id} className="pixel text-[8px] px-2 py-1 border-2 border-primary text-primary bg-background/80 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }} title={it.detail ?? "Open in evidence board"}>▸ {titleFor(it)}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <EvidenceBoard title={`RECAP · ${evTitle}`} items={items} highlightIds={highlights?.ids} highlightTags={highlights?.tags} defaultOpen />
    </div>
  );
};

const DarkNight = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [pendingHighlights, setPendingHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<{ ids: string[]; tags: string[] } | null>(null);
  const [highlightStepIdx, setHighlightStepIdx] = useState<number | null>(null);
  const [highlightSource, setHighlightSource] = useState<{ choiceTitle: string; optionLabel: string; rationale?: string } | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "dark-night", title: "Responsibility of the Dark Night", route: "/story/dark-night", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
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
    setI(0); setAnswers({}); setRevealedAt(null);
    setPendingHighlights(null); setActiveHighlights(null);
    setHighlightStepIdx(null); setHighlightSource(null);
  };

  const stepHighlights =
    step?.kind === "evidence" && highlightStepIdx === i ? activeHighlights : null;
  const lateRecap =
    step?.kind === "choice" && activeHighlights && highlightStepIdx !== null && highlightStepIdx < i
      ? { idx: highlightStepIdx, ev: STORY[highlightStepIdx] as Extract<Step, { kind: "evidence" }> }
      : null;

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-5 px-5 flex items-center gap-3">
        {i > 0 ? (<button type="button" onClick={() => { setI(i - 1); setRevealedAt(null); }} className="pixel-btn-square" aria-label="Previous">←</button>) : (<Link to="/quest" className="pixel-btn-square" aria-label="Back">←</Link>)}<Link to="/quest" className="pixel-btn-square" aria-label="Cases" title="Cases">🏠</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          <T>CHAPTER 9 · RESPONSIBILITY OF THE DARK NIGHT</T>
        </h1>
      </header>

      {!done && (
        <div className="px-5 pt-3">
          <div className="h-2 border-2 border-primary/70 bg-background/60">
            <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / total) * 100}%` }} />
          </div>
          <div className="pixel text-[9px] text-primary/90 mt-1 text-right">{i + 1} / {total}</div>
        </div>
      )}

      <main className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        {step?.kind === "scene" && (
          <div className="space-y-3 animate-fade-in">
            {(() => {
              const sceneImg = step.image ?? sceneImageFor("dark-night", step.sceneKey ?? step.title);
              return sceneImg ? (
                <div className="relative w-full overflow-hidden border-2 border-primary shadow-[var(--shadow-pixel)]" style={{ aspectRatio: "16 / 10", imageRendering: "pixelated" }}>
                  <img src={sceneImg} alt={step.title} className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} loading="lazy" width={1024} height={640} />
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
          <EvidenceBoard title={step.title} items={step.items} highlightIds={stepHighlights?.ids} highlightTags={stepHighlights?.tags} defaultOpen={!!stepHighlights} />
        )}

        {step?.kind === "insight" && (
          <div className="bg-primary/15 border-2 border-primary p-3">
            <div className="pixel text-[10px] text-primary"><T>{step.title}</T></div>
            <p className="text-base mt-2"><T>{step.text}</T></p>
          </div>
        )}

        {step?.kind === "choice" && (
          <>
            <ChoicePanel title={step.title} prompt={step.prompt} options={step.options} reveal={step.reveal} selected={answers[step.key]} revealed={revealedAt === i} resetKey={`${i}-${step.key}`} onSelect={(id) => choose(step.key, id)} />
            {lateRecap && (
              <RecapPanel evTitle={lateRecap.ev.title} items={lateRecap.ev.items} highlights={activeHighlights} source={highlightSource} />
            )}
          </>
        )}

        {!done && (
          <button onClick={next} disabled={step?.kind === "choice" && !answers[step.key]} className="pixel-btn w-full text-base disabled:opacity-50">
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

            <StarReward slug="dark-night" story={STORY} answers={answers as Record<string, string>} ending={ending} />

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 What This Teaches</div>
              <p className="text-sm mt-2">
                <T>In tragedies with no clean villain, justice is not about picking a face for the blame — it's about weighing Duty of Care against Foreseeability, and naming every party in the causal chain. Including the system.</T>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✔ Duty of care is calibrated by foreseeability — not abolished by it.</li>
                <li>✔ Contributory negligence apportions, it doesn't acquit.</li>
                <li>✔ Public opinion is not an element of the offence.</li>
                <li>✔ Multi-party findings (parents · enforcement · road · platforms) are what stop the next case.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">REPLAY</button>
              <Link to="/quest" className="pixel-btn text-sm text-center">CONTINUE</Link>
            </div>
          </>
        )}
      </main>
    </GameFrame>
  );
};

export default DarkNight;