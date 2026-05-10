// store/useYearSearchStore.ts
import { create } from 'zustand';

interface YearSearchState {
  yearInput: string;
  sortOrder: string;
  currentPage: number;
  movies: any[];
  hasLoadedOnce: boolean;
  setSearch: (data: Partial<YearSearchState>) => void;
  clearSearch: () => void;
}

export const useYearSearchStore = create<YearSearchState>((set) => ({
  yearInput: '',
  sortOrder: 'asc',
  currentPage: 1,
  movies: [],
  hasLoadedOnce: false,
  setSearch: (data) => set((state) => ({ ...state, ...data })),
  clearSearch: () => set({
    yearInput: '',
    sortOrder: 'asc',
    currentPage: 1,
    movies: [],
    hasLoadedOnce: false,
  }),
}));