import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback, useRef } from "react";

export type Theme = "light" | "dark" | "default";
export type Lang = "en" | "zh" | "ms";

const DICT: Record<string, string> = {
  "app.title": "LAW GUARDIAN",
  "home.tagline": "Decide. Investigate. Defend justice.",
  "btn.start": "START",
  "btn.next": "NEXT",
  "nav.triumph": "Triumph",
  "nav.settings": "Settings",
  "nav.store": "Store",
  "quest.title": "CASES",
  "case.brief": "Brief",
  "case.statements": "Statements",
  "evidence.title": "Evidence",
  "evidence.help": "Tap evidence cards to inspect them.",
  "evidence.selected": "Selected",
  "evidence.close": "Close",
  "legal.title": "Legal",
  "legal.help": "Pick the legal category that fits.",
  "verdict.title": "Verdict",
  "verdict.help": "Choose the verdict and a punishment.",
  "verdict.guilty": "Guilty",
  "verdict.notguilty": "Not Guilty",
  "verdict.assign": "Assign Punishment",
  "verdict.deliver": "Deliver Verdict",
  "result.title": "Result",
  "result.alignsYes": "Aligns with the standard",
  "result.alignsNo": "Does not align with the standard",
  "result.compare": "Compare",
  "result.hide": "Hide",
  "result.continue": "Continue",
  "result.retry": "Retry",
  "result.standard": "Standard of Proof",
  "result.fairness": "Fairness",
  "result.impact": "Impact",
  "result.justice": "Justice",
  "result.questioned": "Questioned",
  "result.trust": "Public Trust",
  "result.upheld": "Upheld",
  "store.title": "STORE",
  "store.not_enough": "Not enough coins",
  "store.owned": "Owned",
  "store.time_ext": "Time Extension",
  "triumph.title": "TRIUMPH",
  "triumph.done": "Done",
  "triumph.locked": "Locked",
  "daily.title": "Daily Rewards",
  "daily.day": "Day",
  "daily.claimed": "Claimed",
  "daily.special": "Special",
  "daily.come_back": "Come back tomorrow for more rewards.",
  "share.title": "Share",
  "share.copy": "Copy link",
  "share.copied": "Link copied — thanks for sharing!",
  "share.already": "Already claimed",
  "save.title": "Cloud Save",
  "save.now": "Save now",
  "save.load": "Load",
  "save.saved": "Progress saved.",
  "save.loaded": "Progress loaded.",
  "feedback.title": "Feedback",
  "feedback.placeholder": "Tell us what you think…",
  "feedback.send": "Send",
  "feedback.thanks": "Thanks for your feedback!",
  "tutorial.title": "How to play",
  "tutorial.body": "Read the brief, examine evidence, pick the legal category, then deliver your verdict.",
  "tutorial.ok": "Got it",
  "terms.title": "Terms & Privacy",
  "terms.agree": "I agree",
  "terms.tos": "Terms of Service",
  "terms.tos_body": "Educational content; not legal advice.",
  "terms.privacy": "Privacy",
  "terms.privacy_body": "Progress is stored locally on your device.",
  "terms.ai": "AI Disclosure",
  "terms.ai_body": "Some text may be machine-translated.",
  "step.brief": "Brief",
  "step.evidence": "Evidence",
  "step.law": "Law",
  "step.verdict": "Verdict",
  "step.result": "Result",
};

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;

  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;

  volume: number;
  setVolume: (v: number) => void;

  bgmEnabled: boolean;
  setBgmEnabled: (b: boolean) => void;

  playCue: () => void;

  coins: number;
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;

  agreedTerms: boolean;
  acceptTerms: () => void;

  tutorialSeen: boolean;
  markTutorialSeen: () => void;

  shareClaimed: boolean;
  claimShare: () => void;

  dailyClaims: boolean[];
  dailyAvailableDay: number;
  claimDailyDay: (day: number) => boolean;

  timeExtensions: number;
  buyTimeExtension: () => boolean;
}

const SettingsCtx = createContext<Ctx | null>(null);

const LS = "lawguardian.settings.v1";
const META_LS = "lawguardian.meta.v1";

type Meta = {
  coins: number;
  agreedTerms: boolean;
  tutorialSeen: boolean;
  shareClaimed: boolean;
  dailyClaims: boolean[];
  dailyDate: string;
  timeExtensions: number;
};

const DEFAULT_META: Meta = {
  coins: 0,
  agreedTerms: false,
  tutorialSeen: false,
  shareClaimed: false,
  dailyClaims: [false, false, false, false, false, false, false],
  dailyDate: "",
  timeExtensions: 0,
};

const todayStr = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const loadMeta = (): Meta => {
  try {
    const raw = localStorage.getItem(META_LS);

    if (!raw) return { ...DEFAULT_META };

    const m = {
      ...DEFAULT_META,
      ...(JSON.parse(raw) as Partial<Meta>),
    };

    if (!Array.isArray(m.dailyClaims) || m.dailyClaims.length !== 7) {
      m.dailyClaims = [...DEFAULT_META.dailyClaims];
    }

    return m;
  } catch {
    return { ...DEFAULT_META };
  }
};

