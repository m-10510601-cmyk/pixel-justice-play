/**
 * Pure CSS pixel-art character portraits for the Silent Fall dialogue scenes.
 * No image assets — each character is composed of small colored blocks so it
 * stays crisp at any zoom and matches the 16-bit retro aesthetic.
 */
export type CharacterKey = "principal" | "parent" | "you" | "aira" | "narrator";

interface Props {
  character: CharacterKey;
  size?: number;
  speaking?: boolean;
}

const px = (n: number) => `${n}px`;

const CharacterPortrait = ({ character, size = 56, speaking = true }: Props) => {
  const s = size;
  const u = s / 16; // 16x16 pixel grid

  const wrap: React.CSSProperties = {
    width: s,
    height: s,
    position: "relative",
    border: "2px solid hsl(0 0% 0%)",
    background: "hsl(220 20% 12%)",
    boxShadow: "inset 0 -3px 0 hsl(0 0% 0% / 0.4), 2px 2px 0 hsl(0 0% 0%)",
    imageRendering: "pixelated",
    flexShrink: 0,
    opacity: speaking ? 1 : 0.55,
    filter: speaking ? "none" : "grayscale(0.4)",
  };

  const block = (x: number, y: number, w: number, h: number, color: string): React.CSSProperties => ({
    position: "absolute",
    left: px(x * u),
    top: px(y * u),
    width: px(w * u),
    height: px(h * u),
    background: color,
  });

  // skin / face base shared
  const Face = ({ skin }: { skin: string }) => (
    <>
      <div style={block(4, 4, 8, 9, skin)} />
      {/* neck */}
      <div style={block(6, 13, 4, 1, skin)} />
    </>
  );

  let inner: React.ReactNode = null;

  if (character === "principal") {
    const skin = "hsl(28 40% 70%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* hair (greying side) */}
        <div style={block(3, 3, 10, 2, "hsl(0 0% 25%)")} />
        <div style={block(3, 5, 1, 4, "hsl(0 0% 25%)")} />
        <div style={block(12, 5, 1, 4, "hsl(0 0% 25%)")} />
        {/* glasses */}
        <div style={block(5, 7, 2, 2, "hsl(0 0% 95%)")} />
        <div style={block(9, 7, 2, 2, "hsl(0 0% 95%)")} />
        <div style={block(7, 8, 2, 1, "hsl(0 0% 0%)")} />
        {/* eyes */}
        <div style={block(5, 8, 1, 1, "hsl(0 0% 0%)")} />
        <div style={block(10, 8, 1, 1, "hsl(0 0% 0%)")} />
        {/* mouth - stern */}
        <div style={block(7, 11, 2, 1, "hsl(0 40% 30%)")} />
        {/* suit collar */}
        <div style={block(3, 14, 10, 2, "hsl(220 30% 20%)")} />
        <div style={block(7, 14, 2, 2, "hsl(0 0% 95%)")} />
        <div style={block(7, 14, 2, 1, "hsl(0 70% 40%)")} />
      </>
    );
  } else if (character === "parent") {
    const skin = "hsl(28 45% 75%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* long hair */}
        <div style={block(3, 3, 10, 3, "hsl(20 40% 18%)")} />
        <div style={block(3, 6, 1, 7, "hsl(20 40% 18%)")} />
        <div style={block(12, 6, 1, 7, "hsl(20 40% 18%)")} />
        {/* worried eyes (downturned) */}
        <div style={block(5, 8, 2, 1, "hsl(0 0% 0%)")} />
        <div style={block(9, 8, 2, 1, "hsl(0 0% 0%)")} />
        <div style={block(5, 7, 1, 1, "hsl(0 0% 0%)")} />
        <div style={block(10, 7, 1, 1, "hsl(0 0% 0%)")} />
        {/* mouth - sad */}
        <div style={block(7, 11, 2, 1, "hsl(0 50% 40%)")} />
        <div style={block(6, 12, 1, 1, "hsl(0 50% 40%)")} />
        <div style={block(9, 12, 1, 1, "hsl(0 50% 40%)")} />
        {/* tear */}
        <div style={block(5, 10, 1, 1, "hsl(200 80% 70%)")} />
        {/* blouse */}
        <div style={block(3, 14, 10, 2, "hsl(340 35% 55%)")} />
      </>
    );
  } else if (character === "aira") {
    const skin = "hsl(28 50% 80%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* school hair, tied */}
        <div style={block(3, 3, 10, 3, "hsl(0 0% 10%)")} />
        <div style={block(3, 6, 1, 5, "hsl(0 0% 10%)")} />
        <div style={block(12, 6, 1, 5, "hsl(0 0% 10%)")} />
        {/* eyes - tired */}
        <div style={block(5, 8, 2, 1, "hsl(0 0% 0%)")} />
        <div style={block(9, 8, 2, 1, "hsl(0 0% 0%)")} />
        {/* mouth flat */}
        <div style={block(7, 11, 2, 1, "hsl(0 30% 35%)")} />
        {/* uniform */}
        <div style={block(3, 14, 10, 2, "hsl(210 50% 35%)")} />
        <div style={block(7, 14, 2, 2, "hsl(0 0% 95%)")} />
      </>
    );
  } else if (character === "you") {
    const skin = "hsl(28 35% 62%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* judge wig */}
        <div style={block(3, 2, 10, 4, "hsl(0 0% 92%)")} />
        <div style={block(2, 4, 1, 6, "hsl(0 0% 92%)")} />
        <div style={block(13, 4, 1, 6, "hsl(0 0% 92%)")} />
        {/* eyes */}
        <div style={block(5, 8, 2, 1, "hsl(0 0% 0%)")} />
        <div style={block(9, 8, 2, 1, "hsl(0 0% 0%)")} />
        {/* mouth */}
        <div style={block(7, 11, 2, 1, "hsl(0 0% 0%)")} />
        {/* robe */}
        <div style={block(3, 14, 10, 2, "hsl(0 0% 8%)")} />
        <div style={block(7, 14, 2, 2, "hsl(45 90% 55%)")} />
      </>
    );
  } else {
    // narrator: silhouette
    inner = (
      <>
        <div style={block(4, 4, 8, 9, "hsl(0 0% 30%)")} />
        <div style={block(3, 14, 10, 2, "hsl(0 0% 20%)")} />
      </>
    );
  }

  return (
    <div
      className={speaking ? "speak-bob" : ""}
      style={wrap}
      aria-hidden="true"
    >
      {inner}
    </div>
  );
};

export default CharacterPortrait;