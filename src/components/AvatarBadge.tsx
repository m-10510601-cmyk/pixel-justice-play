import { useSettings } from "@/game/SettingsContext";
import { getAvatar } from "@/lib/avatars";

type Props = {
  size?: number;
  onClick?: () => void;
  showLevel?: boolean;
};

const AvatarBadge = ({ size = 28, onClick, showLevel = true }: Props) => {
  const { avatarId, level } = useSettings();
  const avatar = getAvatar(avatarId);
  const interactive = !!onClick;
  const frame = Math.max(4, Math.round(size * 0.18));
  const total = size + frame * 2;
  const rivet = Math.max(2, Math.round(size * 0.09));
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={interactive ? `Avatar: ${avatar.name}` : undefined}
      className={[
        "avatar-badge-frame",
        interactive ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent" : "",
      ].join(" ")}
      style={{
        position: "relative",
        display: "inline-block",
        lineHeight: 0,
        width: total,
        height: total,
        padding: frame,
        background: "hsl(var(--background))",
        boxShadow:
          "inset 0 0 0 2px hsl(var(--gold)), inset 0 0 0 4px hsl(30 50% 8%), 0 0 0 1px hsl(30 50% 8%)",
      }}
    >
      {avatar.render(size)}
      {/* corner rivets */}
      {[
        { top: 2, left: 2 },
        { top: 2, right: 2 },
        { bottom: 2, left: 2 },
        { bottom: 2, right: 2 },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            width: rivet,
            height: rivet,
            background: "hsl(var(--gold))",
            boxShadow: "inset 0 0 0 1px hsl(30 50% 8%)",
            ...pos,
          }}
        />
      ))}
      {showLevel && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: -3,
            bottom: -3,
            minWidth: Math.round(size * 0.55),
            height: Math.round(size * 0.42),
            padding: "0 4px",
            background: "hsl(var(--gold))",
            color: "hsl(30 50% 8%)",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: Math.max(7, Math.round(size * 0.28)),
            lineHeight: `${Math.round(size * 0.42)}px`,
            textAlign: "center",
            boxShadow: "inset 0 0 0 1px hsl(30 50% 8%), 1px 1px 0 hsl(30 50% 8%)",
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
};

export default AvatarBadge;