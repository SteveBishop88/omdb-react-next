import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  const { year } = await params;
  
  // Parse query params (page and sort)
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort')?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
  const limit = 50;
  const offset = (page - 1) * limit;

  if (!year || isNaN(parseInt(year))) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
  }

  try {
    const dbPath = path.join(process.cwd(), 'data', 'movies.db');
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    const sqlQuery = `
        SELECT movieId, imdbId, title, genres, releaseDate, budget
        FROM movies
        WHERE STRFTIME('%Y', releaseDate) = ?
        ORDER BY releaseDate ${sort}
        LIMIT ? OFFSET ?;
    `;

    const rows = await db.all(sqlQuery, [year, limit, offset]);

    await db.close();

    // Format budget like the Nuxt version
    const formattedRows = rows.map(movie => ({
      ...movie,
      budget: movie.budget !== null ? `$${movie.budget.toLocaleString()}` : '—',
    }));

    return NextResponse.json(formattedRows);

  } catch (error: any) {
    console.error("Year API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}