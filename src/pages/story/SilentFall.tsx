import { useMemo, useState } from "react";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";
import DialogueLine from "@/components/story/DialogueLine";
import SceneDialogue from "@/components/story/SceneDialogue";
import EvidenceBoard, { EvidenceItem } from "@/components/story/EvidenceBoard";
import ChoicePanel from "@/components/story/ChoicePanel";
import sceneBrief from "@/assets/scenes/scene-brief.png";
import sceneOffice from "@/assets/scenes/scene-office.png";
import sceneDorm from "@/assets/scenes/scene-dorm.png";
import sceneTurning from "@/assets/scenes/scene-turning.png";
import sceneFinal from "@/assets/scenes/scene-final.png";
import T from "@/components/T";
import StarReward from "@/components/story/StarReward";

type ChoiceKey = "q1" | "q2" | "q3" | "rRoom" | "rSchool" | "rOnline";
type Answers = Partial<Record<ChoiceKey, string>>;

type Choice = { id: string; label: string; best?: boolean; ok?: boolean; hint?: string; rationale?: string };
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
      { text: "Time: 2026 — A boarding school in Malaysia." },
      { text: "Aira (15) was found severely injured after falling from a dormitory building." },
      { who: "You", inner: true, text: "A fall from a dorm window… in 2026, with cameras everywhere?" },
      { text: "The school calls it an accident. Her family insists she was a victim of long-term bullying." },
      { who: "You", inner: true, text: "Two stories. Only one of them can hold up under evidence." },
    ],
  },
  {
    kind: "scene",
    title: "🎬 Scene 1 · School Office", image: sceneOffice,
    lines: [
      { who: "Principal", text: "“Please, have a seat. This is a tragedy, but it appears to be an unfortunate accident.”" },
      { who: "You", inner: true, text: "He answered before I even asked a question." },
      { who: "Aira's Parent", text: "“No. She was not happy there. Something was wrong for months.”" },
      { who: "Principal", text: "“With respect, students always have minor conflicts. We saw nothing serious.”" },
      { who: "You", inner: true, text: "‘Saw nothing’ — or chose not to look?" },
      { who: "Aira's Parent", text: "“She stopped calling home. She used to call every night.”" },
      { who: "You", inner: true, text: "Two completely different narratives… one of them is hiding something." },
    ],
  },
  {
    kind: "choice",
    key: "q1",
    title: "🎮 Choice ① · Initial Judgement",
    prompt: "What is your initial reading of the case?",
    options: [
      { id: "A", label: "Likely an accident", hint: "Aligns with the school's narrative.", rationale: "Closes the inquiry too early — ignores the parent's testimony and unverified scene." },
      { id: "B", label: "External force involved", hint: "Strong claim — needs proof.", rationale: "No physical evidence yet supports a direct attack. Premature." },
      { id: "C", label: "Cannot rule out human involvement", best: true, hint: "Keeps every theory alive.", rationale: "The right posture for an investigator: hold theories lightly until evidence settles them." },
      { id: "D", label: "Need more evidence", best: true, hint: "The investigator's default.", rationale: "Acknowledges the gap. Demands the work before drawing a verdict." },
    ],
    reveal: "Best answers: C or D. Stay open — investigate before you conclude.",
  },
  {
    kind: "scene",
    title: "🎬 Scene 2 · Dormitory", image: sceneDorm,
    lines: [
      { text: "You enter the dormitory hallway. The lights flicker once." },
      { who: "You", inner: true, text: "No broken glass. No scuff marks. Too clean." },
      { text: "Door 3B is freshly polished. The window beside it has a brand-new latch." },
      { who: "You", inner: true, text: "A new latch — installed after the fall, or before it?" },
      { text: "A camera in the corner blinks red. Its housing is dusty, but the lens is spotless." },
      { who: "You", inner: true, text: "Someone wiped that lens recently. Why bother, if it ‘wasn’t working’?" },
    ],
  },
  {
    kind: "evidence",
    title: "🔎 System Findings",
    items: [
      { type: "cctv", label: "CCTV outside Dorm 3B was marked “not working” at the time of the incident.", status: "offline" },
      { type: "phone", label: "Aira's phone — partial data was deleted from the chat archive and gallery.", status: "deleted" },
      { type: "note", text: "Too many coincidences. Coincidences are evidence too." },
    ],
  },
  {
    kind: "evidence",
    title: "📱 Hidden Bullying · Chats",
    items: [
      { type: "chat", from: "A", text: "Just ignore her." },
      { type: "chat", from: "B", text: "She's annoying." },
      { type: "chat", from: "C", text: "Maybe she should disappear." },
      { type: "chat", from: "A", text: "lol 😂" },
      { type: "chat", from: "B", text: "ya don't talk to her tmrw" },
      { type: "note", text: "No direct threats… but this isn't harmless. Patterns matter." },
    ],
  },
  {
    kind: "evidence",
    title: "🎥 Hidden Bullying · Secret Videos",
    items: [
      { type: "video", label: "Mocking gestures behind Aira's back in the cafeteria." },
      { type: "video", label: "Roommates laughing as Aira walks away crying." },
      { type: "video", label: "Light pushing in the hallway — disguised as a joke." },
      { type: "list", text: "Each clip is short — under 10 seconds." },
      { type: "list", text: "Filenames suggest they were uploaded to an external folder." },
      { type: "note", text: "Each clip is small. Together, they repeat. That matters." },
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Does this count as a crime?",
    prompt: "How would you classify this pattern of behaviour?",
    options: [
      { id: "A", label: "Normal student conflict", hint: "Minimises a clear pattern.", rationale: "Conflict is two-sided. This evidence shows targeting, not friction." },
      { id: "B", label: "Minor school issue", hint: "Discipline-only framing.", rationale: "Treats systemic harm as paperwork. Lets the cause continue." },
      { id: "C", label: "Ongoing psychological harm", best: true, hint: "Names the pattern accurately.", rationale: "Repetition + targeting + isolation = harm. Even without bruises." },
      { id: "D", label: "Cannot determine", hint: "You already have evidence.", rationale: "There is enough here to classify. Refusing to is its own choice." },
    ],
    reveal: "Correct: C. Repeated, targeted harm crosses the line from conflict into harm.",
  },
  {
    kind: "insight",
    title: "⚖️ Legal Insight",
    text: "This chapter is based on the true \"Zara Qairina Case\". In a legal context, long-term, targeted emotional harm can constitute part of a legal case, especially when there is supporting evidence and intent.",
  },
  {
    kind: "scene",
    title: "🎬 Scene 4 · The Turning Point", image: sceneTurning,
    lines: [
      { text: "Deleted data recovered. A video plays — moments before the fall." },
      { who: "You", inner: true, text: "Three figures in the frame. Aira against the railing." },
      { text: "Verbal pressure. Laughter. A shoulder bump. A hand reaches out — then the clip cuts." },
      { who: "You", inner: true, text: "The cut is too clean. Someone trimmed exactly the second that mattered." },
      { text: "❗ No clear push is shown on the surviving footage." },
      { who: "You", inner: true, text: "No single act of violence. But every second leading up to it was violence too." },
      { who: "You", inner: true, text: "This is the moment… but not the full truth." },
    ],
  },
  {
    kind: "choice",
    key: "q3",
    title: "🎮 Choice ③ · Case Classification",
    prompt: "How do you classify what happened?",
    options: [
      { id: "A", label: "Suicide", hint: "Removes others from the picture.", rationale: "Ignores the documented pressure leading up to the moment. Convenient for the wrong people." },
      { id: "B", label: "Accident", hint: "The school's preferred story.", rationale: "Not consistent with deleted footage, tampered camera, or the chat record." },
      { id: "C", label: "Directly pushed", hint: "Strong, but unproven.", rationale: "The surviving footage cuts before any clear push. Don't claim what you cannot show." },
      { id: "D", label: "Result of prolonged bullying", best: true, hint: "Names the chain, not just the moment.", rationale: "Captures the full causal pattern: months of harm culminated at that railing." },
    ],
    reveal: "Best: D. Even without a single direct act, prolonged harm can shape responsibility.",
  },
  {
    kind: "insight",
    title: "🧠 Core Legal Reasoning",
    text: "Even without a direct act, continuous harm may contribute to legal responsibility.",
  },
  {
    kind: "insight",
    title: "🔗 Main Story Connection",
    text: "The secret videos were uploaded online — traced to an underground recording network (Chapter 4). Bullying content is being collected, shared, possibly monetized.",
  },
  {
    kind: "choice",
    key: "rRoom",
    title: "🎬 Responsibility · Roommates",
    prompt: "What responsibility do the roommates carry?",
    options: [
      { id: "A", label: "No responsibility", hint: "Erases the perpetrators.", rationale: "Direct contradiction of the chat and video evidence." },
      { id: "B", label: "School discipline issue", hint: "Too soft for sustained harm.", rationale: "Bypasses real accountability — keeps it as a school administrative matter." },
      { id: "C", label: "Psychological harm responsibility", best: true, hint: "Matches the evidence.", rationale: "Repeated targeted harm makes the roommates responsible for the pattern they sustained." },
      { id: "D", label: "Criminal liability", ok: true, hint: "Possible — needs intent.", rationale: "Defensible if intent to harm can be proven. Otherwise stay with C." },
    ],
    reveal: "Best: C, with partial D depending on evidence of intent.",
  },
  {
    kind: "choice",
    key: "rSchool",
    title: "🏫 Responsibility · School",
    prompt: "What is the school's responsibility?",
    options: [
      { id: "A", label: "No responsibility", hint: "Ignores duty of care.", rationale: "Boarding schools owe a continuous duty of care. Silence is failure, not neutrality." },
      { id: "B", label: "Negligence", best: true, hint: "Failure to act on warning signs.", rationale: "Calls and missed reports went unanswered. That is negligence." },
      { id: "C", label: "Indirect responsibility", best: true, hint: "Systemic, not personal.", rationale: "The institution shaped the conditions that allowed the harm to continue." },
      { id: "D", label: "Accomplice", hint: "Implies intent.", rationale: "No evidence the school willed the harm — overreach beyond what's proven." },
    ],
    reveal: "Correct: B or C. The school failed its duty of care, but did not act with intent.",
  },
  {
    kind: "choice",
    key: "rOnline",
    title: "🌐 Responsibility · Online Spreaders",
    prompt: "What about those who shared the videos online?",
    options: [
      { id: "A", label: "Not involved", hint: "Sharing is participation.", rationale: "Each share extended the reach and the humiliation. Not neutral." },
      { id: "B", label: "Increased harm", best: true, hint: "Reach amplified the wound.", rationale: "Distribution multiplied the audience — and the damage." },
      { id: "C", label: "Participated in bullying", best: true, hint: "Sharing IS the act.", rationale: "In a digital chain, spreaders are part of the harm, not bystanders." },
      { id: "D", label: "Criminal liability", ok: true, hint: "Possible under harassment law.", rationale: "If monetised or knowingly spread to harm, criminal liability is on the table." },
    ],
    reveal: "Best: B + C. Spreading the content multiplied the harm.",
  },
  {
    kind: "scene",
    title: "🎬 Final Reflection", image: sceneFinal,
    lines: [
      { text: "The courtroom is empty. Moonlight rests on the scales." },
      { who: "You", inner: true, text: "If harm has no single author, does that mean it has none at all?" },
      { who: "You", text: "“No one pushed her…”" },
      { who: "You", text: "“But no one stopped it either.”" },
      { who: "You", inner: true, text: "And maybe that — the silence — is the verdict I have to deliver." },
    ],
  },
];

