import CharacterPortrait, { CharacterKey } from "./CharacterPortrait";

interface Props {
  who?: string;
  text: string;
  inner?: boolean;
  character?: CharacterKey;
}

const inferCharacter = (who?: string): CharacterKey => {
  if (!who) return "narrator";
  const w = who.toLowerCase();
  // Order matters: more-specific names first.
  if (w === "you") return "you";
  if (w.includes("principal")) return "principal";
  if (w.includes("aira's parent") || w.includes("parent")) return "parent";
  if (w.includes("aira")) return "aira";
  if (w.includes("madam")) return "civilian_f";
  if (w.includes("fake")) return "voice";
  if (w.includes("caller")) return "voice";
  if (w.includes("narrator")) return "voice";
  if (w.includes("officer") || w.includes("police")) return "officer";
  if (w.includes("profiler") || w.includes("investigator") || w.includes("forensic") || w.includes("detective")) return "detective";
  if (w.includes("prosecution") || w.includes("defence") || w.includes("defense") || w.includes("mentor") || w.includes("lawyer") || w.includes("advocate")) return "lawyer";
  if (w.includes("doctor")) return "doctor";
  if (w.includes("journalist") || w.includes("tv") || w.includes("reporter")) return "journalist";
  if (w.includes("expert")) return "expert";
  if (w.includes("suspect") || w.includes("driver")) return "suspect";
  if (w.includes("student") || w.includes("teen")) {
    // alternate male/female by trailing letter
    const m = w.match(/[a-z]\s*$/);
    if (m && (m[0] === "b" || m[0] === "d" || m[0] === "f")) return "student_f";
    return "student_m";
  }
  if (w.includes("lina") || w.includes("mei")) return "student_f";
  if (w.includes("guardian")) return "you";
  if (w.includes("victim")) return "civilian_f";
  if (
    w.includes("friend") || w.includes("agent") || w.includes("manager") ||
    w.includes("supervisor") || w.includes("liaison") || w.includes("tech") ||
    w.includes("neighbour") || w.includes("neighbor") || w.includes("bystander") ||
    w.includes("mr.") || w.includes("mr ") || w.includes("tan")
  ) return "civilian_m";
  return "civilian_m";
};

const DialogueLine = ({ who, text, inner, character }: Props) => {
  // narration: no portrait, italic centered text
  if (!who) {
    return (
      <p className="text-sm leading-snug italic text-foreground/85 px-1 py-1">
        {text}
      </p>
    );
  }

  const key = character ?? inferCharacter(who);
  // place YOU on the right (player perspective), others on the left
  const onRight = key === "you";

  const portrait = (
    <CharacterPortrait character={key} size={56} speaking />
  );

  const bubble = (
    <div
      className={`relative flex-1 border-2 px-2 py-2 ${
        inner
          ? "border-dashed border-accent bg-background/70"
          : "border-primary bg-card/95"
      }`}
      style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
    >
      <div
        className={`pixel text-[9px] mb-1 ${
          inner ? "text-accent" : "text-primary"
        }`}
      >
        {inner ? "💭 " : ""}
        {who.toUpperCase()}
      </div>
      <p className={`text-sm leading-snug ${inner ? "italic" : ""}`}>{text}</p>
      {/* tail */}
      <span
        aria-hidden
        className={`absolute top-4 w-2 h-2 border-2 ${
          inner ? "border-accent bg-background" : "border-primary bg-card"
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
  );

  return (
    <div
      className={`flex items-start gap-3 ${onRight ? "flex-row-reverse" : ""}`}
    >
      {portrait}
      {bubble}
    </div>
  );
};

export default DialogueLine;