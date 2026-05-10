'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/movie-detail/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setMovie(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  const parseGenres = (genresJson: string) => {
    try {
      const genres = JSON.parse(genresJson);
      return Array.isArray(genres) ? genres.map((g: any) => g.name).join(', ') : genresJson;
    } catch { return genresJson || 'N/A'; }
  };

  if (loading) return <div className="p-10 text-center"><h2>Loading...</h2></div>;
  if (error) return <div className="p-10 text-center text-red-500"><h2>Movie not found or error loading.</h2></div>;

  return (
    <div className="max-w-[1000px] mx-auto my-10 bg-white p-5 rounded-lg shadow-md font-sans">
      <div className="mb-5 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="bg-[#2563eb] text-white px-4 py-2 rounded font-semibold hover:bg-[#1d4ed8] transition-colors"
        >
          ← Back to Results
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {movie.poster && (
          <img src={movie.poster} alt={movie.title} className="rounded-lg shadow-lg max-w-[200px]" />
        )}
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#333] mt-0">{movie.title}</h1>
          <p className="mt-2 text-gray-700"><strong>IMDb ID:</strong> {movie.imdbId}</p>
          <p className="mt-2 text-gray-700"><strong>Description:</strong> {movie.overview || 'No description available.'}</p>
          <p className="mt-2 text-gray-700"><strong>Release Date:</strong> {movie.releaseDate || 'N/A'}</p>
          <p className="mt-2 text-gray-700"><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
          <p className="mt-2 text-gray-700"><strong>Genres:</strong> {parseGenres(movie.genres)}</p>
        </div>
      </div>

      <hr className="my-5 border-t border-gray-200" />

      {movie.averageRating && (
        <p className="mb-4 text-gray-800"><strong>Average Rating (Local):</strong> {movie.averageRating.toFixed(2)}</p>
      )}

      <h3 className="text-xl font-bold mb-3">Ratings:</h3>
      {movie.ratings?.length > 0 ? (
        movie.ratings.map((rating: any, index: number) => (
          <p key={index} className="italic mb-1 text-gray-600">
            <strong>Source:</strong> {rating.source}, <strong>Value:</strong> {rating.value}
          </p>
        ))
      ) : (
        <p className="text-gray-500">No ratings available.</p>
      )}
    </div>
  );
}