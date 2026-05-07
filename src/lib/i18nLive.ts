import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/game/SettingsContext";

// Live translation cache keyed by `${lang}::${text}`. English passes through.
const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();
const subscribers = new Set<() => void>();

const LS_KEY = "lawguardian.i18nLive.v1";
let loaded = false;
const loadPersisted = () => {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(obj)) cache.set(k, v);
    }
  } catch {}
};
let saveTimer: number | null = null;
const schedulePersist = () => {
  if (typeof window === "undefined") return;
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      const obj: Record<string, string> = {};
      // keep cache bounded
      let count = 0;
      for (const [k, v] of cache.entries()) {
        obj[k] = v;
        if (++count > 4000) break;
      }
      localStorage.setItem(LS_KEY, JSON.stringify(obj));
    } catch {}
  }, 500);
};

const notify = () => subscribers.forEach((fn) => fn());

// Batch queue
type Job = { text: string; lang: Lang; resolve: (s: string) => void };
const queues: Record<Lang, Job[]> = { en: [], zh: [], ms: [] };
const flushTimers: Partial<Record<Lang, number>> = {};
const BATCH_SIZE = 25;
const BATCH_DELAY = 60;

const flush = async (lang: Lang) => {
  flushTimers[lang] = undefined;
  const jobs = queues[lang].splice(0, queues[lang].length);
  if (!jobs.length) return;
  // de-duplicate
  const uniqueTexts: string[] = [];
  const indexMap = new Map<string, number>();
  for (const j of jobs) {
    if (!indexMap.has(j.text)) {
      indexMap.set(j.text, uniqueTexts.length);
      uniqueTexts.push(j.text);
    }
  }
  // chunk
  for (let start = 0; start < uniqueTexts.length; start += BATCH_SIZE) {
    const chunk = uniqueTexts.slice(start, start + BATCH_SIZE);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { texts: chunk, target: lang },
      });
      if (error) throw error;
      const translations: string[] = (data as any)?.translations ?? chunk;
      chunk.forEach((src, idx) => {
        const out = translations[idx] ?? src;
        cache.set(`${lang}::${src}`, out);
      });
    } catch {
      chunk.forEach((src) => cache.set(`${lang}::${src}`, src));
    }
  }
  // resolve all jobs
  jobs.forEach((j) => {
    const out = cache.get(`${j.lang}::${j.text}`) ?? j.text;
    j.resolve(out);
  });
  schedulePersist();
  notify();
};

const enqueue = (text: string, lang: Lang): Promise<string> => {
  const key = `${lang}::${text}`;
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = new Promise<string>((resolve) => {
    queues[lang].push({ text, lang, resolve });
    if (!flushTimers[lang]) {
      flushTimers[lang] = window.setTimeout(() => flush(lang), BATCH_DELAY) as unknown as number;
    }
  }).finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
};

export const translateText = (text: string, lang: Lang): string => {
  loadPersisted();
  if (!text || lang === "en") return text;
  const key = `${lang}::${text}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  // Heuristic skip: very short pure punctuation or numbers
  if (/^[\s\d\W]+$/.test(text)) {
    cache.set(key, text);
    return text;
  }
  enqueue(text, lang);
  return text; // fallback to source until translation arrives
};

export const useLiveTranslate = (text: string | undefined, lang: Lang): string => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subscribers.add(fn);
    return () => { subscribers.delete(fn); };
  }, []);
  return text ? translateText(text, lang) : (text ?? "");
};
