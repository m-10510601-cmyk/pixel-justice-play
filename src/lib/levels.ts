// Level / XP system. Levels 1..5. Each level has an XP threshold to advance.
// On reaching threshold, a pending quiz is queued; level only advances after passing.
// Failing the quiz keeps the level but resets the current-level XP to 0.

const KEY = "lawguardian.level.v1";

export type LevelState = {
  level: 1 | 2 | 3 | 4 | 5;
  xp: number; // XP accumulated within current level
  pendingQuiz: boolean;
};

export const LEVEL_NAMES: Record<number, string> = {
  1: "LAW APPRENTICE",
  2: "STUDENT INVESTIGATOR",
  3: "JUNIOR JUDGE",
  4: "COURT SPECIALIST",
  5: "CHIEF JUSTICE",
};

// Index = current level. Value = XP needed to advance to next level.
// Level 5 is max → no threshold.
export const XP_THRESHOLDS: Record<number, number> = {
  1: 50,
  2: 120,
  3: 220,
  4: 360,
};

export const DEFAULT_LEVEL_STATE: LevelState = { level: 1, xp: 0, pendingQuiz: false };

export const loadLevel = (): LevelState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_LEVEL_STATE };
    const v = JSON.parse(raw) as Partial<LevelState>;
    const lvl = (v.level && v.level >= 1 && v.level <= 5 ? v.level : 1) as LevelState["level"];
    return {
      level: lvl,
      xp: typeof v.xp === "number" ? Math.max(0, v.xp) : 0,
      pendingQuiz: !!v.pendingQuiz,
    };
  } catch {
    return { ...DEFAULT_LEVEL_STATE };
  }
};

export const saveLevel = (s: LevelState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
};

export const xpToNext = (level: number): number => XP_THRESHOLDS[level] ?? 0;

export const isMaxLevel = (level: number) => level >= 5;

/** Apply XP gain. Returns new state. Triggers pendingQuiz when threshold reached. */
export const applyXp = (s: LevelState, gain: number): LevelState => {
  if (gain <= 0 || isMaxLevel(s.level) || s.pendingQuiz) return s;
  const need = xpToNext(s.level);
  const newXp = s.xp + gain;
  if (newXp >= need) {
    return { ...s, xp: newXp, pendingQuiz: true };
  }
  return { ...s, xp: newXp };
};

/** Resolve a queued quiz. passed=true → level up (carry overflow XP). passed=false → reset XP. */
export const resolveQuiz = (s: LevelState, passed: boolean): LevelState => {
  if (!s.pendingQuiz) return s;
  if (passed && !isMaxLevel(s.level)) {
    const need = xpToNext(s.level);
    const overflow = Math.max(0, s.xp - need);
    const nextLevel = (s.level + 1) as LevelState["level"];
    return { level: nextLevel, xp: isMaxLevel(nextLevel) ? 0 : overflow, pendingQuiz: false };
  }
  return { ...s, xp: 0, pendingQuiz: false };
};