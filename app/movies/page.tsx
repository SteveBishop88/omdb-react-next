'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Movie {
  movieId: string;
  imdbId: string;
  title: string;
  genres: string;
  releaseDate: string;
  budget: string;
}

export default function MovieLibrary() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetching logic equivalent to Nuxt's useFetch
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/movies?page=${page}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]); // Re-runs whenever 'page' changes

  const formatBudget = (budget: string) => {
    return budget ? `$${parseInt(budget).toLocaleString()}` : '—';
  };

  const parseGenres = (genresJson: string) => {
    try {
      return JSON.parse(genresJson);
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto my-10 bg-white p-8 rounded-xl shadow-lg font-sans text-[#1e293b]">
      {/* Header Nav */}
      <header className="flex justify-between items-center mb-6 border-b border-[#f1f5f9] pb-4">
        <Link href="/" className="w-[120px] no-underline text-[#64748b] text-sm font-medium hover:text-[#2563eb] transition-colors">
          ← Main Menu
        </Link>
        <h1 className="m-0 text-3xl font-bold text-[#0f172a] flex-grow text-center tracking-tight">
          Movie Library
        </h1>
        <div className="w-[120px]"></div>
      </header>

      {loading ? (
        <div className="py-10 text-center">Loading movies...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">Error loading movies.</div>
      ) : (
        <>
          <table className="w-full border-separate border-spacing-0 mt-5 table-auto">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="p-4 text-left text-[#64748b] font-semibold uppercase text-xs tracking-wider border-b border-[#f1f5f9] rounded-tl-lg">IMDb ID</th>
                <th className="p-4 text-left text-[#64748b] font-semibold uppercase text-xs tracking-wider border-b border-[#f1f5f9]">Title</th>
                <th className="p-4 text-left text-[#64748b] font-semibold uppercase text-xs tracking-wider border-b border-[#f1f5f9] min-w-[250px]">Genres</th>
                <th className="p-4 text-left text-[#64748b] font-semibold uppercase text-xs tracking-wider border-b border-[#f1f5f9] whitespace-nowrap w-[1%]">Release Date</th>
                <th className="p-4 text-left text-[#64748b] font-semibold uppercase text-xs tracking-wider border-b border-[#f1f5f9] whitespace-nowrap w-[1%] rounded-tr-lg">Budget</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.movieId} className="hover:bg-[#fcfdfe] transition-colors">
                  <td className="p-4 border-b border-[#f1f5f9] whitespace-nowrap w-[1%]">
                    <span className="font-mono bg-[#f1f5f9] px-2 py-1 rounded-md text-[#475569] text-[0.85rem]">
                      {movie.imdbId}
                    </span>
                  </td>
                  <td className="p-4 border-b border-[#f1f5f9] min-w-[150px]">
                    <Link href={`/movie-detail/${movie.movieId}`} className="text-[#2563eb] no-underline font-semibold hover:underline hover:text-[#1d4ed8]">
                      {movie.title}
                    </Link>
                  </td>
                  <td className="p-4 border-b border-[#f1f5f9]">
                    {parseGenres(movie.genres).map((genre: any) => (
                      <span key={genre.id} className="inline-block whitespace-nowrap bg-[#eff6ff] text-[#2563eb] px-2.5 py-1 rounded-full text-[0.75rem] m-0.5 font-semibold border border-[#dbeafe]">
                        {genre.name}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 border-b border-[#f1f5f9] whitespace-nowrap">{movie.releaseDate || '—'}</td>
                  <td className="p-4 border-b border-[#f1f5f9] whitespace-nowrap">{formatBudget(movie.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-10 flex justify-center items-center gap-4">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
              className="px-6 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1d4ed8] transition-all"
            >
              Previous
            </button>
            <span className="font-semibold text-[#1e293b]">Page {page}</span>
            <button 
              onClick={() => setPage(page + 1)}
              className="px-6 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-all"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}