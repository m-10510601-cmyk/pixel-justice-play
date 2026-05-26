import { useEffect, useRef, useState } from "react";
import { useSettings, validateUsername } from "@/game/SettingsContext";
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
  const { avatarId, level, username, setUsername, t } = useSettings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);
  const [nameErr, setNameErr] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setDraft(username);
      setEditing(false);
      setNameErr(null);
    }
  }, [open, username]);
  const saveName = () => {
    const err = validateUsername(draft);
    if (err) {
      setNameErr(err);
      return;
    }
    setUsername(draft);
    setEditing(false);
    setNameErr(null);
  };
  const avatarWrapRef = useRef<HTMLDivElement>(null);
  const [avatarSize, setAvatarSize] = useState(80);
  useEffect(() => {
    if (!open) return;
    const el = avatarWrapRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      // wrapper has padding ~12px each side; render inside
      const inner = Math.max(0, w - 24);
      setAvatarSize(Math.max(56, Math.min(96, Math.round(inner))));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);
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
        className="gold-box w-[calc(100%-1rem)] max-w-[360px] max-h-[calc(100vh-2rem)] flex flex-col p-3 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden className="gb-rivet tl" />
        <span aria-hidden className="gb-rivet tr" />
        <span aria-hidden className="gb-rivet bl" />
        <span aria-hidden className="gb-rivet br" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h2 className="pixel text-xs sm:text-sm text-primary leading-none">AVATAR</h2>
          <span
            className="pixel text-[8px] px-2 py-1 leading-none"
            style={{
              background: "hsl(30 50% 8%)",
              color: rarity.color,
              boxShadow: "inset 0 0 0 1px " + rarity.color,
            }}
          >
            {rarity.label}
          </span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
          {/* Big avatar */}
          <div className="flex flex-col items-center gap-2">
            <div
              ref={avatarWrapRef}
              className="w-[min(120px,40vw)] aspect-square flex items-center justify-center"
              style={{
                padding: 10,
                background: "hsl(var(--background))",
                boxShadow:
                  "inset 0 0 0 3px hsl(var(--gold)), inset 0 0 0 6px hsl(30 50% 8%), 0 0 24px hsl(var(--gold) / 0.35)",
              }}
            >
              {avatar.render(avatarSize)}
            </div>
            <div className="text-center w-full px-1">
              <div className="pixel text-sm sm:text-base text-accent mb-1 leading-tight break-words">
                {avatar.name.toUpperCase()}
              </div>
              <div className="text-[10px] opacity-80 leading-snug">
                Lv {level} · Unlocks at Lv {avatar.unlockLevel}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="gold-box p-2.5 text-[11px] sm:text-xs leading-relaxed break-words">
            <span aria-hidden className="gb-rivet tl" />
            <span aria-hidden className="gb-rivet tr" />
            <span aria-hidden className="gb-rivet bl" />
            <span aria-hidden className="gb-rivet br" />
            {avatar.bio}
          </div>

          {/* Username */}
          <div className="gold-box p-2.5">
            <span aria-hidden className="gb-rivet tl" />
            <span aria-hidden className="gb-rivet tr" />
            <span aria-hidden className="gb-rivet bl" />
            <span aria-hidden className="gb-rivet br" />
            <div className="flex justify-between pixel text-[8px] mb-1.5 leading-none">
              <span className="text-[hsl(var(--gold))]">{t("username.label")}</span>
            </div>
            {!editing ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] sm:text-sm text-accent break-all">
                  {username || "—"}
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className="pixel-btn pixel-btn-secondary text-[9px] px-2 py-1 shrink-0"
                >
                  {t("username.edit")}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setNameErr(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                  }}
                  maxLength={16}
                  className="pixel-frame w-full px-2 py-1.5 text-xs bg-background text-foreground outline-none"
                  autoFocus
                />
                {nameErr && (
                  <p className="pixel text-[9px] text-destructive leading-snug">{t(nameErr)}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setDraft(username);
                      setNameErr(null);
                    }}
                    className="pixel-btn pixel-btn-secondary text-[9px] px-2 py-1"
                  >
                    {t("username.cancel")}
                  </button>
                  <button onClick={saveName} className="pixel-btn text-[9px] px-2 py-1">
                    {t("username.save")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collection progress */}
          <div className="gold-box p-2.5">
            <span aria-hidden className="gb-rivet tl" />
            <span aria-hidden className="gb-rivet tr" />
            <span aria-hidden className="gb-rivet bl" />
            <span aria-hidden className="gb-rivet br" />
            <div className="flex justify-between pixel text-[8px] mb-1.5 leading-none">
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
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-2 justify-end pt-3 mt-3 border-t border-[hsl(var(--gold)/0.3)] shrink-0">
          <button onClick={onClose} className="pixel-btn pixel-btn-secondary text-[10px] px-3 py-2">
            CLOSE
          </button>
          <button onClick={onChange} className="pixel-btn text-[10px] px-3 py-2">
            CHANGE ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetailsModal;