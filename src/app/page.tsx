'use client';

import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { TrendingScroll } from '@/components/home/TrendingScroll';
import { LatestGrid } from '@/components/home/LatestGrid';
import { useHomeData } from '@/hooks/useHomeData';
import { Loader2, Film } from 'lucide-react';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-rose-500 rounded-full animate-spin" />
        <Film className="absolute inset-0 m-auto w-8 h-8 text-rose-500" />
      </div>
      <p className="text-zinc-400 animate-pulse">Loading amazing content...</p>
    </div>
  </div>
);

export default function Home() {
  const { data, isLoading, isError } = useHomeData();

  // Show loading skeleton while loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Film className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Oops! Something went wrong</h2>
          <p className="text-zinc-400">Failed to load content. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Top 3 Trending */}
        <HeroSection trending={data?.trending || []} />
        
        {/* Trending Scroll - Rest of Trending */}
        <TrendingScroll trending={data?.trending || []} />
        
        {/* Latest Episodes Grid */}
        <LatestGrid latest={data?.latest || []} />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-400 text-sm">
            <p>&copy; 2024 Dramaflex. All rights reserved.</p>
            <p className="mt-2">Stream your favorite dramas anytime, anywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}