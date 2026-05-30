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
        className="pixel-btn border-accent bg-background w-full max-w-2xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER (FIXED TOP LAYOUT) */}
        <div className="mb-5 text-center">
          <h1 className="pixel text-xl text-primary mb-2">LAW GUARDIAN</h1>

          <div className="pixel text-sm text-[hsl(var(--gold))] mb-1">{t("avatar.title")}</div>

          <div className="text-xs opacity-80">
            {t("avatar.current")}:<span className="text-accent ml-1">Lv {level}</span>
          </div>
        </div>

        {/* AVATAR LIST (VERTICAL, FULL WIDTH, SAFE PADDING) */}
        <div className="flex flex-col gap-3 pt-2">
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
                  "p-4",
                  "min-h-[96px]",
                  "relative",
                  equipped ? "border-accent" : "",
                  !unlocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                {/* AVATAR ICON */}
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

                  <span className="avatar-rivet tl" />
                  <span className="avatar-rivet tr" />
                  <span className="avatar-rivet bl" />
                  <span className="avatar-rivet br" />

                  {!unlocked && <span className="avatar-lock-overlay" />}
                </div>

                {/* NAME + STATUS */}
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
                    <div className="text-xs opacity-60">Lv {a.unlockLevel}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* CLOSE BUTTON (BOTTOM CENTER) */}
        <div className="mt-6 flex justify-center">
          <button onClick={onClose} className="pixel-btn text-sm px-4">
            {t("avatar.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
