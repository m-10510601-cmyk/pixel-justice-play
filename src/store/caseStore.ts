import { useSyncExternalStore } from "react";

type Verdict = "guilty" | "not_guilty";
type State = {
  selectedEvidence: Record<string, string[]>;
  selectedCategory: Record<string, string>;
  verdict: Record<string, Verdict>;
  punishment: Record<string, string>;
};

let state: State = {
  selectedEvidence: {},
  selectedCategory: {},
  verdict: {},
  punishment: {},
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export const useCaseState = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const caseActions = {
  setSelectedEvidence(caseId: string, ids: string[]) {
    state = { ...state, selectedEvidence: { ...state.selectedEvidence, [caseId]: ids } };
    emit();
  },
  setCategory(caseId: string, id: string) {
    state = { ...state, selectedCategory: { ...state.selectedCategory, [caseId]: id } };
    emit();
  },
  setVerdict(caseId: string, v: Verdict) {
    state = { ...state, verdict: { ...state.verdict, [caseId]: v } };
    emit();
  },
  setPunishment(caseId: string, id: string) {
    state = { ...state, punishment: { ...state.punishment, [caseId]: id } };
    emit();
  },
};