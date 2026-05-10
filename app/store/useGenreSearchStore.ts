import { create } from 'zustand';

// List of genres from your dataset
const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", 
  "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"
];

interface GenreState {
  selectedGenre: string;
  movies: any[];
  currentPage: number;
  hasLoadedOnce: boolean;
  availableGenres: string[];
  setSearch: (data: Partial<GenreState>) => void;
  clearSearch: () => void;
}

export const useGenreSearchStore = create<GenreState>((set) => ({
  selectedGenre: '',
  movies: [],
  currentPage: 1,
  hasLoadedOnce: false,
  availableGenres: GENRES,
  setSearch: (data) => set((state) => ({ ...state, ...data })),
  clearSearch: () => set({
    selectedGenre: '',
    movies: [],
    currentPage: 1,
    hasLoadedOnce: false,
  }),
}));