import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useSettings } from "@/game/SettingsContext";
import { supabase } from "@/integrations/supabase/client";

type FeedbackRow = {
  id: string;
  message: string;
  lang: string | null;
  user_agent: string | null;
  created_at: string;
};

const SESSION_KEY = "lawguardian.inbox.unlocked.v1";

export const InboxModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useSettings();
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FeedbackRow[]>([]);

  useEffect(() => {
    if (!open) return;
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      setUnlocked(true);
      void load(cached);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const load = async (pwd: string): Promise<boolean> => {
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase.functions.invoke("feedback-inbox", {
      body: { password: pwd },
    });
    setLoading(false);
    if (error || !data || (data as any).error) {
      setErr(t("inbox.wrong"));
      setUnlocked(false);
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    setItems(((data as any).feedbacks ?? []) as FeedbackRow[]);
    return true;
  };

  const tryUnlock = async () => {
    if (!password) return;
    const ok = await load(password);
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, password);
      setUnlocked(true);
    }
  };

  const reset = () => {
    setUnlocked(false);
    setPassword("");
    setItems([]);
    setErr(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setErr(null);
        onClose();
      }}
      title={t("inbox.title")}
    >
      {!unlocked ? (
        <div className="flex flex-col gap-3">
          <label className="pixel text-[10px] opacity-80">{t("inbox.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") tryUnlock();
            }}
            className="pixel-frame p-2 text-sm bg-input text-foreground outline-none"
            autoFocus
          />
          <button
            onClick={tryUnlock}
            disabled={loading || !password}
            className="pixel-btn text-[10px] disabled:opacity-60"
          >
            🔓 {t("inbox.unlock")}
          </button>
          {err && <p className="pixel text-[9px] text-center text-destructive">{err}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-[10px] opacity-70">{items.length} item(s)</span>
            <div className="flex gap-2">
              <button
                onClick={() => load(sessionStorage.getItem(SESSION_KEY) ?? "")}
                className="pixel-btn text-[9px]"
                disabled={loading}
              >
                ↻
              </button>
              <button onClick={reset} className="pixel-btn text-[9px]">
                🔒
              </button>
            </div>
          </div>
          {loading && <p className="text-[10px] opacity-70">…</p>}
          {!loading && items.length === 0 && (
            <p className="text-[10px] opacity-70 text-center py-6">{t("inbox.empty")}</p>
          )}
          <ul className="flex flex-col gap-2">
            {items.map((f) => (
              <li key={f.id} className="pixel-frame p-2 text-xs">
                <div className="flex justify-between gap-2 text-[9px] opacity-70 mb-1">
                  <span>{new Date(f.created_at).toLocaleString()}</span>
                  {f.lang && <span>[{f.lang}]</span>}
                </div>
                <p className="whitespace-pre-wrap break-words leading-snug">{f.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default InboxModal;