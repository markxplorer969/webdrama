'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Eye, Film } from 'lucide-react';

interface TrendingItem {
  rank: string;
  title: string;
  book_id: string;
  image: string;
  views: string;
  episodes: string;
}

interface TrendingScrollProps {
  trending: TrendingItem[];
}

export const TrendingScroll: React.FC<TrendingScrollProps> = ({ trending }) => {
  if (!trending || trending.length === 0) {
    return null;
  }

  // Show ALL trending items (rank 1-6), not just slice(3)
  const trendingItems = trending;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">🔥 Sedang Hype</h2>
        <span className="text-zinc-400 text-sm">({trendingItems.length} drama)</span>
      </div>
      
      <div className="relative">
        {/* Scroll Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 min-w-max">
            {trendingItems.map((item) => (
              <Link
                key={item.rank}
                href={`/watch/${item.book_id}`}
                className="flex-shrink-0 w-40 group"
              >
                <div className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-rose-500">
                  {/* Poster Image */}
                  <div className="relative aspect-[3/4] w-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rank Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                      #{item.rank}
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
                        {item.episodes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};