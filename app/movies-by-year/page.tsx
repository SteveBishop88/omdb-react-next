'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useYearSearchStore } from '@/app/store/useYearSearchStore';

export default function MoviesByYear() {
  // 1. SELECTORS (This is the only way we define these variables now)
  const movies = useYearSearchStore((state) => state.movies);
  const yearInput = useYearSearchStore((state) => state.yearInput);
  const sortOrder = useYearSearchStore((state) => state.sortOrder);
  const currentPage = useYearSearchStore((state) => state.currentPage);
  const hasLoadedOnce = useYearSearchStore((state) => state.hasLoadedOnce);
  const setSearch = useYearSearchStore((state) => state.setSearch);
  const clearSearch = useYearSearchStore((state) => state.clearSearch);

  // 2. LOCAL STATE
  const [isLoading, setIsLoading] = useState(false);

  // 3. LOGIC
  async function fetchMovies(page = 1) {
    console.log("Fetch Button Clicked! Year is:", yearInput);

    if (!yearInput) {
      alert('Please enter a year.');
      return;
    }

    setIsLoading(true);
    setSearch({ currentPage: page });

    try {
      const res = await fetch(`/api/year/${yearInput}?page=${page}&sort=${sortOrder}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setSearch({ movies: data, hasLoadedOnce: true });
    } catch (error) {
      console.error('Error fetching movies:', error);
      setSearch({ movies: [] });
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setSearch({ [field]: value });
  };

  const parseGenres = (genreString: string) => {
    try { return JSON.parse(genreString); } catch { return []; }
  };

  return (
    <div className="max-w-[1100px] mx-auto my-10 bg-white p-8 rounded-xl shadow-lg font-sans">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <Link href="/" className="text-slate-500 text-sm font-medium hover:text-blue-600 w-[120px]">
          ← Main Menu
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center flex-grow">Movies by Year</h1>
        <div className="w-[120px]"></div>
      </header>

      <div className="flex flex-wrap gap-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-sm text-slate-600">Enter Year:</label>
          <input 
            value={yearInput}
            onChange={(e) => handleInputChange('yearInput', e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && fetchMovies(1)}
            type="number" 
            placeholder="e.g., 1995"
            className="p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-sm text-slate-600">Sort Order:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => handleInputChange('sortOrder', e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white outline-none focus:border-blue-600"
          >
            <option value="asc">Ascending (Oldest First)</option>
            <option value="desc">Descending (Newest First)</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => fetchMovies(1)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all">
            Load Movies
          </button>
          <button onClick={clearSearch} className="bg-transparent text-slate-500 px-6 py-2 border border-slate-200 rounded-lg font-semibold hover:bg-slate-100 transition-all">
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
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
                  {hasLoadedOnce ? 'No movies found for this year.' : 'Please enter a year and click "Load Movies".'}
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
                      <span key={genre.id} className="inline-block bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-full text-[10px] font-bold uppercase mr-1 mb-1">
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
          <button 
            disabled={currentPage === 1} 
            onClick={() => fetchMovies(currentPage - 1)}
            className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-30"
          >
            Previous
          </button>
          <span className="font-bold text-slate-800">Page {currentPage}</span>
          <button 
            onClick={() => fetchMovies(currentPage + 1)}
            className="px-4 py-2 bg-slate-200 rounded-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}