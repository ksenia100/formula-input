import { create } from 'zustand';

interface State {
  formula: string;
  setFormula: (newFormula: string) => void;
}

export const useFormulaInput = create<State>((set) => ({
  formula: '',
  setFormula: (newFormula: string) => set({ formula: newFormula }),
}));