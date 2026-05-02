import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";
import DialogueLine from "@/components/story/DialogueLine";
import SceneDialogue from "@/components/story/SceneDialogue";
import sceneBrief from "@/assets/scenes/scene-brief.png";
import sceneOffice from "@/assets/scenes/scene-office.png";
import sceneDorm from "@/assets/scenes/scene-dorm.png";
import sceneTurning from "@/assets/scenes/scene-turning.png";
import sceneFinal from "@/assets/scenes/scene-final.png";

type ChoiceKey = "q1" | "q2" | "q3" | "rRoom" | "rSchool" | "rOnline";
type Answers = Partial<Record<ChoiceKey, string>>;

type Choice = { id: string; label: string; best?: boolean; ok?: boolean };
type Step =
  | { kind: "scene"; title: string; image?: string; lines: { who?: string; text: string; inner?: boolean }[] }
  | { kind: "evidence"; title: string; lines: string[] }
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
      { id: "A", label: "Likely an accident" },
      { id: "B", label: "External force involved" },
      { id: "C", label: "Cannot rule out human involvement", best: true },
      { id: "D", label: "Need more evidence", best: true },
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
    lines: [
      "📷 CCTV: marked “not working” at the time of the incident.",
      "📱 Phone: partial data was deleted.",
      "💭 Too many coincidences.",
    ],
  },
  {
    kind: "evidence",
    title: "📱 Hidden Bullying · Chats",
    lines: [
      "“Just ignore her.”",
      "“She’s annoying.”",
      "“Maybe she should disappear.”",
      "💭 No direct threats… but this isn’t harmless.",
    ],
  },
  {
    kind: "evidence",
    title: "🎥 Hidden Bullying · Secret Videos",
    lines: [
      "• Mocking gestures",
      "• Laughing as Aira walks away",
      "• Light pushing in the hallway",
      "💭 Each clip is small. Together, they repeat. That matters.",
    ],
  },
  {
    kind: "choice",
    key: "q2",
    title: "🎮 Choice ② · Does this count as a crime?",
    prompt: "How would you classify this pattern of behaviour?",
    options: [
      { id: "A", label: "Normal student conflict" },
      { id: "B", label: "Minor school issue" },
      { id: "C", label: "Ongoing psychological harm", best: true },
      { id: "D", label: "Cannot determine" },
    ],
    reveal: "Correct: C. Repeated, targeted harm crosses the line from conflict into harm.",
  },
  {
    kind: "insight",
    title: "⚖️ Legal Insight",
    text: "Repeated emotional harm may form part of a legal case, especially when combined with corroborating evidence and intent.",
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
      { id: "A", label: "Suicide" },
      { id: "B", label: "Accident" },
      { id: "C", label: "Directly pushed" },
      { id: "D", label: "Result of prolonged bullying", best: true },
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
      { id: "A", label: "No responsibility" },
      { id: "B", label: "School discipline issue" },
      { id: "C", label: "Psychological harm responsibility", best: true },
      { id: "D", label: "Criminal liability", ok: true },
    ],
    reveal: "Best: C, with partial D depending on evidence of intent.",
  },
  {
    kind: "choice",
    key: "rSchool",
    title: "🏫 Responsibility · School",
    prompt: "What is the school's responsibility?",
    options: [
      { id: "A", label: "No responsibility" },
      { id: "B", label: "Negligence", best: true },
      { id: "C", label: "Indirect responsibility", best: true },
      { id: "D", label: "Accomplice" },
    ],
    reveal: "Correct: B or C. The school failed its duty of care, but did not act with intent.",
  },
  {
    kind: "choice",
    key: "rOnline",
    title: "🌐 Responsibility · Online Spreaders",
    prompt: "What about those who shared the videos online?",
    options: [
      { id: "A", label: "Not involved" },
      { id: "B", label: "Increased harm", best: true },
      { id: "C", label: "Participated in bullying", best: true },
      { id: "D", label: "Criminal liability", ok: true },
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
        <Link to="/chapter/school" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          CHAPTER X · SILENT FALL
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
          <div className="bg-background/80 border-2 border-accent p-3 space-y-1">
            <div className="pixel text-[10px] text-accent">{step.title}</div>
            {step.lines.map((l, k) => (
              <p key={k} className="text-sm leading-snug">{l}</p>
            ))}
          </div>
        )}

        {step?.kind === "insight" && (
          <div className="bg-primary/15 border-2 border-primary p-3">
            <div className="pixel text-[10px] text-primary">{step.title}</div>
            <p className="text-base mt-2">{step.text}</p>
          </div>
        )}

        {step?.kind === "choice" && (
          <div className="bg-card/90 border-2 border-primary p-3 shadow-[var(--shadow-pixel)] space-y-3">
            <div className="pixel text-[10px] text-primary">{step.title}</div>
            <p className="text-sm">{step.prompt}</p>
            <div className="space-y-2">
              {step.options.map((opt) => {
                const picked = answers[step.key] === opt.id;
                const revealed = revealedAt === i;
                const tone = revealed
                  ? opt.best
                    ? "border-primary bg-primary/25"
                    : opt.ok
                      ? "border-accent bg-accent/15"
                      : picked
                        ? "border-destructive/70 bg-destructive/15"
                        : "border-primary/30 bg-background/60"
                  : picked
                    ? "border-primary bg-primary/20"
                    : "border-primary/40 bg-background/70";
                return (
                  <button
                    key={opt.id}
                    onClick={() => choose(step.key, opt.id)}
                    className={`w-full text-left p-2 border-2 transition-colors ${tone}`}
                  >
                    <span className="pixel text-[10px] text-primary mr-2">{opt.id}.</span>
                    <span className="text-sm">{opt.label}</span>
                    {revealed && opt.best && (
                      <span className="pixel text-[8px] text-primary ml-2">★ BEST</span>
                    )}
                  </button>
                );
              })}
            </div>
            {step.reveal && revealedAt === i && (
              <div className="text-xs bg-background/80 border-2 border-primary/60 p-2">
                {step.reveal}
              </div>
            )}
          </div>
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
                A student suffered prolonged bullying and fell from a building under unclear circumstances.
              </p>
              <p className="text-sm mt-2 italic">
                “Not all harm is direct, but repeated harm can still create responsibility.”
              </p>
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
              <Link to="/chapter/school" className="pixel-btn text-sm text-center">
                CONTINUE
              </Link>
            </div>
          </>
        )}
      </main>
    </GameFrame>
  );
};

export default SilentFall;