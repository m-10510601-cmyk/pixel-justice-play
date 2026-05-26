import { useSettings } from "@/game/SettingsContext";
import { getAvatar, rarityFor } from "@/lib/avatars";

type Props = {
  size?: number;
  onClick?: () => void;
  showLevel?: boolean;
};

const AvatarBadge = ({ size = 28, onClick, showLevel = true }: Props) => {
  const { avatarId, level } = useSettings();
  const avatar = getAvatar(avatarId);
  const rarity = rarityFor(avatar.unlockLevel);
  const interactive = !!onClick;
  const frame = Math.max(5, Math.round(size * 0.2));
  const total = size + frame * 2;
  const chip = Math.max(14, Math.round(size * 0.55));
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
      title={avatar.name}
      className={[
        "avatar-royal avatar-rarity-ring",
        rarity.className,
        interactive ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent" : "",
      ].join(" ")}
      style={{
        width: total,
        height: total,
        padding: frame,
      }}
    >
      <div style={{ position: "relative", zIndex: 2 }}>{avatar.render(size)}</div>
      <span aria-hidden className="avatar-rivet tl" />
      <span aria-hidden className="avatar-rivet tr" />
      <span aria-hidden className="avatar-rivet bl" />
      <span aria-hidden className="avatar-rivet br" />
      {showLevel && (
        <span
          aria-hidden
          className="avatar-level-chip"
          style={{
            width: chip,
            height: chip,
            fontSize: Math.max(7, Math.round(size * 0.26)),
            lineHeight: 1,
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
};

export default AvatarBadge;