// Global throttled local autosave. Snapshots all known LawGuardian
// localStorage keys into a single autosave slot, debounced.

const AUTOSAVE_KEY = "lawguardian.autosave.v1";
const PROGRESS_PREFIX = "lawguardian.progress.v1.";
const STATIC_KEYS = [
  "lawguardian.meta.v1",
  "lawguardian.settings.v1",
  "lawguardian.level.v1",
  "lawguardian.xpsources.v1",
  "lawguardian.avatar.v1",
  "lawguardian.username.v1",
];

let timer: ReturnType<typeof setTimeout> | null = null;

function snapshot(): Record<string, string> {
  const data: Record<string, string> = {};
  try {
    for (const k of STATIC_KEYS) {
      const v = localStorage.getItem(k);
      if (v != null) data[k] = v;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PROGRESS_PREFIX)) {
        const v = localStorage.getItem(k);
        if (v != null) data[k] = v;
      }
    }
  } catch {}
  return data;
}

export function scheduleAutoSave(delayMs = 2000) {
  if (typeof window === "undefined") return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      const payload = { ts: Date.now(), data: snapshot() };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("lg:autosaved"));
    } catch {}
  }, delayMs);
}

export function loadAutoSave(): { ts: number; data: Record<string, string> } | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function restoreAutoSave(): boolean {
  const s = loadAutoSave();
  if (!s?.data) return false;
  try {
    for (const [k, v] of Object.entries(s.data)) {
      localStorage.setItem(k, v);
    }
    return true;
  } catch {
    return false;
  }
}

export const AUTOSAVE_KEY_NAME = AUTOSAVE_KEY;