const load = () => {
  try {
    const raw = localStorage.getItem(LS);

    if (!raw) return null;

    return JSON.parse(raw) as {
      theme?: Theme;
      volume?: number;
      bgmEnabled?: boolean;
      lang?: Lang;
    };
  } catch {
    return null;
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const initial = typeof window !== "undefined" ? load() : null;

  const [theme, setThemeState] = useState<Theme>(initial?.theme ?? "default");

  const [volume, setVolumeState] = useState<number>(
    typeof initial?.volume === "number" ? Math.min(100, Math.max(0, initial.volume)) : 70,
  );

  const [bgmEnabled, setBgmEnabledState] = useState<boolean>(initial?.bgmEnabled ?? true);

  const [lang, setLangState] = useState<Lang>(initial?.lang ?? "en");

  const [meta, setMeta] = useState<Meta>(() => (typeof window !== "undefined" ? loadMeta() : { ...DEFAULT_META }));

  useEffect(() => {
    try {
      localStorage.setItem(
        LS,
        JSON.stringify({
          theme,
          volume,
          bgmEnabled,
          lang,
        }),
      );
    } catch {}
  }, [theme, volume, bgmEnabled, lang]);

  useEffect(() => {
    try {
      localStorage.setItem(META_LS, JSON.stringify(meta));
    } catch {}
  }, [meta]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("theme-light", "theme-dark");

    if (theme === "light") root.classList.add("theme-light");

    if (theme === "dark") root.classList.add("theme-dark");
  }, [theme]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCue = useCallback(() => {
    try {
      if (volume <= 0) return;

      if (!audioCtxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        audioCtxRef.current = new AC();
      }

      const ctx = audioCtxRef.current;

      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.type = "square";
      o.frequency.value = 660;

      g.gain.value = (volume / 100) * 0.08;

      o.connect(g).connect(ctx.destination);

      o.start();
      o.stop(ctx.currentTime + 0.06);
    } catch {}
  }, [volume]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(100, Math.max(0, v)));
  }, []);

  const setBgmEnabled = useCallback((b: boolean) => {
    setBgmEnabledState(b);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const t = useCallback((key: string) => DICT[key] ?? key, []);

  const addCoins = useCallback((n: number) => {
    setMeta((m) => ({
      ...m,
      coins: Math.max(0, m.coins + n),
    }));
  }, []);

  const spendCoins = useCallback(
    (n: number) => {
      if (meta.coins < n) return false;

      setMeta((m) => ({
        ...m,
        coins: m.coins - n,
      }));

      return true;
    },
    [meta.coins],
  );

  const acceptTerms = useCallback(() => {
    setMeta((m) => ({
      ...m,
      agreedTerms: true,
    }));
  }, []);

  const markTutorialSeen = useCallback(() => {
    setMeta((m) => ({
      ...m,
      tutorialSeen: true,
    }));
  }, []);

  const claimShare = useCallback(() => {
    setMeta((m) =>
      m.shareClaimed
        ? m
        : {
            ...m,
            shareClaimed: true,
            coins: m.coins + 100,
          },
    );
  }, []);

  const claimDailyDay = useCallback(
    (day: number) => {
      if (meta.dailyDate === todayStr()) return false;

      const idx = day - 1;

      if (idx < 0 || idx > 6) return false;

      if (meta.dailyClaims[idx]) return false;

      const nextIdx = meta.dailyClaims.findIndex((c) => !c);

      if (nextIdx !== idx) return false;

      setMeta((m) => {
        const newClaims = [...m.dailyClaims];

        newClaims[idx] = true;

        const reward = day === 7 ? 0 : 50 * day;
        const extras = day === 7 ? 1 : 0;

        return {
          ...m,
          dailyClaims: newClaims,
          dailyDate: todayStr(),
          coins: m.coins + reward,
          timeExtensions: m.timeExtensions + extras,
        };
      });

      return true;
    },
    [meta],
  );

  const buyTimeExtension = useCallback(() => {
    if (meta.coins < 150) return false;

    setMeta((m) => ({
      ...m,
      coins: m.coins - 150,
      timeExtensions: m.timeExtensions + 1,
    }));

    return true;
  }, [meta.coins]);

  const dailyAvailableDay = useMemo(() => {
    if (meta.dailyDate === todayStr()) return 0;

    const idx = meta.dailyClaims.findIndex((c) => !c);

    return idx < 0 ? 0 : idx + 1;
  }, [meta.dailyClaims, meta.dailyDate]);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,

      lang,
      setLang,
      t,

      volume,
      setVolume,

      bgmEnabled,
      setBgmEnabled,

      playCue,

      coins: meta.coins,
      addCoins,
      spendCoins,

      agreedTerms: meta.agreedTerms,
      acceptTerms,

      tutorialSeen: meta.tutorialSeen,
      markTutorialSeen,

      shareClaimed: meta.shareClaimed,
      claimShare,

      dailyClaims: meta.dailyClaims,
      dailyAvailableDay,
      claimDailyDay,

      timeExtensions: meta.timeExtensions,
      buyTimeExtension,
    }),
    [
      theme,
      setTheme,
      lang,
      setLang,
      t,

      volume,
      setVolume,

      bgmEnabled,
      setBgmEnabled,

      playCue,

      meta,

      addCoins,
      spendCoins,

      acceptTerms,
      markTutorialSeen,
      claimShare,

      dailyAvailableDay,
      claimDailyDay,

      buyTimeExtension,
    ],
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
};

export const useSettings = () => {
  const v = useContext(SettingsCtx);

  if (!v) {
    throw new Error("useSettings must be used inside <SettingsProvider>");
  }

  return v;
};
