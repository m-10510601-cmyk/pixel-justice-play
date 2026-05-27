import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/game/SettingsContext";
import { validateUsername } from "@/game/SettingsContext";
import Modal from "./Modal";

const suggest = () => `Guardian${Math.floor(1000 + Math.random() * 9000)}`;

const MAX_LEN = 16;
const MIN_LEN = 2;

const UsernameGate = () => {
  const { agreedTerms, username, setUsername, t, playCue } = useSettings();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const seededRef = useRef(false);

  const open = agreedTerms && !username;

  // Seed a suggested name ONCE per open. After that, never auto-restore — the
  // player must be free to clear the field completely.
  useEffect(() => {
    if (open && !seededRef.current) {
      seededRef.current = true;
      setValue(suggest());
    }
    if (!open) seededRef.current = false;
  }, [open]);

  const submit = () => {
    const err = validateUsername(value);
    if (err) {
      setError(err);
      return;
    }
    playCue();
    // IMPORTANT: only persist the username. Never touch progress / level /
    // meta / avatar localStorage keys here — entering a name must preserve
    // all prior local progress.
    setUsername(value);
  };

  const trimmedLen = value.trim().length;
  const canSubmit = trimmedLen >= MIN_LEN && trimmedLen <= MAX_LEN;

  return (
    <Modal open={open} title={t("username.title")} dismissible={false}>
      <div className="space-y-3">
        <p className="text-[12px] leading-snug text-foreground">{t("username.intro")}</p>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value.slice(0, MAX_LEN));
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) submit();
          }}
          maxLength={MAX_LEN}
          placeholder={t("username.placeholder")}
          aria-label={t("username.placeholder")}
          className="pixel-frame w-full px-3 py-2 text-sm bg-background text-foreground outline-none"
        />
        <div
          className={`pixel text-[9px] text-right ${
            canSubmit ? "text-muted-foreground" : "text-destructive"
          }`}
        >
          {value.length}/{MAX_LEN}
        </div>
        {error && (
          <p className="pixel text-[10px] text-destructive leading-snug">{t(error)}</p>
        )}
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="pixel-btn w-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("username.confirm")}
        </button>
      </div>
    </Modal>
  );
};

export default UsernameGate;