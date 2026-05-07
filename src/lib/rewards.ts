// Per-chapter star rewards. Highest-score persisted; replays only pay the delta.

const KEY = "lawguardian.rewards.v1";

type Choice = { id: string; best?: boolean };
type AnyStep = { kind: string; key?: string; options?: Choice[] };

export type EndingTier = "green" | "yellow" | "red";

export type StarBreakdown = {
  base: number;
  bestCount: number;
  totalChoices: number;
  perfectBonus: number;
  total: number;
};

export const computeStars = (
  story: AnyStep[],
  answers: Record<string, string>,
  ending: EndingTier
): StarBreakdown => {
  const base = ending === "green" ? 3 : ending === "yellow" ? 2 : 1;
  const choices = story.filter((s) => s.kind === "choice" && s.options && s.key);
  let bestCount = 0;
  for (const c of choices) {
    const picked = answers[c.key as string];
    if (!picked) continue;
    const opt = c.options!.find((o) => o.id === picked);
    if (opt?.best) bestCount += 1;
  }
  const totalChoices = choices.length;
  const perfectBonus = totalChoices > 0 && bestCount === totalChoices ? 2 : 0;
  return { base, bestCount, totalChoices, perfectBonus, total: base + bestCount + perfectBonus };
};

const readStore = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
};

const writeStore = (s: Record<string, number>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
};

export type ClaimResult = {
  delta: number;
  earned: number;
  previousBest: number;
  isImprovement: boolean;
  firstTime: boolean;
};

export const claimChapterReward = (
  slug: string,
  stars: number,
  addCoins: (n: number) => void
): ClaimResult => {
  const store = readStore();
  const prev = store[slug] ?? 0;
  if (stars > prev) {
    const delta = stars - prev;
    addCoins(delta);
    store[slug] = stars;
    writeStore(store);
    return { delta, earned: stars, previousBest: prev, isImprovement: true, firstTime: prev === 0 };
  }
  return { delta: 0, earned: prev, previousBest: prev, isImprovement: false, firstTime: false };
};

export const getChapterBest = (slug: string): number => readStore()[slug] ?? 0;
