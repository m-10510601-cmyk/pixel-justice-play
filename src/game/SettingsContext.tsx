import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback, useRef } from "react";
import {
  applyXp,
  loadLevel,
  resolveQuiz as resolveLevelQuiz,
  saveLevel,
  xpToNext as xpNeeded,
  LEVEL_NAMES,
  type LevelState,
  loadXpSources,
  saveXpSources,
  DEFAULT_XP_SOURCES,
  type XpSource,
  type XpSources,
} from "@/lib/levels";
import { loadAvatar, saveAvatar, type AvatarId } from "@/lib/avatars";
import { scheduleAutoSave } from "@/lib/autoSave";

export type Theme = "light" | "dark" | "default";
export type Lang = "en" | "zh" | "ms";

export type ItemId = "gavel" | "book" | "badge" | "scroll" | "scales" | "robe" | "timeExt";

type Dict = Record<string, string>;
const DICT: Dict = {
    "evidence.title": "EVIDENCE ANALYSIS",
    "evidence.help": "Tap to mark evidence as RELIABLE. Long-press for details.",
    "evidence.selected": "✓ SELECTED",
    "evidence.close": "CLOSE",
    "legal.title": "LEGAL REASONING",
    "legal.help": "Choose the legal category that best fits the evidence. Think — don't guess.",
    "verdict.title": "DELIVER VERDICT",
    "verdict.help": "Your final judgement. Choose carefully — there are consequences.",
    "verdict.guilty": "⚖ GUILTY",
    "verdict.notguilty": "✓ NOT GUILTY",
    "verdict.assign": "ASSIGN PUNISHMENT",
    "verdict.deliver": "DELIVER ▶",
    "result.title": "EVALUATION",
    "result.upheld": "JUDGEMENT UPHELD",
    "result.questioned": "JUDGEMENT QUESTIONED",
    "result.alignsYes": "Your verdict aligns with the evidence and the standard of proof.",
    "result.alignsNo": "Your verdict diverges from what the reliable evidence supports.",
    "result.standard": "STANDARD: ",
    "result.impact": "SOCIETAL IMPACT",
    "result.justice": "Justice",
    "result.trust": "Public Trust",
    "result.fairness": "Fairness",
    "result.compare": "COMPARE TO REAL CASES",
    "result.hide": "HIDE REAL-WORLD NOTE",
    "result.retry": "RETRY",
    "result.continue": "CONTINUE",
    "app.title": "LAW GUARDIAN",
    "app.tagline":
      "Defend justice across school halls and city streets. Solve cases, learn the law, become a true Law Guardian.",
    "btn.start": "▶ START",
    "btn.back": "←",
    "btn.next": "NEXT ▶",
    "nav.triumph": "TRIUMPH",
    "nav.settings": "SETTINGS",
    "nav.store": "STORE",
    "quest.title": "CHOOSE YOUR QUEST",
    "quest.school": "1. SCHOOL LIFE",
    "quest.society": "2. SOCIETY LIFE",
    "chapter.school.title": "SCHOOL CHAPTER",
    "chapter.society.title": "SOCIETY CHAPTER",
    "chapter.school.blurb": "Build core judgement skills with relatable cases — theft, cheating, bullying.",
    "chapter.society.blurb": "Confront grey areas — fraud, negligence, public disputes — where impact is broader.",
    "chapter.case": "CASE",
    "settings.title": "SETTINGS",
    "avatar.title": "CHOOSE AVATAR",
    "avatar.equipped": "EQUIPPED",
    "avatar.locked": "Reach Lv {n} to unlock",
    "avatar.current": "Current Lv",
    "avatar.close": "CLOSE",
    "settings.brightness": "BRIGHTNESS",
    "settings.sound": "SOUND",
    "settings.bgm": "MUSIC",
    "settings.on": "ON",
    "settings.off": "OFF",
    "settings.language": "LANGUAGE",
    "settings.terms": "TERMS OF POLICY",
    "settings.feedback": "FEEDBACK",
    "lang.zh": "华文",
    "lang.ms": "B. MELAYU",
    "lang.en": "ENGLISH",
    "store.title": "STORE",
    "triumph.title": "TRIUMPH",
    "triumph.done": "★ DONE",
    "triumph.locked": "✕ LOCKED",
    "case.brief": "CASE BRIEF",
    "case.statements": "STATEMENTS",
    "step.brief": "BRIEF",
    "step.evidence": "EVIDENCE",
    "step.law": "LAW",
    "step.verdict": "VERDICT",
    "step.result": "RESULT",
    "home.coins": "COINS",
    "home.tagline": "A legal education journey matched to Malaysian Law.",
    "tutorial.title": "NEW PLAYER TUTORIAL",
    "tutorial.body":
      "Pick a chapter and solve cases: read the brief, weigh evidence, choose a law category, then deliver a verdict. Correct judgements earn ⭐ coins. Spend coins in the STORE.",
    "tutorial.ok": "GOT IT",
    "daily.title": "DAILY REWARDS",
    "daily.day": "DAY",
    "daily.claim": "CLAIM",
    "daily.claimed": "CLAIMED",
    "daily.come_back": "COME BACK TOMORROW",
    "daily.special": "SPECIAL TOOL",
    "share.title": "INVITE FRIENDS",
    "share.copy": "COPY INVITE LINK",
    "share.copied": "LINK COPIED! +100 COINS",
    "share.already": "REWARD ALREADY CLAIMED",
    "save.title": "CLOUD SAVE",
    "save.now": "SAVE NOW",
    "save.load": "LOAD",
    "save.saved": "PROGRESS SAVED",
    "save.loaded": "PROGRESS LOADED",
    "feedback.title": "FEEDBACK",
    "feedback.placeholder": "Tell us your suggestion…",
    "feedback.send": "SEND",
    "feedback.thanks": "THANK YOU!",
    "settings.inbox": "INBOX",
    "inbox.title": "INBOX",
    "inbox.password": "ENTER PASSWORD",
    "inbox.unlock": "UNLOCK",
    "inbox.wrong": "Wrong password",
    "inbox.empty": "No feedback yet",
    "store.time_ext": "TIME EXTENSION",
    "store.owned": "OWNED",
    "store.buy": "BUY",
    "store.not_enough": "NOT ENOUGH COINS",
    "terms.title": "TERMS & POLICY",
    "terms.tos": "TERMS OF SERVICE",
    "terms.tos_body":
      "Educational purpose only. Fictional characters and scenarios. Not professional legal advice. Content is matched to Malaysian Law for learning.",
    "terms.privacy": "PRIVACY POLICY",
    "terms.privacy_body":
      "We do not collect personal data. Only non-personal gameplay data is stored locally. No data is shared with third parties.",
    "terms.ai": "AI ETHICS",
    "terms.ai_body":
      "AI enhances interactivity to support critical thinking. We acknowledge AI limitations and commit to safe, ethical educational content.",
    "terms.agree": "I AGREE",
    "quiz.title": "LEVEL-UP QUIZ",
    "quiz.promotionTo": "Promotion to",
    "quiz.intro": "Answer 5 legal questions. Score 3 or more to level up. Fail and your current-level XP is reset.",
    "quiz.rule1": "5 questions, single choice.",
    "quiz.rule2": "Pass = 3 correct or more.",
    "quiz.rule3": "Fail keeps your level but resets XP to 0.",
    "quiz.begin": "BEGIN",
    "quiz.question": "Q",
    "quiz.next": "NEXT",
    "quiz.submit": "SUBMIT",
    "quiz.passed": "PASSED — LEVEL UP!",
    "quiz.failed": "FAILED — XP RESET",
    "quiz.score": "Score",
    "quiz.promotedTo": "Promoted to",
    "quiz.xpReset": "Try clearing chapters again to retry.",
    "quiz.done": "CONTINUE",
    "reward.xpGained": "Experience gained",
    "reward.levelProgress": "Level Progress",
    "quiz.ready": "★ Level-up quiz unlocked — return home!",
    "level.details.title": "LEVEL DETAILS",
    "level.next": "Next Level",
    "level.toNext": "XP to next level",
    "level.path": "Promotion Path",
    "level.howToEarn": "How to earn XP",
    "level.howBody": "Complete chapters: each ⭐ earned = 10 XP. Replays count too. Pass the 5-question quiz at each tier to level up — failing keeps your level but resets current XP.",
    "level.challengeNow": "Challenge Quiz Now",
    "level.statusCurrent": "Current",
    "level.statusDone": "Achieved",
    "level.statusLocked": "Locked",
    "level.maxed": "MAX LEVEL",
    "level.sources.title": "XP SOURCES",
    "level.sources.chapter": "First clear",
    "level.sources.replay": "Replay",
    "level.sources.quiz": "Quiz bonus",
    "level.sources.total": "Total",
};

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  volume: number;
  setVolume: (v: number) => void;
  bgmEnabled: boolean;
  setBgmEnabled: (b: boolean) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
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
  dailyClaims: boolean[]; // length 7
  dailyAvailableDay: number; // 1..7, 0 if all claimed today
  claimDailyDay: (day: number) => boolean;
  timeExtensions: number;
  buyTimeExtension: () => boolean;
  inventory: Record<ItemId, number>;
  addItem: (id: ItemId, n?: number) => void;
  useItem: (id: ItemId) => boolean;
  // Session-only: items used per case (slug -> ItemId[]). Per-chapter rules:
  // - one item per chapter total (others auto-locked once any is used)
  // - same item only once per chapter
  usedItemsByCase: Record<string, ItemId[]>;
  armItemForCase: (slug: string, id: ItemId) => boolean;
  getArmedItem: (slug: string) => ItemId | null;
  getUsedItemsForCase: (slug: string) => ItemId[];
  // Per-chapter decision time tracking (session-only)
  recordDecisionTime: (slug: string, seconds: number) => void;
  getXpMultiplierForCase: (slug: string) => { time: number; item: number; total: number };
  // Level / XP system
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  xp: number;
  xpToNext: number;
  pendingQuiz: boolean;
  addXp: (n: number, source?: XpSource) => void;
  resolveQuiz: (passed: boolean) => void;
  xpSources: XpSources;
  avatarId: AvatarId;
  setAvatar: (id: AvatarId) => void;
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
  dailyDate: string; // YYYY-MM-DD of last reset
  timeExtensions: number;
  inventory?: Partial<Record<ItemId, number>>;
};
const DEFAULT_META: Meta = {
  coins: 0,
  agreedTerms: false,
  tutorialSeen: false,
  shareClaimed: false,
  dailyClaims: [false, false, false, false, false, false, false],
  dailyDate: "",
  timeExtensions: 0,
  inventory: {},
};
const todayStr = () => new Date().toISOString().slice(0, 10);
const loadMeta = (): Meta => {
  try {
    const raw = localStorage.getItem(META_LS);
    if (!raw) return { ...DEFAULT_META };
    const m = { ...DEFAULT_META, ...(JSON.parse(raw) as Partial<Meta>) };
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
    return JSON.parse(raw) as { theme?: Theme; volume?: number; lang?: Lang };
    // bgmEnabled is read separately below to keep back-compat
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
  const [bgmEnabled, setBgmEnabledState] = useState<boolean>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LS) : null;
      if (!raw) return true;
      const v = JSON.parse(raw) as { bgmEnabled?: boolean };
      return v.bgmEnabled !== false;
    } catch {
      return true;
    }
  });
  const lang: Lang = "en";
  const setLangState = (_l: Lang) => {};
  const [meta, setMeta] = useState<Meta>(() => (typeof window !== "undefined" ? loadMeta() : { ...DEFAULT_META }));
  const [levelState, setLevelState] = useState<LevelState>(() =>
    typeof window !== "undefined" ? loadLevel() : { level: 1, xp: 0, pendingQuiz: false },
  );
  const [xpSources, setXpSources] = useState<XpSources>(() =>
    typeof window !== "undefined" ? loadXpSources() : { ...DEFAULT_XP_SOURCES },
  );
  const [avatarId, setAvatarIdState] = useState<AvatarId>(() =>
    typeof window !== "undefined" ? loadAvatar() : "rookie",
  );
  // Session-only: which item has been armed for which case (slug -> ItemId).
  // Not persisted by design: "one item per case, one item per play".
  const [usedItemsByCase, setUsedItemsByCase] = useState<Record<string, ItemId[]>>({});
  const armItemForCase = useCallback(
    (slug: string, id: ItemId) => {
      const usedHere = usedItemsByCase[slug] ?? [];
      // one item per chapter total; same item only once per chapter
      if (usedHere.length > 0) return false;
      let ok = false;
      setMeta((m) => {
        if (id === "timeExt") {
          if (m.timeExtensions <= 0) return m;
          ok = true;
          return { ...m, timeExtensions: m.timeExtensions - 1 };
        }
        const inv = { ...(m.inventory ?? {}) };
        const cur = inv[id] ?? 0;
        if (cur <= 0) return m;
        ok = true;
        inv[id] = cur - 1;
        return { ...m, inventory: inv };
      });
      if (ok) setUsedItemsByCase((u) => ({ ...u, [slug]: [...(u[slug] ?? []), id] }));
      return ok;
    },
    [usedItemsByCase],
  );
  const getArmedItem = useCallback(
    (slug: string) => usedItemsByCase[slug]?.[0] ?? null,
    [usedItemsByCase],
  );
  const getUsedItemsForCase = useCallback(
    (slug: string) => usedItemsByCase[slug] ?? [],
    [usedItemsByCase],
  );
  const setAvatar = useCallback((id: AvatarId) => {
    setAvatarIdState(id);
    saveAvatar(id);
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify({ theme, volume, lang, bgmEnabled }));
    } catch {}
  }, [theme, volume, lang, bgmEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(META_LS, JSON.stringify(meta));
    } catch {}
  }, [meta]);

  useEffect(() => {
    saveLevel(levelState);
  }, [levelState]);

  useEffect(() => {
    saveXpSources(xpSources);
  }, [xpSources]);

  // Apply theme class to <html>
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
        const AC =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current!;
      if (ctx.state === "suspended") ctx.resume();
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

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setVolume = useCallback((v: number) => setVolumeState(Math.min(100, Math.max(0, v))), []);
  const setBgmEnabled = useCallback((b: boolean) => setBgmEnabledState(b), []);
  const setLang = useCallback((_l: Lang) => {}, []);

  const t = useCallback((key: string) => DICT[key] ?? key, []);

  const addCoins = useCallback((n: number) => {
    setMeta((m) => ({ ...m, coins: Math.max(0, m.coins + n) }));
  }, []);
  const spendCoins = useCallback((n: number) => {
    let ok = false;
    setMeta((m) => {
      if (m.coins < n) return m;
      ok = true;
      return { ...m, coins: m.coins - n };
    });
    return ok;
  }, []);
  const acceptTerms = useCallback(() => setMeta((m) => ({ ...m, agreedTerms: true })), []);
  const markTutorialSeen = useCallback(() => setMeta((m) => ({ ...m, tutorialSeen: true })), []);
  const claimShare = useCallback(() => {
    setMeta((m) => (m.shareClaimed ? m : { ...m, shareClaimed: true, coins: m.coins + 100 }));
  }, []);

  // Daily reset: if dailyDate differs from today, reset claims for next day eligibility.
  // Logic: dailyClaims[i] true == claimed. The "available day" is the lowest unclaimed index+1.
  // We only allow claiming once per real day (track via dailyDate).
  const claimDailyDay = useCallback((day: number) => {
    let ok = false;
    setMeta((m) => {
      const idx = day - 1;
      if (idx < 0 || idx > 6) return m;
      if (m.dailyClaims[idx]) return m;
      // must be the next available day
      const nextIdx = m.dailyClaims.findIndex((c) => !c);
      if (nextIdx !== idx) return m;
      // one claim per day
      const today = todayStr();
      if (m.dailyDate === today) return m;
      const newClaims = [...m.dailyClaims];
      newClaims[idx] = true;
      const reward = day === 7 ? 0 : Math.round(25 * day); // -50% from previous; day 7 = special tool
      const extras = day === 7 ? 1 : 0;
      ok = true;
      // If all 7 claimed, cycle resets next day
      const allDone = newClaims.every((c) => c);
      return {
        ...m,
        dailyClaims: allDone ? [...DEFAULT_META.dailyClaims] : newClaims,
        dailyDate: today,
        coins: m.coins + reward,
        timeExtensions: m.timeExtensions + extras,
      };
    });
    return ok;
  }, []);

  const buyTimeExtension = useCallback(() => {
    let ok = false;
    setMeta((m) => {
      if (m.coins < 150) return m;
      ok = true;
      return { ...m, coins: m.coins - 150, timeExtensions: m.timeExtensions + 1 };
    });
    return ok;
  }, []);

  const addItem = useCallback((id: ItemId, n: number = 1) => {
    if (id === "timeExt") {
      setMeta((m) => ({ ...m, timeExtensions: m.timeExtensions + n }));
      return;
    }
    setMeta((m) => {
      const inv = { ...(m.inventory ?? {}) };
      inv[id] = (inv[id] ?? 0) + n;
      return { ...m, inventory: inv };
    });
  }, []);

  const useItem = useCallback((id: ItemId) => {
    let ok = false;
    setMeta((m) => {
      if (id === "timeExt") {
        if (m.timeExtensions <= 0) return m;
        ok = true;
        return { ...m, timeExtensions: m.timeExtensions - 1 };
      }
      const inv = { ...(m.inventory ?? {}) };
      const cur = inv[id] ?? 0;
      if (cur <= 0) return m;
      ok = true;
      inv[id] = cur - 1;
      return { ...m, inventory: inv };
    });
    return ok;
  }, []);

  const addXp = useCallback((n: number, source: XpSource = "chapter") => {
    if (n <= 0) return;
    setLevelState((s) => applyXp(s, n));
    setXpSources((s) => ({ ...s, [source]: s[source] + n }));
  }, []);
  const resolveQuiz = useCallback((passed: boolean) => {
    setLevelState((s) => resolveLevelQuiz(s, passed));
    if (passed) {
      // Quiz pass bonus — recorded as quiz source.
      setLevelState((s) => applyXp(s, 20));
      setXpSources((s) => ({ ...s, quiz: s.quiz + 20 }));
    }
  }, []);

  const dailyAvailableDay = (() => {
    if (meta.dailyDate === todayStr()) return 0;
    const idx = meta.dailyClaims.findIndex((c) => !c);
    return idx < 0 ? 0 : idx + 1;
  })();

  // Build a stable inventory map (always includes all ids).
  const inventory: Record<ItemId, number> = useMemo(() => {
    const inv = (meta.inventory ?? {}) as Partial<Record<ItemId, number>>;
    return {
      gavel: inv.gavel ?? 0,
      book: inv.book ?? 0,
      badge: inv.badge ?? 0,
      scroll: inv.scroll ?? 0,
      scales: inv.scales ?? 0,
      robe: inv.robe ?? 0,
      timeExt: meta.timeExtensions,
    };
  }, [meta.inventory, meta.timeExtensions]);

  // Trigger throttled autosave whenever persisted state changes.
  useEffect(() => {
    scheduleAutoSave();
  }, [meta, levelState, xpSources, avatarId, theme, volume, bgmEnabled]);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,
      volume,
      setVolume,
      bgmEnabled,
      setBgmEnabled,
      lang,
      setLang,
      t,
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
      inventory,
      addItem,
      useItem,
      usedItemsByCase,
      armItemForCase,
      getArmedItem,
      getUsedItemsForCase,
      level: levelState.level,
      levelName: LEVEL_NAMES[levelState.level],
      xp: levelState.xp,
      xpToNext: xpNeeded(levelState.level),
      pendingQuiz: levelState.pendingQuiz,
      addXp,
      resolveQuiz,
      xpSources,
      avatarId,
      setAvatar,
    }),
    [
      theme,
      setTheme,
      volume,
      setVolume,
      bgmEnabled,
      setBgmEnabled,
      lang,
      setLang,
      t,
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
      inventory,
      addItem,
      useItem,
      usedItemsByCase,
      armItemForCase,
      getArmedItem,
      getUsedItemsForCase,
      levelState,
      addXp,
      resolveQuiz,
      xpSources,
      avatarId,
      setAvatar,
    ],
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
};

export const useSettings = () => {
  const v = useContext(SettingsCtx);
  if (!v) throw new Error("useSettings must be used inside <SettingsProvider>");
  return v;
};
