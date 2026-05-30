import { useSettings } from "@/game/SettingsContext";
import { AVATARS, isAvatarUnlocked, rarityFor } from "@/lib/avatars";
import T from "@/components/T";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AvatarPickerModal = ({ open, onClose }: Props) => {
  const { t, avatarId, setAvatar, level } = useSettings();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="pixel-btn border-accent bg-background w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="pixel text-xl text-primary mb-2">LAW GUARDIAN</h1>

          <div className="pixel text-sm text-[hsl(var(--gold))]">{t("avatar.title")}</div>

          <div className="text-xs opacity-80 mt-1">
            {t("avatar.current")}:<span className="text-accent ml-1">Lv {level}</span>
          </div>
        </div>

        {/* Avatar List */}
        <div className="flex flex-col gap-3">
          {AVATARS.map((a) => {
            const unlocked = isAvatarUnlocked(a.id, level);
            const equipped = a.id === avatarId;
            const rarity = rarityFor(a.unlockLevel);

            return (
              <button
                key={a.id}
                disabled={!unlocked}
                onClick={() => unlocked && setAvatar(a.id)}
                aria-label={a.name}
                className={[
                  "pixel-btn",
                  "w-full",
                  "flex items-center gap-4",
                  "p-3",
                  equipped ? "border-accent" : "",
                  !unlocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                {/* Avatar */}
                <div
                  className={[
                    "avatar-royal",
                    "avatar-rarity-ring",
                    rarity.className,
                    equipped ? "avatar-royal--equipped" : "",
                    !unlocked ? "avatar-royal--locked" : "",
                  ].join(" ")}
                >
                  <div style={{ position: "relative", zIndex: 2 }}>{a.render(48)}</div>

                  <span aria-hidden className="avatar-rivet tl" />
                  <span aria-hidden className="avatar-rivet tr" />
                  <span aria-hidden className="avatar-rivet bl" />
                  <span aria-hidden className="avatar-rivet br" />

                  {!unlocked && <span aria-hidden className="avatar-lock-overlay" />}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <div className="pixel text-sm text-[hsl(var(--gold))]">
                    <T>{a.name}</T>
                  </div>

                  {equipped ? (
                    <div className="text-xs text-accent">
                      ✓ <T>{t("avatar.equipped")}</T>
                    </div>
                  ) : !unlocked ? (
                    <div className="text-xs opacity-80">
                      <T>{t("avatar.locked").replace("{n}", String(a.unlockLevel))}</T>
                    </div>
                  ) : (
                    <div className="text-xs opacity-60">Unlock Lv {a.unlockLevel}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="pixel-btn text-xs">
            {t("avatar.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
