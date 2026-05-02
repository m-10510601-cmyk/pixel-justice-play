import type { Lang } from "@/game/SettingsContext";

export type LocStr = { en: string; zh: string; ms: string };
export const L = (lang: Lang, s: LocStr | string) =>
  typeof s === "string" ? s : (s[lang] ?? s.en);

export type LegalCategory = {
  id: string;
  label: LocStr;
  correct?: boolean;
  rationale: LocStr;
};

export type Evidence = {
  id: string;
  icon: string;
  title: LocStr;
  summary: LocStr;
  detail: LocStr;
  reliable: boolean;
};

export type Verdict = { id: "guilty" | "not_guilty"; label: LocStr };
export type Punishment = { id: string; label: LocStr };

export type CaseData = {
  id: string;
  chapter: "school" | "society";
  title: LocStr;
  brief: LocStr;
  image?: string;
  statements: { speaker: LocStr; quote: LocStr }[];
  evidence: Evidence[];
  categories: LegalCategory[];
  punishments: Punishment[];
  correctVerdict: Verdict["id"];
  realWorldNote: LocStr;
  standardOfProof: LocStr;
};

export const CASES: CaseData[] = [];

export const getCase = (id: string) => CASES.find((c) => c.id === id);
export const casesByChapter = (chapter: "school" | "society") =>
  CASES.filter((c) => c.chapter === chapter);
