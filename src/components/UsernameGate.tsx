import { useEffect, useState } from "react";
import { useSettings } from "@/game/SettingsContext";
import { validateUsername } from "@/game/SettingsContext";
import Modal from "./Modal";

const suggest = () => `Guardian${Math.floor(1000 + Math.random() * 9000)}`;

const UsernameGate = () => {
  const { agreedTerms, username, setUsername, t, playCue } = useSettings();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const open = agreedTerms && !username;

  useEffect(() => {
    if (open && !value) setValue(suggest());
  }, [open, value]);

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

  return (
    <Modal open={open} title={t("username.title")} dismissible={false}>
      <div className="space-y-3">
        <p className="text-[12px] leading-snug text-foreground">{t("username.intro")}</p>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          maxLength={16}
          placeholder={t("username.placeholder")}
          aria-label={t("username.placeholder")}
          className="pixel-frame w-full px-3 py-2 text-sm bg-background text-foreground outline-none"
        />
        {error && (
          <p className="pixel text-[10px] text-destructive leading-snug">{t(error)}</p>
        )}
        <button onClick={submit} className="pixel-btn w-full text-xs">
          {t("username.confirm")}
        </button>
      </div>
    </Modal>
  );
};

export default UsernameGate;