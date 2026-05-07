/**
 * Decorative pixel-art props rendered with CSS — sit between the background
 * and the UI layer. Pure decoration, aria-hidden.
 */
const PixelProps = () => {
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none" aria-hidden="true">

      {/* Brass gavel on silk cushion (top-right) */}
      <div className="absolute" style={{ top: "10%", right: "7%", width: 40, height: 22 }}>
        {/* cushion */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: 8, background: "hsl(340 60% 35%)",
          boxShadow: "inset 0 -2px 0 hsl(340 70% 22%), 1px 1px 0 hsl(0 0% 0%), inset 0 0 0 1px hsl(0 0% 0%)",
        }} />
        {/* gavel head */}
        <div className="absolute" style={{
          left: 6, bottom: 7, width: 16, height: 8,
          background: "linear-gradient(180deg, hsl(40 80% 55%), hsl(28 60% 30%))",
          boxShadow: "inset 0 0 0 1px hsl(0 0% 0%)",
        }} />
        {/* handle */}
        <div className="absolute" style={{
          left: 18, bottom: 9, width: 18, height: 3,
          background: "linear-gradient(180deg, hsl(30 50% 40%), hsl(20 50% 22%))",
          boxShadow: "inset 0 0 0 1px hsl(0 0% 0%)",
        }} />
        {/* shimmer */}
        <div className="absolute lamp-flicker" style={{ top: 6, left: 10, width: 3, height: 2, background: "hsl(48 100% 85%)" }} />
      </div>

      {/* Law books shelf (left side, lower) */}
      <div className="absolute flex items-end gap-[2px]" style={{ top: "30%", left: "4%" }}>
        {[
          { c: "hsl(0 60% 30%)", h: 26 },
          { c: "hsl(220 50% 25%)", h: 30 },
          { c: "hsl(140 40% 25%)", h: 24 },
          { c: "hsl(30 50% 22%)", h: 28 },
        ].map((b, i) => (
          <div key={i} className="relative" style={{
            width: 7, height: b.h, background: b.c,
            boxShadow: "inset 0 0 0 1px hsl(0 0% 0%), inset -1px 0 0 hsl(0 0% 0% / 0.5)",
          }}>
            {/* gold lettering */}
            <span className="absolute left-1/2 -translate-x-1/2" style={{
              top: "30%", color: "hsl(48 100% 65%)", fontSize: 6, lineHeight: 1,
              writingMode: "vertical-rl",
            }}>§</span>
          </div>
        ))}
      </div>

      {/* Wall clock with pendulum (right side) */}
      <div className="absolute" style={{ top: "28%", right: "5%", width: 22, height: 38 }}>
        <div className="absolute top-0 left-0" style={{
          width: 22, height: 22, borderRadius: "50%",
          background: "hsl(40 30% 80%)",
          boxShadow: "inset 0 0 0 2px hsl(0 0% 0%), inset 0 0 0 4px hsl(40 50% 65%)",
        }}>
          <span className="absolute top-1 left-1/2 -translate-x-1/2" style={{ color: "hsl(0 0% 0%)", fontSize: 6, lineHeight: 1 }}>12</span>
          {/* hands */}
          <div className="absolute" style={{ top: "50%", left: "50%", width: 7, height: 1, background: "hsl(0 0% 0%)", transform: "rotate(-30deg)", transformOrigin: "0 50%" }} />
          <div className="absolute" style={{ top: "50%", left: "50%", width: 5, height: 1, background: "hsl(0 0% 0%)", transform: "rotate(60deg)", transformOrigin: "0 50%" }} />
        </div>
        {/* pendulum */}
        <div className="absolute pendulum-swing" style={{ top: 22, left: "50%", width: 1, height: 14, background: "hsl(0 0% 30%)" }}>
          <div className="absolute -bottom-1 -left-1" style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "hsl(48 100% 60%)",
            boxShadow: "inset 0 0 0 1px hsl(0 0% 0%)",
          }} />
        </div>
      </div>

      {/* Wall lamps (flickering) */}
      <div className="absolute lamp-flicker" style={{ top: "18%", left: "22%", width: 6, height: 6, borderRadius: "50%", background: "hsl(48 100% 65%)", boxShadow: "0 0 12px hsl(48 100% 60%), inset 0 0 0 1px hsl(0 0% 0%)" }} />
      <div className="absolute lamp-flicker" style={{ top: "18%", right: "22%", width: 6, height: 6, borderRadius: "50%", background: "hsl(48 100% 65%)", boxShadow: "0 0 12px hsl(48 100% 60%), inset 0 0 0 1px hsl(0 0% 0%)", animationDelay: "0.7s" } as React.CSSProperties} />


      </div>
    </div>
  );
};

export default PixelProps;