import { create } from "zustand";

type State = {
  selectedEvidence: Record<string, string[]>;
  selectedCategory: Record<string, string>;
  verdict: Record<string, "guilty" | "not_guilty">;
  punishment: Record<string, string>;
  setSelectedEvidence: (caseId: string, ids: string[]) => void;
  setCategory: (caseId: string, id: string) => void;
  setVerdict: (caseId: string, v: "guilty" | "not_guilty") => void;
  setPunishment: (caseId: string, id: string) => void;
};

export const useCaseStore = create<State>((set) => ({
  selectedEvidence: {},
  selectedCategory: {},
  verdict: {},
  punishment: {},
  setSelectedEvidence: (caseId, ids) =>
    set((s) => ({ selectedEvidence: { ...s.selectedEvidence, [caseId]: ids } })),
  setCategory: (caseId, id) =>
    set((s) => ({ selectedCategory: { ...s.selectedCategory, [caseId]: id } })),
  setVerdict: (caseId, v) => set((s) => ({ verdict: { ...s.verdict, [caseId]: v } })),
  setPunishment: (caseId, id) =>
    set((s) => ({ punishment: { ...s.punishment, [caseId]: id } })),
}));