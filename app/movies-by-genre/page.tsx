'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGenreSearchStore } from '@/app/store/useGenreSearchStore';

export default function MoviesByGenre() {
  const movies = useGenreSearchStore((state) => state.movies);
  const selectedGenre = useGenreSearchStore((state) => state.selectedGenre);
  const availableGenres = useGenreSearchStore((state) => state.availableGenres);
  const currentPage = useGenreSearchStore((state) => state.currentPage);
  const hasLoadedOnce = useGenreSearchStore((state) => state.hasLoadedOnce);
  const setSearch = useGenreSearchStore((state) => state.setSearch);
  const clearSearch = useGenreSearchStore((state) => state.clearSearch);

  const [isLoading, setIsLoading] = useState(false);

  async function fetchMovies(page = 1) {
    if (!selectedGenre) {
      alert('Please select a genre.');
      return;
    }

    setIsLoading(true);
    setSearch({ currentPage: page });

    try {
      const res = await fetch(`/api/genre/${encodeURIComponent(selectedGenre)}?page=${page}`);
      const data = await res.json();
      setSearch({ movies: data, hasLoadedOnce: true });
    } catch (error) {
      setSearch({ movies: [] });
    } finally {
      setIsLoading(false);
    }
  }

  const parseGenres = (str: string) => {
    try { return JSON.parse(str); } catch { return []; }
  };

  return (
    <div className="max-w-[1100px] mx-auto my-10 bg-white p-8 rounded-xl shadow-lg font-sans">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <Link href="/" className="text-slate-500 text-sm font-medium hover:text-blue-600 w-[120px]">
          ← Main Menu
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 text-center flex-grow">Movies by Genre</h1>
        <div className="w-[120px]"></div>
      </header>

      <div className="flex flex-wrap gap-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 items-center justify-center">
        <label className="font-semibold text-sm text-slate-600">Select Genre:</label>
        <select 
          value={selectedGenre} 
          onChange={(e) => setSearch({ selectedGenre: e.target.value })}
          className="p-2 border border-slate-300 rounded-lg bg-white outline-none focus:border-blue-600"
        >
          <option value="" disabled>-- Select a Genre --</option>
          {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        
        <div className="flex gap-2">
          <button onClick={() => fetchMovies(1)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
            Load Movies
          </button>
          <button onClick={clearSearch} className="bg-transparent text-slate-500 px-6 py-2 border border-slate-200 rounded-lg font-semibold hover:bg-slate-100">
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <th className="p-4 text-left rounded-tl-lg">IMDb ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Genres</th>
              <th className="p-4 text-left">Release Date</th>
              <th className="p-4 text-left rounded-tr-lg">Budget</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center p-10 font-medium">Loading movies...</td></tr>
            ) : movies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-10 text-slate-400">
                  {hasLoadedOnce ? 'No movies found for this genre.' : 'Please select a genre.'}
                </td>
              </tr>
            ) : (
              movies.map((movie: any) => (
                <tr key={movie.imdbId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 border-b border-slate-100">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm text-slate-600">{movie.imdbId}</span>
                  </td>
                  <td className="p-4 border-b border-slate-100">
                    <Link href={`/movie-detail/${movie.movieId || movie.imdbId}`} className="text-blue-600 font-semibold hover:underline">
                      {movie.title}
                    </Link>
                  </td>
                  <td className="p-4 border-b border-slate-100">
                    {parseGenres(movie.genres).map((genre: any) => (
                      <span key={genre.name} className="inline-block bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-full text-[10px] font-bold uppercase mr-1 mb-1">
                        {genre.name}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 border-b border-slate-100 whitespace-nowrap text-sm">{movie.releaseDate}</td>
                  <td className="p-4 border-b border-slate-100 whitespace-nowrap text-sm">{movie.budget}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {movies.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button disabled={currentPage === 1} onClick={() => fetchMovies(currentPage - 1)} className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-30">Previous</button>
          <span className="font-bold text-slate-800">Page {currentPage}</span>
          <button onClick={() => fetchMovies(currentPage + 1)} className="px-4 py-2 bg-slate-200 rounded-lg">Next</button>
        </div>
      )}
    </div>
  );
}