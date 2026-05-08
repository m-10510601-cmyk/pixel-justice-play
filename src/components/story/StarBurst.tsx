import { useEffect, useMemo } from "react";

type Props = {
  count: number;
  onDone?: () => void;
};

/**
 * Full-screen celebratory star burst overlay.
 * Mounts → plays ~1.6s → calls onDone so parent can unmount.
 */
const StarBurst = ({ count, onDone }: Props) => {
  const particles = useMemo(() => {
    const n = Math.min(24, Math.max(6, count * 4));
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 140 + Math.random() * 180;
      return {
        id: i,
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist}px`,
        rot: `${(Math.random() * 720 - 360).toFixed(0)}deg`,
        delay: `${(Math.random() * 0.15).toFixed(2)}s`,
        size: 14 + Math.round(Math.random() * 14),
      };
    });
  }, [count]);

  useEffect(() => {
    const id = window.setTimeout(() => onDone?.(), 1700);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute w-64 h-64 rounded-full animate-star-glow"
        style={{
          background:
            "radial-gradient(circle, hsl(48 100% 70% / 0.85) 0%, hsl(48 100% 60% / 0.35) 40%, transparent 70%)",
        }}
      />
      {/* Center big star */}
      <div
        className="absolute text-[88px] leading-none animate-star-pop drop-shadow-[0_0_24px_hsl(48_100%_60%)]"
        style={{ color: "hsl(48 100% 60%)" }}
      >
        ★
      </div>
      {/* Flying particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-star-fly drop-shadow-[0_0_8px_hsl(48_100%_60%)]"
          style={
            {
              fontSize: p.size,
              color: "hsl(48 100% 65%)",
              "--tx": p.tx,
              "--ty": p.ty,
              "--rot": p.rot,
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        >
          ★
        </div>
      ))}
    </div>
  );
};

export default StarBurst;