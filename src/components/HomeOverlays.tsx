import { useState } from "react";
import Modal from "./Modal";
import { useSettings } from "@/game/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { loadAutoSave, restoreAutoSave } from "@/lib/autoSave";

const feedbackSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export const DailyRewardsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t, dailyClaims, dailyAvailableDay, claimDailyDay, playCue } = useSettings();
  return (
    <Modal open={open} onClose={onClose} title={t("daily.title")}>
      <div className="grid grid-cols-4 gap-2">
        {dailyClaims.map((claimed, i) => {
          const day = i + 1;
          const isAvailable = day === dailyAvailableDay;
          const isSpecial = day === 7;
          return (
            <button
              key={day}
              disabled={!isAvailable || claimed}
              onClick={() => { if (claimDailyDay(day)) playCue(); }}
              className={`pixel-frame p-2 flex flex-col items-center justify-center gap-1 aspect-square ${
                claimed ? "opacity-40" : isAvailable ? "ring-2 ring-accent animate-pulse" : "opacity-70"
              } ${isSpecial ? "col-span-2 row-span-1" : ""}`}
              style={isSpecial ? { gridColumn: "span 2" } : undefined}
            >
              <div className="pixel text-[8px] text-primary">{t("daily.day")} {day}</div>
              <div className="text-2xl">{isSpecial ? "🎁" : "⭐"}</div>
              <div className="pixel text-[8px]">
                {claimed ? t("daily.claimed") : isSpecial ? t("daily.special") : `+${50 * day}`}
              </div>
            </button>
          );
        })}
      </div>
      {dailyAvailableDay === 0 && (
        <p className="pixel text-[9px] text-center mt-3 text-muted-foreground">{t("daily.come_back")}</p>
      )}
    </Modal>
  );
};

export const ShareModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t, shareClaimed, claimShare, playCue } = useSettings();
  const [msg, setMsg] = useState<string>("");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
    } catch {}
    playCue();
    if (!shareClaimed) {
      claimShare();
      setMsg(t("share.copied"));
    } else {
      setMsg(t("share.already"));
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={t("share.title")}>
      <div className="flex flex-col gap-3">
        <div className="pixel-frame p-2 text-xs break-all text-center">
          {typeof window !== "undefined" ? window.location.origin : ""}
        </div>
        <button onClick={handleCopy} className="pixel-btn text-[10px]">{t("share.copy")}</button>
        {msg && <p className="pixel text-[9px] text-center text-accent">{msg}</p>}
      </div>
    </Modal>
  );
};

export const SaveLoadModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t, playCue } = useSettings();
  const [msg, setMsg] = useState<string>("");
  const KEY = "lawguardian.cloudsave.v1";
  const save = () => {
    try {
      const snapshot = {
        meta: localStorage.getItem("lawguardian.meta.v1"),
        settings: localStorage.getItem("lawguardian.settings.v1"),
        ts: Date.now(),
      };
      localStorage.setItem(KEY, JSON.stringify(snapshot));
      setMsg(t("save.saved"));
      playCue();
    } catch {}
  };
  const loadFn = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as { meta?: string; settings?: string };
      if (s.meta) localStorage.setItem("lawguardian.meta.v1", s.meta);
      if (s.settings) localStorage.setItem("lawguardian.settings.v1", s.settings);
      setMsg(t("save.loaded"));
      playCue();
      setTimeout(() => window.location.reload(), 600);
    } catch {}
  };
  const restoreAuto = () => {
    const s = loadAutoSave();
    if (!s) { setMsg("NO AUTO-SAVE"); return; }
    if (restoreAutoSave()) {
      setMsg("AUTO-SAVE RESTORED");
      playCue();
      setTimeout(() => window.location.reload(), 600);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={t("save.title")}>
      <div className="flex flex-col gap-3">
        <button onClick={save} className="pixel-btn text-[10px]">☁ {t("save.now")}</button>
        <button onClick={loadFn} className="pixel-btn pixel-btn-secondary text-[10px]">⤓ {t("save.load")}</button>
        <button onClick={restoreAuto} className="pixel-btn pixel-btn-secondary text-[10px]">↻ RESTORE AUTO-SAVE</button>
        {msg && <p className="pixel text-[9px] text-center text-accent">{msg}</p>}
      </div>
    </Modal>
  );
};

export const FeedbackModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t, playCue, lang } = useSettings();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const send = async () => {
    setErr(null);
    const parsed = feedbackSchema.safeParse({ message: text });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSending(true);
    const ua = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null;
    const { error } = await supabase.from("feedbacks").insert({
      message: parsed.data.message,
      lang,
      user_agent: ua,
    });
    setSending(false);
    if (error) {
      // Offline fallback: keep locally so it's not lost.
      try {
        const all = JSON.parse(localStorage.getItem("lawguardian.feedback.v1") || "[]");
        all.push({ text: parsed.data.message, ts: Date.now() });
        localStorage.setItem("lawguardian.feedback.v1", JSON.stringify(all));
      } catch {}
    }
    setSent(true);
    setText("");
    playCue();
  };
  return (
    <Modal open={open} onClose={() => { setSent(false); setErr(null); onClose(); }} title={t("feedback.title")}>
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("feedback.placeholder")}
          maxLength={1000}
          className="pixel-frame p-2 text-sm bg-input text-foreground min-h-[100px] outline-none"
        />
        <button onClick={send} disabled={sending} className="pixel-btn text-[10px] disabled:opacity-60">
          ✉ {sending ? "…" : t("feedback.send")}
        </button>
        {err && <p className="pixel text-[9px] text-center text-destructive">{err}</p>}
        {sent && <p className="pixel text-[9px] text-center text-accent">{t("feedback.thanks")}</p>}
      </div>
    </Modal>
  );
};

export const TutorialModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t, playCue } = useSettings();
  return (
    <Modal open={open} onClose={onClose} title={t("tutorial.title")} dismissible={false}>
      <p className="text-sm leading-snug mb-4">{t("tutorial.body")}</p>
      <button onClick={() => { playCue(); onClose(); }} className="pixel-btn w-full text-xs">
        {t("tutorial.ok")}
      </button>
    </Modal>
  );
};