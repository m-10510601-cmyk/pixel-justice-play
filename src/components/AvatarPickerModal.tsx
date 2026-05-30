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
        className="pixel-btn border-accent bg-background w-full max-w-3xl p-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="pixel text-sm text-primary">{t("avatar.title")}</h2>

          <span className="text-xs opacity-80">
            {t("avatar.current")}:<span className="text-accent ml-1">Lv {level}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
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
                  "flex flex-col items-center",
                  "w-[110px]",
                  "min-h-[160px]",
                  "gap-2",
                  unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                ].join(" ")}
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
                    position: "relative",
                  }}
                >
                  <div style={{ position: "relative", zIndex: 2 }}>{a.render(52)}</div>

                  <span aria-hidden className="avatar-rivet tl" />
                  <span aria-hidden className="avatar-rivet tr" />
                  <span aria-hidden className="avatar-rivet bl" />
                  <span aria-hidden className="avatar-rivet br" />

                  {!unlocked && <span aria-hidden className="avatar-lock-overlay" />}
                </div>

                <div
                  className="
                    w-full
                    h-[24px]
                    flex
                    items-center
                    justify-center
                    border-2
                    border-yellow-700
                    bg-black/30
                    px-1
                  "
                >
                  <span
                    className="
                      pixel
                      text-[10px]
                      text-[hsl(var(--gold))]
                      whitespace-nowrap
                      overflow-hidden
                      text-ellipsis
                      max-w-full
                    "
                  >
                    <T>{a.name}</T>
                  </span>
                </div>

                {equipped ? (
                  <div className="text-[9px] text-accent text-center">
                    ✓ <T>{t("avatar.equipped")}</T>
                  </div>
                ) : !unlocked ? (
                  <div className="text-[9px] text-center opacity-80">Lv {a.unlockLevel}</div>
                ) : (
                  <div className="text-[9px] text-center opacity-70">Available</div>
                )}
              </button>
            );
          })}
        </div>

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
