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
    /* OUTER OVERLAY (DO NOT USE flex layout that depends on parent) */
    <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} role="dialog" aria-modal="true">
      {/* CENTER WRAPPER */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {/* MODAL BOX */}
        <div
          className="w-full max-w-2xl max-h-[90vh] bg-background border-accent pixel-btn flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER (FIXED, NOT SCROLLING) */}
          <div className="text-center p-5 border-b border-accent">
            <h1 className="pixel text-xl text-primary mb-2">LAW GUARDIAN</h1>

            <div className="pixel text-sm text-[hsl(var(--gold))] mb-1">{t("avatar.title")}</div>

            <div className="text-xs opacity-80">
              {t("avatar.current")}: <span className="text-accent">Lv {level}</span>
            </div>
          </div>

          {/* SCROLLABLE AREA (ONLY THIS SCROLLS) */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pt-4">
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
                    "pixel-btn",
                    "w-full",
                    "flex items-center gap-4",
                    "p-4",
                    "min-h-[96px]",
                    "text-left",
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
                    {a.render(48)}
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
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

          {/* FOOTER (FIXED BUTTON AREA) */}
          <div className="p-4 border-t border-accent flex justify-center">
            <button onClick={onClose} className="pixel-btn text-sm px-4">
              {t("avatar.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
