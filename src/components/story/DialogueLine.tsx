import CharacterPortrait, { CharacterKey } from "./CharacterPortrait";

interface Props {
  who?: string;
  text: string;
  inner?: boolean;
  character?: CharacterKey;
  active?: boolean;
  prevWho?: string;
  typing?: boolean;
}

const FEMALE_NAMES = new Set(["aira", "lina", "mei", "siti", "priya", "chloe", "anya", "sara", "nadia"]);
const MALE_NAMES = new Set(["arif", "daniel", "hafiz", "ravi", "wei", "kai", "tan", "lim"]);

const stableHash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const warned = new Set<string>();

export const inferCharacter = (who?: string): CharacterKey => {
  if (!who) return "narrator";
  // normalize: lowercase, strip parentheticals, collapse ws, trim punctuation
  const w = who
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9'.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (w === "you") return "you";
  if (w.includes("aira's parent") || w.includes("parent") || w.includes("mother") || w.includes("father") || w.includes("mom") || w.includes("dad")) return "parent";
  if (w.includes("madam") || w.includes("mrs.") || w.includes("auntie")) return "civilian_f";
  if (w.includes("principal") || w.includes("headmaster") || w.includes("headmistress") || w.includes("teacher") || w.includes("dean")) return "principal";
  if (/\baira\b/.test(w)) return "aira";
  if (w.includes("fake") || w.includes("caller") || w.includes("dispatcher") || w.includes("radio") || w.includes("pa system") || w.includes("narrator") || w === "voice") return "voice";
  if (w.includes("officer") || w.includes("inspector") || w.includes("constable") || w.includes("police") || w.includes("cop") || w.includes("sergeant")) return "officer";
  if (w.includes("profiler") || w.includes("investigator") || w.includes("analyst") || w.includes("forensic") || w.includes("detective") || w.includes("csi")) return "detective";
  if (w.includes("prosecution") || w.includes("prosecutor") || w.includes("defence") || w.includes("defense") || w.includes("mentor") || w.includes("lawyer") || w.includes("advocate") || w.includes("counsel") || w.includes("barrister")) return "lawyer";
  if (w.includes("doctor") || w.startsWith("dr.") || w.startsWith("dr ") || w.includes("nurse") || w.includes("medic") || w.includes("paramedic")) return "doctor";
  if (w.includes("journalist") || /\btv\b/.test(w) || w.includes("reporter") || w.includes("press") || w.includes("news")) return "journalist";
  if (w.includes("expert") || w.includes("scientist") || w.includes("professor") || w.startsWith("prof") || w.includes("consultant") || w.includes("auditor")) return "expert";
  if (w.includes("suspect") || w.includes("driver") || w.includes("runner") || w.includes("accused") || w.includes("defendant") || w.includes("convict") || w.includes("gang") || w.includes("dealer")) return "suspect";

  if (w.includes("student") || w.includes("teen") || w.includes("pupil") || w.includes("classmate") || w.includes("kid") || w.includes("boy") || w.includes("girl")) {
    if (w.includes("girl")) return "student_f";
    if (w.includes("boy")) return "student_m";
    return stableHash(w) % 2 === 0 ? "student_m" : "student_f";
  }

  // first-name allowlists
  const first = w.split(" ")[0];
  if (FEMALE_NAMES.has(first)) return "student_f";
  if (MALE_NAMES.has(first)) return "civilian_m";

  if (w.includes("victim") || w.includes("widow")) return "civilian_f";
  if (
    w.includes("bystander") || w.includes("neighbour") || w.includes("neighbor") ||
    w.includes("friend") || w.includes("agent") || w.includes("manager") ||
    w.includes("supervisor") || w.includes("liaison") || w.includes("tech") ||
    w.includes("bank") || w.includes("clerk") || w.includes("cashier") ||
    w.includes("stranger") || w.includes("witness") || w.includes("guardian") ||
    w.startsWith("mr.") || w.startsWith("mr ")
  ) return "civilian_m";

  // final fallback: stable hash → m/f
  if (import.meta.env?.DEV && !warned.has(w)) {
    warned.add(w);
    console.warn(`[DialogueLine] Unmapped speaker "${who}" — using fallback`);
  }
  return stableHash(w) % 2 === 0 ? "civilian_m" : "civilian_f";
};

const NAME_PLATE_COLOR: Record<CharacterKey, string> = {
  you: "text-primary",
  principal: "text-primary",
  parent: "text-accent",
  aira: "text-accent",
  narrator: "text-muted-foreground",
  officer: "text-[hsl(var(--justice-blue))]",
  detective: "text-primary",
  lawyer: "text-primary",
  doctor: "text-[hsl(180_50%_60%)]",
  student_m: "text-primary/90",
  student_f: "text-accent",
  suspect: "text-destructive",
  civilian_m: "text-muted-foreground",
  civilian_f: "text-muted-foreground",
  journalist: "text-accent",
  expert: "text-primary",
  voice: "text-accent",
};

const DialogueLine = ({ who, text, inner, character, active = true, prevWho, typing = false }: Props) => {
  // narration: no portrait, italic centered text
  if (!who) {
    return (
      <p className="text-sm leading-snug italic text-foreground/85 px-1 py-1 dialogue-pop">
        {text}
      </p>
    );
  }

  const key = character ?? inferCharacter(who);
  const onRight = key === "you";
  const speakerChanged = !prevWho || prevWho !== who;
  const plateColor = NAME_PLATE_COLOR[key] ?? "text-primary";

  return (
    <>
      {speakerChanged && prevWho && (
        <div aria-hidden className="border-t border-dotted border-primary/20 my-1" />
      )}
      <div
        className={`flex items-start gap-3 ${onRight ? "flex-row-reverse" : ""} ${
          inner ? "thought-fade" : "dialogue-pop"
        }`}
      >
        <CharacterPortrait character={key} size={56} speaking={active} />
        <div
          className={`relative border-2 px-2 py-2 max-w-[85%] transition-all ${
            inner
              ? "border-dashed border-accent bg-background/70"
              : active
              ? "border-primary bg-card/95"
              : "border-primary/40 bg-card/60"
          }`}
          style={{
            boxShadow: active
              ? "2px 2px 0 hsl(0 0% 0%), 0 0 12px hsl(var(--primary) / 0.25)"
              : "2px 2px 0 hsl(0 0% 0%)",
          }}
        >
          <div className={`pixel text-[9px] mb-1 flex items-center gap-1 ${inner ? "text-accent" : plateColor}`}>
            {inner ? "💭 " : ""}
            <span>{who.toUpperCase()}</span>
            {active && typing && !inner && (
              <span className="ml-1 text-primary/70" aria-hidden>
                <span className="typing-dot">·</span>
                <span className="typing-dot">·</span>
                <span className="typing-dot">·</span>
              </span>
            )}
          </div>
          <p className={`leading-snug ${inner ? "text-sm italic" : "text-base"}`}>
            {text}
            {active && typing && <span className="caret-blink" aria-hidden />}
          </p>
          <span
            aria-hidden
            className={`absolute top-4 w-2 h-2 border-2 ${
              inner ? "border-accent bg-background" : active ? "border-primary bg-card" : "border-primary/40 bg-card/60"
            }`}
            style={{
              [onRight ? "right" : "left"]: -6,
              transform: "rotate(45deg)",
              borderRight: onRight ? undefined : "none",
              borderTop: onRight ? undefined : "none",
              borderLeft: onRight ? "none" : undefined,
              borderBottom: onRight ? "none" : undefined,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DialogueLine;
