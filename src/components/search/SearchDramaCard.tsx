'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Eye, Film, Calendar } from 'lucide-react';

interface DramaItem {
  title: string;
  book_id: string;
  image: string;
  views?: string | number;
  episodes?: string | number;
  description?: string;
  genres?: string[];
  status?: string;
  upload_date?: string;
}

interface SearchDramaCardProps {
  drama: DramaItem;
  index?: number;
}

export const SearchDramaCard: React.FC<SearchDramaCardProps> = ({ drama, index = 0 }) => {
  const formatEpisodes = (episodes?: string | number) => {
    if (!episodes) return '? Episodes';
    if (typeof episodes === 'number') return `${episodes} Episodes`;
    return `${episodes} Episodes`;
  };

  const formatViews = (views?: string | number) => {
    if (!views) return '0 Views';
    
    // Convert to string if it's a number
    const viewsStr = views.toString();
    
    // Extract number part
    const numberMatch = viewsStr.match(/[\d,]+/);
    if (!numberMatch) return '0 Views';
    
    const num = parseInt(numberMatch[0].replace(/,/g, ''));
    
    // Format number
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M Views';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K Views';
    }
    return num + ' Views';
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-rose-500">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link href={`/drama/${drama.book_id}`}>
          <Image
            src={drama.image}
            alt={drama.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        {drama.status && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {drama.status}
          </div>
        )}
        
        {/* Play Button Overlay */}
        <Link href={`/drama/${drama.book_id}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-rose-500/90 backdrop-blur-sm rounded-full p-4">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
          </div>
        </Link>
      </div>
      
      {/* Content Body - flex-1 to expand and push button down */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title Section */}
        <div>
          <Link href={`/drama/${drama.book_id}`}>
            <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight hover:text-rose-400 transition-colors">
              {drama.title}
            </h3>
          </Link>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <Film className="w-3 h-3" />
            <span>{formatEpisodes(drama.episodes)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{formatViews(drama.views)}</span>
          </div>
        </div>
        
        {/* Genres */}
        {drama.genres && drama.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {drama.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">
                {genre}
              </span>
            ))}
            {drama.genres.length > 2 && (
              <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">
                +{drama.genres.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* CTA Button - mt-auto to stick to bottom */}
        <div className="mt-auto">
          <Link href={`/drama/${drama.book_id}`}>
            <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" fill="white" />
              Nonton Sekarang
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};