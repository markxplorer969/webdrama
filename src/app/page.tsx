'use client';

import { HeroBento } from '@/components/home/HeroBento';
import { LatestGrid } from '@/components/home/LatestGrid';
import { Navbar } from '@/components/Navbar';
import { useTrending } from '@/hooks/useHomeData';

export default function Home() {
  const { trending, isLoading: trendingLoading } = useTrending();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      
      <main>
        {/* Hero Section with Bento Grid */}
        <HeroBento trending={trending} />

        {/* Trending Row */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
              🔥 Sedang Hype
            </h2>
            <p className="text-zinc-400">
              Most popular dramas this week
            </p>
          </div>

          {/* Horizontal Scroll List */}
          <div className="relative">
            {trendingLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-48 space-y-3">
                    <div className="aspect-[2/3] bg-zinc-900/50 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                      <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {trending.map((drama, index) => (
                  <div key={drama.book_id} className="flex-shrink-0 w-48 group">
                    <div className="relative overflow-hidden rounded-lg bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-zinc-900/70">
                      {/* Poster Image */}
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={drama.image}
                          alt={drama.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Rank Badge */}
                        <div className="absolute top-2 left-2">
                          <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                            #{drama.rank}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-amber-200 transition-colors duration-300">
                            {drama.title}
                          </h4>
                          
                          <div className="flex items-center justify-between text-zinc-300 text-xs">
                            <div className="flex items-center gap-1">
                              <span>👁 {drama.views}</span>
                              <span>• {drama.episodes} EP</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Updates Grid */}
        <LatestGrid />
      </main>
    </div>
  );
}