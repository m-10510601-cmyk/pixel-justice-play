import { useEffect, useRef } from "react";
import {
  clearProgress,
  loadProgress,
  saveProgress,
  setLastPlayed,
} from "@/lib/progress";

type Args = {
  slug: string;
  title: string;
  route: string;
  i: number;
  setI: (n: number) => void;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  total: number;
  done: boolean;
};

/**
 * Persists a story's step + answers to localStorage and restores them on mount.
 * Also updates a global "last played" pointer used by the home screen.
 */
export function useStoryProgress({
  slug, title, route, i, setI, answers, setAnswers, total, done,
}: Args) {
  const restored = useRef(false);

  // Restore once on mount
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = loadProgress(slug);
    if (saved && saved.i > 0 && saved.i < total) {
      setI(saved.i);
      setAnswers(saved.answers ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Save on change
  useEffect(() => {
    if (!restored.current) return;
    if (done) {
      clearProgress(slug);
      return;
    }
    if (i <= 0 && Object.keys(answers).length === 0) return;
    const updatedAt = Date.now();
    saveProgress(slug, { i, answers, total, updatedAt });
    setLastPlayed({ slug, title, route, i, total, updatedAt });
  }, [i, answers, done, slug, title, route, total]);
}