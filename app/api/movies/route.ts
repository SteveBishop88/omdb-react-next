import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path'; 

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    // pathe to db file
    const dbPath = path.join(process.cwd(), 'data', 'movies.db'); 
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    const movies = await db.all(
      'SELECT * FROM movies LIMIT ? OFFSET ?',
      [limit, offset]
    );

    await db.close();
    return NextResponse.json(movies);
    
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to load movies" }, { status: 500 });
  }
}