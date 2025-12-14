'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DramaCard } from '@/components/home/DramaCard';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  book_id: string;
  image: string;
  episodes: string;
  views: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/drama/search?q=${encodeURIComponent(query.trim())}`);
        const data = await response.json();
        
        if (data.success) {
          setResults(data.data);
        } else {
          setError(data.error || 'Failed to fetch search results');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-1">
              <span className="text-xl font-bold text-white">Drama</span>
              <span className="text-xl font-bold text-rose-500">Flex</span>
            </Link>
            
            <div className="flex items-center space-x-2 text-zinc-300">
              <span>Search Results for:</span>
              <span className="text-white font-medium">"{query}"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-8">Searching...</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-[2/3] bg-zinc-900/50 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-zinc-900/50 rounded-lg p-8 max-w-md mx-auto">
              <Search className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Search Error</h2>
              <p className="text-zinc-300">{error}</p>
              <Link href="/">
                <Button className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-zinc-900/50 rounded-lg p-8 max-w-md mx-auto">
              <Search className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No Results Found</h2>
              <p className="text-zinc-300">
                No dramas found matching "{query}". Try different keywords.
              </p>
              <Link href="/">
                <Button className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Found {results.length} results for "{query}"
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map((result) => (
                <DramaCard
                  key={result.book_id}
                  title={result.title}
                  image={result.image}
                  episodes={result.episodes}
                  bookId={result.book_id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}