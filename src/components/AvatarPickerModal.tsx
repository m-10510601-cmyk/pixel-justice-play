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
        className="
          pixel-btn
          border-accent
          bg-background
          max-w-xl
          w-full
          p-5
          max-h-[85vh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="pixel text-base text-primary">{t("avatar.title")}</h2>

          <span className="text-xs opacity-80">
            {t("avatar.current")}:<span className="text-accent ml-1">Lv {level}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {AVATARS.map((a) => {
            const unlocked = isAvatarUnlocked(a.id, level);
            const equipped = a.id === avatarId;
            const rarity = rarityFor(a.unlockLevel);

            return (
              <button
                key={a.id}
                disabled={!unlocked}
                onClick={() => unlocked && setAvatar(a.id)}
                className={[
                  "pixel-btn-square",
                  "flex",
                  "flex-col",
                  "items-center",
                  "justify-start",
                  "gap-2",
                  "p-3",
                  "min-h-[145px]",
                  "overflow-visible",
                  !unlocked
                    ? "cursor-not-allowed opacity-90"
                    : "cursor-pointer hover:scale-[1.02] transition-transform",
                ].join(" ")}
                style={{
                  width: "100%",
                  background: "hsl(28 25% 14%)",
                }}
                aria-label={a.name}
              >
                <div
                  className={[
                    "avatar-royal",
                    "avatar-rarity-ring",
                    rarity.className,
                    equipped ? "avatar-royal--equipped" : "",
                    !unlocked ? "avatar-royal--locked" : "",
                  ].join(" ")}
                  style={{
                    padding: 6,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {a.render(52)}
                  </div>

                  <span aria-hidden className="avatar-rivet tl" />
                  <span aria-hidden className="avatar-rivet tr" />
                  <span aria-hidden className="avatar-rivet bl" />
                  <span aria-hidden className="avatar-rivet br" />

                  {!unlocked && <span aria-hidden className="avatar-lock-overlay" />}
                </div>

                <div
                  className="
                    pixel
                    text-[10px]
                    text-center
                    leading-tight
                    px-1
                    w-full
                    break-words
                    text-[hsl(var(--gold))]
                  "
                >
                  <T>{a.name}</T>
                </div>

                {equipped ? (
                  <div className="text-[9px] text-accent text-center">
                    ✓ <T>{t("avatar.equipped")}</T>
                  </div>
                ) : !unlocked ? (
                  <div className="text-[9px] opacity-80 text-center px-1">
                    <T>{t("avatar.locked").replace("{n}", String(a.unlockLevel))}</T>
                  </div>
                ) : (
                  <div className="text-[9px] opacity-70 text-center">Lv {a.unlockLevel}</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="pixel-btn text-sm">
            {t("avatar.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
