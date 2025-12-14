'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Eye, Film } from 'lucide-react';

interface DramaItem {
  title: string;
  book_id: string;
  image: string;
  views?: string;
  episodes?: string;
  description?: string;
  genres?: string[];
  status?: string;
}

interface DramaCardProps {
  drama: DramaItem;
  index?: number;
}

export const DramaCard: React.FC<DramaCardProps> = ({ drama, index = 0 }) => {
  return (
    <Link href={`/drama/${drama.book_id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-rose-500">
        {/* Poster Image */}
        <div className="relative aspect-[3/4]">
          <Image
            src={drama.image}
            alt={drama.title}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          {drama.status && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {drama.status}
            </div>
          )}
          
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
            {drama.title}
          </h3>
          
          <div className="flex items-center gap-3 text-zinc-300 text-xs">
            {drama.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {drama.views}
              </span>
            )}
            
            {drama.episodes && (
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>{drama.episodes} episodes</span>
              </span>
            )}
          </div>
          
          {/* Genres */}
          {drama.genres && drama.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {drama.genres.slice(0, 3).map((genre, idx) => (
                <span key={idx} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full text-xs">
                  {genre}
                </span>
              ))}
              {drama.genres.length > 3 && (
                <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full text-xs">
                  +{drama.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};