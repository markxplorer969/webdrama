'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Play, Eye } from 'lucide-react';

interface DramaCardProps {
  title: string;
  image: string;
  episodes: string;
  bookId: string;
  rank?: number;
}

export function DramaCard({ title, image, episodes, bookId, rank }: DramaCardProps) {
  const isTopRank = rank && rank <= 3;

  return (
    <Link href={`/watch/${bookId}`}>
      <div className="group relative overflow-hidden rounded-lg bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-zinc-900/70">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1536px) 33vw"
            referrerPolicy="no-referrer"
          />
          
          {/* Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-rose-600/90 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>

          {/* Top Rank Badge */}
          {isTopRank && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 text-white border-amber-400 text-xs font-bold px-2 py-1">
                #{rank}
              </Badge>
            </div>
          )}

          {/* Episode Count Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {episodes} EP
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-zinc-100 line-clamp-2 text-sm group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          
          {/* Meta Info */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-zinc-400 text-xs">
              <Eye className="w-3 h-3" />
              <span>Views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}