const QUIZ = {
  title: "🎓 Mini Quiz",
  prompt: "Why is this case complex?",
  options: [
    { id: "A", label: "No one is involved" },
    { id: "B", label: "There is no evidence" },
    { id: "C", label: "Harm exists without a clear direct act", best: true },
  ] as Choice[],
};

function gradeEnding(a: Answers): "green" | "yellow" | "red" {
  const isBest = (key: ChoiceKey, ids: string[]) => ids.includes(a[key] ?? "");
  let score = 0;
  if (isBest("q1", ["C", "D"])) score++;
  if (isBest("q2", ["C"])) score++;
  if (isBest("q3", ["D"])) score += 2;
  if (isBest("rRoom", ["C", "D"])) score++;
  if (isBest("rSchool", ["B", "C"])) score++;
  if (isBest("rOnline", ["B", "C", "D"])) score++;
  if (score >= 6) return "green";
  if (score >= 3) return "yellow";
  return "red";
}

const ENDINGS = {
  green: {
    tag: "🟢 Rational Ending",
    title: "Truth Acknowledged",
    body: "The full chain of harm is named. Responsibility is shared between roommates, school, and online spreaders. The school commits to systemic reforms.",
  },
  yellow: {
    tag: "🟡 Realistic Ending",
    title: "Partial Truth",
    body: "No direct criminal conviction. Only disciplinary action follows. The truth remains partially unresolved — and that is exactly how many real cases end.",
  },
  red: {
    tag: "🔴 Bad Ending",
    title: "Closed as Accident",
    body: "The case is ruled an accident and closed. The recovered evidence is set aside. The pattern continues elsewhere.",
  },
};

