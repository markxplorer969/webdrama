import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DramaCard } from '@/components/home/DramaCard';
import { searchDramas, toUnifiedDrama, type UnifiedDrama } from '@/lib/services/dramabox';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: 'Search Dramas - DramaFlex',
  description: 'Search for your favorite dramas, series, and movies on DramaFlex',
};

async function SearchResults({ query }: { query: string }) {
  // Fetch search results directly from external API
  let results: UnifiedDrama[] = [];
  
  try {
    const searchResults = await searchDramas(query);
    // Convert to unified format for DramaCard component
    results = searchResults.map(drama => toUnifiedDrama(drama));
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
    <>
      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-zinc-400 text-sm">
          Found <span className="text-white font-semibold">{results.length}</span> results for "{query}"
        </p>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((drama, index) => (
          <DramaCard 
            key={`${drama.book_id}-${index}`}
            drama={drama}
            index={index}
          />
        ))}
      </div>
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  return (
    <>
      <main className="min-h-screen bg-zinc-950 pt-8">
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
