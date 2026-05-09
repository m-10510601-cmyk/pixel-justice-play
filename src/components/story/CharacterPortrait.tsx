/**
 * Pure CSS pixel-art character portraits for dialogue scenes.
 * Each character is a 16x16 pixel grid composed of colored blocks.
 */
export type CharacterKey =
  | "principal"
  | "parent"
  | "you"
  | "aira"
  | "narrator"
  | "officer"
  | "detective"
  | "lawyer"
  | "doctor"
  | "student_m"
  | "student_f"
  | "suspect"
  | "civilian_m"
  | "civilian_f"
  | "journalist"
  | "expert"
  | "voice";

interface Props {
  character: CharacterKey;
  size?: number;
  speaking?: boolean;
}

const px = (n: number) => `${n}px`;

const CharacterPortrait = ({ character, size = 56, speaking = true }: Props) => {
  const s = size;
  const u = s / 16;

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

  const Face = ({ skin }: { skin: string }) => (
    <>
      <div style={block(4, 4, 8, 9, skin)} />
      <div style={block(6, 13, 4, 1, skin)} />
    </>
  );
  const Eyes = ({ color = "hsl(0 0% 0%)" }: { color?: string }) => (
    <>
      <div style={block(5, 8, 1, 1, color)} />
      <div style={block(10, 8, 1, 1, color)} />
    </>
  );
  const Mouth = ({ color = "hsl(0 0% 0%)" }: { color?: string }) => (
    <div style={block(7, 11, 2, 1, color)} />
  );

  let inner: React.ReactNode = null;

  if (character === "principal") {
    const skin = "hsl(28 40% 70%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 3, 10, 2, "hsl(0 0% 25%)")} />
        <div style={block(3, 5, 1, 4, "hsl(0 0% 25%)")} />
        <div style={block(12, 5, 1, 4, "hsl(0 0% 25%)")} />
        <div style={block(5, 7, 2, 2, "hsl(0 0% 95%)")} />
        <div style={block(9, 7, 2, 2, "hsl(0 0% 95%)")} />
        <div style={block(7, 8, 2, 1, "hsl(0 0% 0%)")} />
        <Eyes />
        <Mouth color="hsl(0 40% 30%)" />
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
        <div style={block(3, 3, 10, 3, "hsl(20 40% 18%)")} />
        <div style={block(3, 6, 1, 7, "hsl(20 40% 18%)")} />
        <div style={block(12, 6, 1, 7, "hsl(20 40% 18%)")} />
        <Eyes />
        <Mouth color="hsl(0 50% 40%)" />
        <div style={block(5, 10, 1, 1, "hsl(200 80% 70%)")} />
        <div style={block(3, 14, 10, 2, "hsl(340 35% 55%)")} />
      </>
    );
  } else if (character === "aira") {
    const skin = "hsl(28 50% 80%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 3, 10, 3, "hsl(0 0% 10%)")} />
        <div style={block(3, 6, 1, 5, "hsl(0 0% 10%)")} />
        <div style={block(12, 6, 1, 5, "hsl(0 0% 10%)")} />
        <Eyes />
        <Mouth color="hsl(0 30% 35%)" />
        <div style={block(3, 14, 10, 2, "hsl(210 50% 35%)")} />
        <div style={block(7, 14, 2, 2, "hsl(0 0% 95%)")} />
      </>
    );
  } else if (character === "you") {
    const skin = "hsl(28 35% 62%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 2, 10, 4, "hsl(0 0% 92%)")} />
        <div style={block(2, 4, 1, 6, "hsl(0 0% 92%)")} />
        <div style={block(13, 4, 1, 6, "hsl(0 0% 92%)")} />
        <Eyes />
        <Mouth />
        <div style={block(3, 14, 10, 2, "hsl(0 0% 8%)")} />
        <div style={block(7, 14, 2, 2, "hsl(45 90% 55%)")} />
      </>
    );
  } else if (character === "officer") {
    const skin = "hsl(28 38% 65%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* navy cap */}
        <div style={block(3, 2, 10, 3, "hsl(220 60% 22%)")} />
        <div style={block(2, 5, 12, 1, "hsl(220 60% 16%)")} />
        {/* badge */}
        <div style={block(7, 3, 2, 1, "hsl(48 100% 60%)")} />
        <Eyes />
        <Mouth />
        {/* navy uniform with tie */}
        <div style={block(3, 14, 10, 2, "hsl(220 50% 28%)")} />
        <div style={block(7, 14, 2, 2, "hsl(0 0% 95%)")} />
        <div style={block(7, 14, 2, 1, "hsl(220 80% 40%)")} />
      </>
    );
  } else if (character === "detective") {
    const skin = "hsl(28 35% 60%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* fedora */}
        <div style={block(4, 2, 8, 2, "hsl(20 35% 22%)")} />
        <div style={block(2, 4, 12, 1, "hsl(20 35% 18%)")} />
        <Eyes />
        <Mouth />
        {/* trench coat */}
        <div style={block(3, 14, 10, 2, "hsl(35 25% 40%)")} />
        <div style={block(6, 14, 1, 2, "hsl(35 25% 28%)")} />
        <div style={block(9, 14, 1, 2, "hsl(35 25% 28%)")} />
      </>
    );
  } else if (character === "lawyer") {
    const skin = "hsl(28 35% 65%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* barrister wig */}
        <div style={block(3, 2, 10, 4, "hsl(0 0% 92%)")} />
        <div style={block(2, 4, 1, 7, "hsl(0 0% 92%)")} />
        <div style={block(13, 4, 1, 7, "hsl(0 0% 92%)")} />
        <Eyes />
        <Mouth />
        {/* black robe + white tab */}
        <div style={block(3, 14, 10, 2, "hsl(0 0% 8%)")} />
        <div style={block(7, 14, 2, 2, "hsl(0 0% 95%)")} />
      </>
    );
  } else if (character === "doctor") {
    const skin = "hsl(28 40% 70%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* surgical cap */}
        <div style={block(3, 3, 10, 3, "hsl(180 30% 55%)")} />
        <Eyes />
        {/* mask */}
        <div style={block(4, 10, 8, 3, "hsl(0 0% 95%)")} />
        {/* scrubs */}
        <div style={block(3, 14, 10, 2, "hsl(180 30% 55%)")} />
        {/* stethoscope */}
        <div style={block(5, 14, 1, 2, "hsl(0 0% 10%)")} />
        <div style={block(10, 14, 1, 2, "hsl(0 0% 10%)")} />
      </>
    );
  } else if (character === "student_m") {
    const skin = "hsl(28 45% 72%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* short dark hair */}
        <div style={block(3, 3, 10, 3, "hsl(28 60% 22%)")} />
        <Eyes />
        <Mouth />
        {/* uniform */}
        <div style={block(3, 14, 10, 2, "hsl(0 0% 95%)")} />
        <div style={block(7, 14, 2, 2, "hsl(0 60% 40%)")} />
      </>
    );
  } else if (character === "student_f") {
    const skin = "hsl(28 50% 78%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* longer hair, side bangs */}
        <div style={block(3, 3, 10, 3, "hsl(30 50% 28%)")} />
        <div style={block(2, 6, 2, 6, "hsl(30 50% 28%)")} />
        <div style={block(12, 6, 2, 6, "hsl(30 50% 28%)")} />
        <Eyes />
        <Mouth color="hsl(340 50% 45%)" />
        <div style={block(3, 14, 10, 2, "hsl(340 35% 60%)")} />
      </>
    );
  } else if (character === "suspect") {
    const skin = "hsl(28 25% 55%)";
    inner = (
      <>
        <Face skin={skin} />
        {/* hoodie up */}
        <div style={block(2, 2, 12, 4, "hsl(220 15% 15%)")} />
        <div style={block(2, 6, 2, 8, "hsl(220 15% 15%)")} />
        <div style={block(12, 6, 2, 8, "hsl(220 15% 15%)")} />
        {/* shadow over eyes */}
        <div style={block(4, 7, 8, 1, "hsl(0 0% 0% / 0.6)")} />
        <Eyes />
        <Mouth />
        <div style={block(3, 14, 10, 2, "hsl(220 15% 18%)")} />
      </>
    );
  } else if (character === "civilian_m") {
    const skin = "hsl(28 38% 65%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 3, 10, 2, "hsl(28 50% 20%)")} />
        <Eyes />
        <Mouth />
        <div style={block(3, 14, 10, 2, "hsl(210 30% 45%)")} />
      </>
    );
  } else if (character === "civilian_f") {
    const skin = "hsl(28 45% 75%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 3, 10, 3, "hsl(0 0% 12%)")} />
        <div style={block(3, 6, 1, 6, "hsl(0 0% 12%)")} />
        <div style={block(12, 6, 1, 6, "hsl(0 0% 12%)")} />
        <Eyes />
        <Mouth color="hsl(340 50% 45%)" />
        <div style={block(3, 14, 10, 2, "hsl(280 30% 45%)")} />
      </>
    );
  } else if (character === "journalist") {
    const skin = "hsl(28 40% 68%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 3, 10, 2, "hsl(30 40% 25%)")} />
        <Eyes />
        <Mouth />
        {/* blazer */}
        <div style={block(3, 14, 10, 2, "hsl(0 0% 15%)")} />
        {/* TV mic */}
        <div style={block(11, 9, 2, 2, "hsl(0 70% 45%)")} />
        <div style={block(11, 11, 1, 4, "hsl(0 0% 20%)")} />
      </>
    );
  } else if (character === "expert") {
    const skin = "hsl(28 35% 68%)";
    inner = (
      <>
        <Face skin={skin} />
        <div style={block(3, 3, 10, 2, "hsl(0 0% 70%)")} />
        {/* glasses */}
        <div style={block(4, 7, 3, 2, "hsl(0 0% 95%)")} />
        <div style={block(9, 7, 3, 2, "hsl(0 0% 95%)")} />
        <div style={block(7, 8, 2, 1, "hsl(0 0% 0%)")} />
        <Eyes />
        <Mouth />
        {/* lab coat */}
        <div style={block(3, 14, 10, 2, "hsl(0 0% 95%)")} />
      </>
    );
  } else if (character === "voice") {
    inner = (
      <>
        {/* silhouette */}
        <div style={block(4, 4, 8, 9, "hsl(0 0% 18%)")} />
        <div style={block(3, 14, 10, 2, "hsl(0 0% 12%)")} />
        {/* sound waves */}
        <div style={block(1, 6, 1, 4, "hsl(180 80% 60%)")} />
        <div style={block(14, 6, 1, 4, "hsl(180 80% 60%)")} />
        <div style={block(0, 7, 1, 2, "hsl(180 80% 60%)")} />
        <div style={block(15, 7, 1, 2, "hsl(180 80% 60%)")} />
        {/* question mark */}
        <div style={block(7, 7, 2, 1, "hsl(180 80% 70%)")} />
        <div style={block(8, 8, 1, 2, "hsl(180 80% 70%)")} />
        <div style={block(7, 11, 2, 1, "hsl(180 80% 70%)")} />
      </>
    );
  } else {
    inner = (
      <>
        <div style={block(4, 4, 8, 9, "hsl(0 0% 30%)")} />
        <div style={block(3, 14, 10, 2, "hsl(0 0% 20%)")} />
      </>
    );
  }

  return (
    <div className={speaking ? "speak-bob" : ""} style={wrap} aria-hidden="true">
      {inner}
    </div>
  );
};

export default CharacterPortrait;