const SilentFall = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealedAt, setRevealedAt] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<string | null>(null);

  const total = STORY.length;
  const done = i >= total;

  useStoryProgress({ slug: "silent-fall", title: "Silent Fall", route: "/story/silent-fall", i, setI, answers: answers as Record<string, string>, setAnswers: setAnswers as unknown as (a: Record<string, string>) => void, total, done });
  const ending = useMemo(() => (done ? gradeEnding(answers) : null), [done, answers]);
  const step = !done ? STORY[i] : null;

  const next = () => {
    setRevealedAt(null);
    setI((x) => x + 1);
  };

  const choose = (key: ChoiceKey, id: string) => {
    setAnswers((a) => ({ ...a, [key]: id }));
    setRevealedAt(i);
  };

  const restart = () => {
    setI(0);
    setAnswers({});
    setRevealedAt(null);
    setQuiz(null);
  };

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-5 px-5 flex items-center gap-3">
        {i > 0 ? (<button type="button" onClick={() => { setI(i - 1); setRevealedAt(null); }} className="pixel-btn-square" aria-label="Previous">←</button>) : (<Link to="/quest" className="pixel-btn-square" aria-label="Back">←</Link>)}<Link to="/quest" className="pixel-btn-square" aria-label="Cases" title="Cases">🏠</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          <T>CHAPTER 1 · SILENT FALL</T>
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
                  <div className="pixel text-[10px] text-primary"><T>{step.title}</T></div>
                </div>
              </div>
            )}
            {!step.image && (
              <div className="bg-card/90 border-2 border-primary px-3 py-2 shadow-[var(--shadow-pixel)] inline-block">
                <div className="pixel text-[10px] text-primary"><T>{step.title}</T></div>
              </div>
            )}
            <SceneDialogue lines={step.lines} resetKey={i} />
          </div>
        )}

        {step?.kind === "evidence" && (
          <EvidenceBoard title={step.title} items={step.items} />
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
            revealed={revealedAt === i}
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

            <StarReward slug="silent-fall" story={STORY} answers={answers as Record<string, string>} ending={ending} />

            <div className="bg-primary/15 border-2 border-primary p-3">
              <div className="pixel text-[10px] text-primary">📚 <T>Post-Chapter Learning</T></div>
              <p className="text-sm mt-2">
                <T>A student suffered prolonged bullying and fell from a building under unclear circumstances.</T>
              </p>
              <p className="text-sm mt-2 italic">
                <T>“Not all harm is direct, but repeated harm can still create responsibility.”</T>
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

export default SilentFall;