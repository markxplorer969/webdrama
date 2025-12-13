'use client';

import { useState } from 'react';
import { DramaCard } from './DramaCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLatest } from '@/hooks/useHomeData';

interface DramaItem {
  title: string;
  book_id: string;
  image: string;
  views: string;
  episodes: string;
}

export function LatestGrid() {
  const [page, setPage] = useState(1);
  const { latest, hasMore, isLoading, error } = useLatest(page);

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPage(page + 1);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-zinc-400">
          <p>Failed to load latest episodes</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            📺 Episode Terbaru
          </h2>
          <p className="text-zinc-400">
            Latest drama updates and releases
          </p>
        </div>
      </div>

      {/* Drama Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {isLoading && page === 1 ? (
          // Show skeleton grid on first load
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[2/3] bg-zinc-900/50 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : (
          latest.map((drama: DramaItem, index) => (
            <DramaCard
              key={drama.book_id}
              title={drama.title}
              image={drama.image}
              episodes={drama.episodes}
              bookId={drama.book_id}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {latest.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={page === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-zinc-400 font-medium">
            Page {page}
          </span>

          <Button
            onClick={handleNext}
            disabled={!hasMore || isLoading}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white border-rose-500 hover:border-rose-400 transition-colors duration-300"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && latest.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">
            No latest episodes found
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            Check back later for new releases
          </p>
        </div>
      )}
    </section>
  );
}