import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4f4f4] m-0 font-sans">
      <div className="bg-white p-[30px] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center">
        <h1 className="text-[32px] font-bold text-[#333] mb-5">
          Welcome to the Movie Database
        </h1>
        <p className="text-[#666]">A React/Next.js implementation</p>
        <p className="text-[#666] mb-5">Click the buttons below to explore movies.</p>
        
        <div className="flex flex-col gap-[15px] items-center mt-5">
          <Link href="/movies" className="w-full max-w-[250px]">
            <button className="w-full py-[10px] px-5 text-base cursor-pointer bg-[#007bff] text-white border-none rounded-md transition-colors duration-300 hover:bg-[#0056b3]">
              View All Movies
            </button>
          </Link>
          
          <Link href="/movies-by-year" className="w-full max-w-[250px]">
            <button className="w-full py-[10px] px-5 text-base cursor-pointer bg-[#007bff] text-white border-none rounded-md transition-colors duration-300 hover:bg-[#0056b3]">
              View Movies by Year
            </button>
          </Link>
          
          <Link href="/movies-by-genre" className="w-full max-w-[250px]">
            <button className="w-full py-[10px] px-5 text-base cursor-pointer bg-[#007bff] text-white border-none rounded-md transition-colors duration-300 hover:bg-[#0056b3]">
              View Movies by Genre
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}