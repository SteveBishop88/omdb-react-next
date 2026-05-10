import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const apiKey = process.env.OMDB_API_KEY;
  // const apiKey = 'dacc06b8';

  try {
    // 1. Open both databases using absolute paths
    const dbDir = path.join(process.cwd(), 'data');
    const moviesDb = await open({ filename: path.join(dbDir, 'movies.db'), driver: sqlite3.Database });
    const ratingsDb = await open({ filename: path.join(dbDir, 'ratings.db'), driver: sqlite3.Database });

    // 2. Fetch basic movie info
    const movie = await moviesDb.get('SELECT * FROM movies WHERE movieId = ?', [id]);

    if (!movie) {
      await Promise.all([moviesDb.close(), ratingsDb.close()]);
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // 3. Format initial details
    const movieDetails: any = {
      ...movie,
      releaseDate: movie.releaseDate 
        ? new Date(movie.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : null,
      budget: movie.budget ? `$${movie.budget.toLocaleString()}` : null,
      ratings: []
    };

    // 4. Fetch Local Ratings
    const localRatings = await ratingsDb.all('SELECT rating FROM ratings WHERE movieId = ?', [id]);
    if (localRatings?.length > 0) {
      const avg = localRatings.reduce((sum, r) => sum + r.rating, 0) / localRatings.length;
      movieDetails.averageRating = avg;
      movieDetails.ratings.push({
        source: 'Local Users',
        value: `${avg.toFixed(1)} / 5 (${localRatings.length} votes)`
      });
    }

    // 5. Fetch External OMDb Data
    if (apiKey && movie.imdbId) {
      const omdbRes = await fetch(`http://www.omdbapi.com/?i=${movie.imdbId}&apikey=${apiKey}`);
      const omdbData = await omdbRes.json();

      // console.log("OMDb Response for ID:", movie.imdbId, omdbData);
      
      if (omdbData.Response === 'True') {
        if (omdbData.Poster && omdbData.Poster !== 'N/A') movieDetails.poster = omdbData.Poster;
        if (!movieDetails.overview) movieDetails.overview = omdbData.Plot;
        if (omdbData.Ratings) {
          omdbData.Ratings.forEach((r: any) => movieDetails.ratings.push({ source: r.Source, value: r.Value }));
        }
      }
    }

    await Promise.all([moviesDb.close(), ratingsDb.close()]);
    return NextResponse.json(movieDetails);

  } catch (error) {
    console.error("Detail API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}