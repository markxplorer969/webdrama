'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Eye, Film, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LatestItem {
  title: string;
  book_id: string;
  image: string;
  views: string;
  episodes: string;
}

interface LatestGridProps {
  latest: LatestItem[];
}

interface LatestResponse {
  success: boolean;
  data: LatestItem[];
  page: number;
  hasMore: boolean;
  error?: string;
}

// Skeleton Component
const LatestCardSkeleton = () => (
  <div className="space-y-2">
    <div className="aspect-[3/4] bg-zinc-800 rounded-lg animate-pulse" />
    <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
    <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse" />
  </div>
);

export const LatestGrid: React.FC<LatestGridProps> = ({ latest: initialData }) => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<LatestItem[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch specific page data
  const fetchPage = async (targetPage: number) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/drama/latest?page=${targetPage}`);
      const result: LatestResponse = await response.json();

      if (result.success) {
        // Scroll to top of grid smoothly
        if (gridRef.current) {
          gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Small delay to ensure scroll starts
        setTimeout(() => {
          // REPLACE items completely (not append)
          setItems(result.data);
          setPage(targetPage);
          setHasMore(result.hasMore);
        }, 300);
      } else {
        toast.error(result.error || 'Failed to load more dramas');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load more dramas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    fetchPage(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      fetchPage(page - 1);
    }
  };

  // Initialize with page 1 data from props
  useEffect(() => {
    setItems(initialData);
    setPage(1);
    setHasMore(true);
  }, [initialData]);

  // Show skeleton grid while loading on first load
  if (isLoading && page === 1 && items.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-white">📺 Episode Terbaru</h2>
          <span className="text-zinc-400 text-sm">Loading...</span>
        </div>
        
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <LatestCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">📺 Episode Terbaru</h2>
        <span className="text-zinc-400 text-sm">
          {items.length > 0 ? `Page ${page}` : 'No episodes'}
        </span>
      </div>
      
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <Link key={`${item.book_id}-${page}-${index}`} href={`/watch/${item.book_id}`}>
            <div className="relative group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-rose-500">
              {/* Poster Image */}
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Episode Badge */}
                <div className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span>Ep</span>
                  <span>{item.episodes}</span>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-rose-500/90 backdrop-blur-sm rounded-full p-3">
                    <Play className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-3 text-zinc-300 text-xs">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    <span>Baru</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Loading skeleton for page changes */}
        {isLoading && (
          Array.from({ length: 5 }).map((_, i) => (
            <LatestCardSkeleton key={`loading-${page}-${i}`} />
          ))
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-6 mt-12 pb-10">
        <Button
          onClick={handlePrevious}
          disabled={page === 1 || isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <span className="text-zinc-400 text-sm font-medium">
          Page {page}
        </span>
        
        <Button
          onClick={handleNext}
          disabled={!hasMore || isLoading}
          size="sm"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};