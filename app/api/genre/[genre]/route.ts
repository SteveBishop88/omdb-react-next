import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ genre: string }> }
) {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);
  
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    const dbPath = path.join(process.cwd(), 'data', 'movies.db');
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    // The JSON_EACH logic handles the JSON string stored in your genres column
    const sqlQuery = `
        SELECT movieId, imdbId, title, genres, releaseDate, budget
        FROM movies m
        WHERE EXISTS (
            SELECT 1
            FROM JSON_EACH(m.genres) AS genre_entry
            WHERE JSON_EXTRACT(genre_entry.value, '$.name') = ?
        )
        LIMIT ? OFFSET ?;
    `;

    const rows = await db.all(sqlQuery, [decodedGenre, limit, offset]);
    await db.close();

    const formattedRows = rows.map(movie => ({
      ...movie,
      budget: movie.budget !== null ? `$${movie.budget.toLocaleString()}` : '—',
    }));

    return NextResponse.json(formattedRows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}