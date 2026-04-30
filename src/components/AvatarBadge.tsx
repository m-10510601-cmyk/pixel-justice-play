/**
 * Tiny pixel guardian portrait with blinking eye animation.
 * Used in the top-left HUD.
 */
const AvatarBadge = () => {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: 28, height: 28,
        background: "hsl(28 35% 62%)",
        border: "2px solid hsl(0 0% 0%)",
        boxShadow: "inset 0 -3px 0 hsl(28 35% 45%), inset 0 3px 0 hsl(28 35% 78%)",
      }}
      aria-hidden="true"
    >
      {/* hair / wig */}
      <div className="absolute" style={{ top: 2, left: 2, right: 2, height: 6, background: "hsl(0 0% 92%)", boxShadow: "inset 0 0 0 1px hsl(0 0% 0%)" }} />
      {/* eyes */}
      <div className="absolute avatar-blink-eye" style={{ top: 11, left: 6, width: 3, height: 3, background: "hsl(0 0% 0%)" }} />
      <div className="absolute avatar-blink-eye" style={{ top: 11, right: 6, width: 3, height: 3, background: "hsl(0 0% 0%)" }} />
      {/* mouth */}
      <div className="absolute" style={{ bottom: 4, left: "50%", transform: "translateX(-50%)", width: 6, height: 1, background: "hsl(0 0% 0%)" }} />
    </div>
  );
};

export default AvatarBadge;