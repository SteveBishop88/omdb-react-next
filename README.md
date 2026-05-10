# OMDb Movie Explorer (Next.js 16 Edition)

A movie exploration dashboard built with **Next.js 16** and **Turbopack**. This project is a React-based evolution of a modern web architecture, featuring persistent state management and a multi-database backend.

## 🚀 Key Features

* **Nuxt-Style Persistence:** Utilizes **Zustand** to replicate the "persistent state" behavior of Nuxt 4. Search results, years, and genre selections stay in memory even when navigating between movie details and search lists.
* **Complex SQLite Backend:** * Queries movie metadata using advanced `JSON_EACH` and `JSON_EXTRACT` logic to handle nested genre structures.
    * Joins data across two separate SQLite databases (`movies.db` and `ratings.db`) for a unified view.
* **Third-Party Integration:** Fetches real-time movie posters and extended ratings from the **OMDb API**.
* **Modern UI:** A clean, responsive dashboard built with **Tailwind CSS**, featuring genre pills, formatted currency for budgets, and a focus on scannability.

## 🛠️ Technical Stack

* **Framework:** Next.js 16 (App Router)
* **Bundler:** Turbopack
* **State Management:** Zustand (for persistent search contexts)
* **Styling:** Tailwind CSS
* **Database:** SQLite (sqlite3)

## 📂 Project Structure

- `/app/api`: Serverless route handlers for Year, Genre, and Detail lookups.
- `/app/store`: Zustand stores ensuring a seamless "back-button" experience without losing data.
- `/data`: Local SQLite databases (included for immediate local demonstration).
- `/app/movie-detail`: Dynamic routing for in-depth movie analysis.

## 🏃 Getting Started

1. **Clone the repository:**
   `git clone https://github.com/SteveBishop88/omdb-react-next.git`

2. **Install dependencies:**
   `npm install`

3. **Obtain an OMDb API Key:**
   * Go to [OMDb API Key Page](https://www.omdbapi.com/apikey.aspx).
   * Choose the **FREE** tier (1,000 requests/day).
   * Fill out the form and submit.
   * **IMPORTANT:** Check your email and click the activation link sent by OMDb to enable the key.

4. **Set up environment variables:**
   Create a file named `.env.local` in the root directory and add your key:
   `OMDB_API_KEY=your_activated_key_here`

5. **Run the development server:**
   `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📝 Background

This project serves as a technical demonstration of porting modern web architectures from Nuxt/Vue to Next.js/React, maintaining a high-quality user experience through smart state management and efficient SQL querying.
