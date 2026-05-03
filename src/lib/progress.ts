// Lightweight per-story progress persistence.
// Saves the current step index and answer choices keyed by story slug,
// plus a "last played" pointer so the home screen can offer Continue.

const PROGRESS_PREFIX = "lawguardian.progress.v1.";
const LAST_KEY = "lawguardian.lastPlayed.v1";

export type StoryProgress = {
  i: number;
  answers: Record<string, string>;
  total: number;
  updatedAt: number;
};

export type LastPlayed = {
  slug: string;
  title: string;
  route: string;
  i: number;
  total: number;
  updatedAt: number;
};

const key = (slug: string) => PROGRESS_PREFIX + slug;

export const loadProgress = (slug: string): StoryProgress | null => {
  try {
    const raw = localStorage.getItem(key(slug));
    if (!raw) return null;
    return JSON.parse(raw) as StoryProgress;
  } catch {
    return null;
  }
};

export const saveProgress = (slug: string, data: StoryProgress) => {
  try {
    localStorage.setItem(key(slug), JSON.stringify(data));
  } catch {}
};

export const clearProgress = (slug: string) => {
  try {
    localStorage.removeItem(key(slug));
    const last = getLastPlayed();
    if (last?.slug === slug) localStorage.removeItem(LAST_KEY);
  } catch {}
};

export const setLastPlayed = (entry: LastPlayed) => {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(entry));
  } catch {}
};

export const getLastPlayed = (): LastPlayed | null => {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastPlayed;
  } catch {
    return null;
  }
};