import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback, useRef } from "react";

export type Theme = "light" | "dark" | "default";
export type Lang = "en" | "zh" | "ms";

type Dict = Record<string, string>;
const DICT: Record<Lang, Dict> = {
  en: {
    "app.title": "LAW GUARDIAN",
    "app.tagline": "Defend justice across school halls and city streets. Solve cases, learn the law, become a true Law Guardian.",
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
    "settings.brightness": "BRIGHTNESS",
    "settings.sound": "SOUND",
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
  },
  zh: {
    "app.title": "正义守护者",
    "app.tagline": "在校园与城市间捍卫正义。审理案件、学习法律，成为真正的正义守护者。",
    "btn.start": "▶ 开始",
    "btn.back": "←",
    "btn.next": "下一步 ▶",
    "nav.triumph": "成就",
    "nav.settings": "设置",
    "nav.store": "商店",
    "quest.title": "选择任务",
    "quest.school": "1. 校园生活",
    "quest.society": "2. 社会生活",
    "chapter.school.title": "校园篇章",
    "chapter.society.title": "社会篇章",
    "chapter.school.blurb": "通过盗窃、作弊、霸凌等贴近生活的案件，培养基础判断能力。",
    "chapter.society.blurb": "面对欺诈、过失与公共纠纷等灰色地带，影响更为广泛。",
    "chapter.case": "案件",
    "settings.title": "设置",
    "settings.brightness": "亮度",
    "settings.sound": "音量",
    "settings.language": "语言",
    "settings.terms": "服务条款",
    "settings.feedback": "反馈",
    "lang.zh": "华文",
    "lang.ms": "B. MELAYU",
    "lang.en": "ENGLISH",
    "store.title": "商店",
    "triumph.title": "成就",
    "triumph.done": "★ 已完成",
    "triumph.locked": "✕ 未解锁",
    "case.brief": "案件简介",
    "case.statements": "陈述",
    "step.brief": "简介",
    "step.evidence": "证据",
    "step.law": "法律",
    "step.verdict": "判决",
    "step.result": "结果",
  },
  ms: {
    "app.title": "PENJAGA UNDANG-UNDANG",
    "app.tagline": "Pertahankan keadilan di sekolah dan jalanan kota. Selesaikan kes, pelajari undang-undang, jadilah Penjaga sejati.",
    "btn.start": "▶ MULA",
    "btn.back": "←",
    "btn.next": "SETERUSNYA ▶",
    "nav.triumph": "KEMENANGAN",
    "nav.settings": "TETAPAN",
    "nav.store": "KEDAI",
    "quest.title": "PILIH MISI ANDA",
    "quest.school": "1. KEHIDUPAN SEKOLAH",
    "quest.society": "2. KEHIDUPAN MASYARAKAT",
    "chapter.school.title": "BAB SEKOLAH",
    "chapter.society.title": "BAB MASYARAKAT",
    "chapter.school.blurb": "Bina kemahiran asas penghakiman melalui kes — kecurian, peniruan, buli.",
    "chapter.society.blurb": "Hadapi kawasan kelabu — penipuan, kecuaian, pertikaian awam — dengan impak lebih luas.",
    "chapter.case": "KES",
    "settings.title": "TETAPAN",
    "settings.brightness": "KECERAHAN",
    "settings.sound": "BUNYI",
    "settings.language": "BAHASA",
    "settings.terms": "TERMA POLISI",
    "settings.feedback": "MAKLUM BALAS",
    "lang.zh": "华文",
    "lang.ms": "B. MELAYU",
    "lang.en": "ENGLISH",
    "store.title": "KEDAI",
    "triumph.title": "KEMENANGAN",
    "triumph.done": "★ SELESAI",
    "triumph.locked": "✕ TERKUNCI",
    "case.brief": "RINGKASAN KES",
    "case.statements": "KENYATAAN",
    "step.brief": "RINGKASAN",
    "step.evidence": "BUKTI",
    "step.law": "UNDANG",
    "step.verdict": "KEPUTUSAN",
    "step.result": "HASIL",
  },
};

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  volume: number;
  setVolume: (v: number) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  playCue: () => void;
}

const SettingsCtx = createContext<Ctx | null>(null);

const LS = "lawguardian.settings.v1";

const load = () => {
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return null;
    return JSON.parse(raw) as { theme?: Theme; volume?: number; lang?: Lang };
  } catch {
    return null;
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const initial = typeof window !== "undefined" ? load() : null;
  const [theme, setThemeState] = useState<Theme>(initial?.theme ?? "default");
  const [volume, setVolumeState] = useState<number>(
    typeof initial?.volume === "number" ? Math.min(100, Math.max(0, initial.volume)) : 70
  );
  const [lang, setLangState] = useState<Lang>(initial?.lang ?? "en");

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify({ theme, volume, lang }));
    } catch {}
  }, [theme, volume, lang]);

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
        const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
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
  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback((key: string) => DICT[lang][key] ?? DICT.en[key] ?? key, [lang]);

  const value = useMemo<Ctx>(
    () => ({ theme, setTheme, volume, setVolume, lang, setLang, t, playCue }),
    [theme, setTheme, volume, setVolume, lang, setLang, t, playCue]
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
};

export const useSettings = () => {
  const v = useContext(SettingsCtx);
  if (!v) throw new Error("useSettings must be used inside <SettingsProvider>");
  return v;
};
