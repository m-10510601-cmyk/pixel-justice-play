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
        className="pixel-btn border-accent bg-background w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-accent pb-3">
          <h2 className="pixel text-2xl text-primary">{t("avatar.title")}</h2>

          <span className="pixel text-base opacity-90">
            {t("avatar.current")}:<span className="text-accent ml-1">Lv {level}</span>
          </span>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-4 gap-4">
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
                  "pixel-btn-square",
                  "flex flex-col items-center justify-start",
                  "gap-2 p-3",
                  "min-h-[150px]",
                  !unlocked ? "cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
                style={{
                  width: "100%",
                  background: "hsl(28 25% 14%)",
                }}
              >
                {/* Avatar */}
                <div className="w-[72px] h-[72px] flex items-center justify-center">
                  <div
                    className={[
                      "avatar-royal",
                      "avatar-rarity-ring",
                      rarity.className,
                      equipped ? "avatar-royal--equipped" : "",
                      !unlocked ? "avatar-royal--locked" : "",
                    ].join(" ")}
                    style={{ padding: 4 }}
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {a.render(56)}
                    </div>

                    <span aria-hidden className="avatar-rivet tl" />
                    <span aria-hidden className="avatar-rivet tr" />
                    <span aria-hidden className="avatar-rivet bl" />
                    <span aria-hidden className="avatar-rivet br" />

                    {!unlocked && <span aria-hidden className="avatar-lock-overlay" />}
                  </div>
                </div>

                {/* Name */}
                <div className="pixel text-[10px] text-center leading-tight w-full px-1 text-[hsl(var(--gold))]">
                  <T>{a.name}</T>
                </div>

                {/* Status */}
                {equipped ? (
                  <div className="text-[9px] text-accent text-center">
                    ✓ <T>{t("avatar.equipped")}</T>
                  </div>
                ) : !unlocked ? (
                  <div className="text-[8px] opacity-80 text-center px-1">
                    <T>{t("avatar.locked").replace("{n}", String(a.unlockLevel))}</T>
                  </div>
                ) : (
                  <div className="text-[8px] opacity-60 text-center">Lv {a.unlockLevel}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="pixel-btn text-sm px-4 py-2">
            {t("avatar.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
