import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/home/DramaCard';

interface SearchPageProps {
  searchParams: { q?: string };
}

export const metadata: Metadata = {
  title: 'Search Dramas - DramaFlex',
  description: 'Search for your favorite dramas, series, and movies on DramaFlex',
};

async function SearchResults({ query }: { query: string }) {
  // Fetch search results directly from scraper (no cache)
  let results = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/drama/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store', // Ensure fresh data
    });
    
    if (response.ok) {
      const data = await response.json();
      results = data.success ? data.data : [];
    }
  } catch (error) {
    console.error('Search fetch error:', error);
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-400 mb-2">
          Enter a search keyword
        </h2>
        <p className="text-zinc-500">
          Search for your favorite dramas, series, and movies.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-400 mb-2">
          No results found
        </h2>
        <p className="text-zinc-500">
          We couldn&apos;t find any dramas matching &quot;{query}&quot;.
        </p>
        <p className="text-zinc-500 text-sm">
          Try different keywords or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {results.map((drama, index) => (
        <DramaCard 
          key={`${drama.book_id}-${index}`}
          drama={drama}
          index={index}
        />
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-zinc-950 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-zinc-400" />
              <h1 className="text-xl font-bold text-white">
                {query ? `Results for "${query}"` : 'Search Dramas'}
              </h1>
            </div>
          </div>

          {/* Search Results */}
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          }>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </main>
    </>
  );
}