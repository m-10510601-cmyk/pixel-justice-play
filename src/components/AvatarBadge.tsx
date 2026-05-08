import { useSettings } from "@/game/SettingsContext";
import { getAvatar } from "@/lib/avatars";

type Props = {
  size?: number;
  onClick?: () => void;
};

const AvatarBadge = ({ size = 28, onClick }: Props) => {
  const { avatarId } = useSettings();
  const avatar = getAvatar(avatarId);
  const interactive = !!onClick;
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
      className={interactive ? "cursor-pointer hover:brightness-125 transition focus:outline-none focus:ring-2 focus:ring-accent" : undefined}
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      {avatar.render(size)}
    </div>
  );
};

export default AvatarBadge;