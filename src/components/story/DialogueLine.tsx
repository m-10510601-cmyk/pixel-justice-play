import CharacterPortrait, { CharacterKey } from "./CharacterPortrait";
import T from "@/components/T";

interface Props {
  who?: string;
  text: string;
  inner?: boolean;
  character?: CharacterKey;
}

const inferCharacter = (who?: string): CharacterKey => {
  if (!who) return "narrator";
  const w = who.toLowerCase();
  if (w.includes("principal")) return "principal";
  if (w.includes("parent") || w.includes("aira's parent")) return "parent";
  if (w.includes("aira")) return "aira";
  if (w === "you" || w.includes("guardian")) return "you";
  return "narrator";
};

const DialogueLine = ({ who, text, inner, character }: Props) => {
  // narration: no portrait, italic centered text
  if (!who) {
    return (
      <p className="text-sm leading-snug italic text-foreground/85 px-1 py-1">
        <T>{text}</T>
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
        <T>{who.toUpperCase()}</T>
      </div>
      <p className={`text-sm leading-snug ${inner ? "italic" : ""}`}><T>{text}</T></p>
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