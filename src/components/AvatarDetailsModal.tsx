import { useSettings } from "@/game/SettingsContext";
import { AVATARS, getAvatar, isAvatarUnlocked } from "@/lib/avatars";

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: () => void;
};

const rarityFor = (lvl: number): { label: string; color: string } => {
  if (lvl >= 5) return { label: "LEGENDARY", color: "hsl(42 95% 60%)" };
  if (lvl >= 4) return { label: "EPIC", color: "hsl(280 70% 70%)" };
  if (lvl >= 2) return { label: "RARE", color: "hsl(200 80% 65%)" };
  return { label: "COMMON", color: "hsl(0 0% 80%)" };
};

const AvatarDetailsModal = ({ open, onClose, onChange }: Props) => {
  const { avatarId, level } = useSettings();
  if (!open) return null;
  const avatar = getAvatar(avatarId);
  const rarity = rarityFor(avatar.unlockLevel);
  const unlockedCount = AVATARS.filter((a) => isAvatarUnlocked(a.id, level)).length;
  const total = AVATARS.length;
  const pct = Math.round((unlockedCount / total) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="pixel-btn border-accent bg-background max-w-sm w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="pixel text-sm text-primary">AVATAR</h2>
          <span
            className="pixel text-[8px] px-2 py-1"
            style={{
              background: "hsl(30 50% 8%)",
              color: rarity.color,
              boxShadow: "inset 0 0 0 1px " + rarity.color,
            }}
          >
            {rarity.label}
          </span>
        </div>

        {/* Big avatar */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div
            style={{
              padding: 12,
              background: "hsl(var(--background))",
              boxShadow:
                "inset 0 0 0 3px hsl(var(--gold)), inset 0 0 0 6px hsl(30 50% 8%), 0 0 24px hsl(var(--gold) / 0.35)",
            }}
          >
            {avatar.render(96)}
          </div>
          <div className="text-center">
            <div className="pixel text-base text-accent mb-1">{avatar.name.toUpperCase()}</div>
            <div className="text-[10px] opacity-80">
              Lv {level} · Unlocks at Lv {avatar.unlockLevel}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="gold-box p-3 mb-4 text-xs leading-relaxed">
          <span aria-hidden className="gb-rivet tl" />
          <span aria-hidden className="gb-rivet tr" />
          <span aria-hidden className="gb-rivet bl" />
          <span aria-hidden className="gb-rivet br" />
          {avatar.bio}
        </div>

        {/* Collection progress */}
        <div className="gold-box p-3 mb-4">
          <span aria-hidden className="gb-rivet tl" />
          <span aria-hidden className="gb-rivet tr" />
          <span aria-hidden className="gb-rivet bl" />
          <span aria-hidden className="gb-rivet br" />
          <div className="flex justify-between pixel text-[8px] mb-1.5">
            <span className="text-[hsl(var(--gold))]">COLLECTION</span>
            <span className="text-accent">
              {unlockedCount}/{total}
            </span>
          </div>
          <div
            className="w-full h-3 relative"
            style={{
              background: "hsl(30 50% 8%)",
              boxShadow: "inset 0 0 0 1px hsl(var(--gold) / 0.5)",
            }}
          >
            <div
              className="h-full"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(180deg, hsl(48 95% 65%), hsl(36 85% 42%))",
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="pixel-btn pixel-btn-secondary text-xs">
            CLOSE
          </button>
          <button onClick={onChange} className="pixel-btn text-xs">
            CHANGE ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetailsModal;