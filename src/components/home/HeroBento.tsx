'use client';

import { DramaCard } from './DramaCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Eye, Crown, TrendingUp } from 'lucide-react';

interface HeroBentoProps {
  trending: Array<{
    title: string;
    image: string;
    episodes: string;
    book_id: string;
    rank: number;
    views: string;
  }>;
}

export function HeroBento({ trending }: HeroBentoProps) {
  const topDrama = trending[0];
  const otherDramas = trending.slice(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Rank #1 - Featured Large */}
      <div className="md:col-span-2 md:row-span-2 relative group">
        <div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900/20 via-rose-900/10 to-rose-900/5 backdrop-blur-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(251,113,133,0.1) 0%, rgba(251,113,133,0.1) 0%)',
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                  <Crown className="w-3 h-3 mr-1" />
                  RANK #1
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  TRENDING
                </Badge>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-200 transition-colors duration-300">
                {topDrama.title}
              </h2>
              
              <div className="flex items-center gap-4 text-zinc-300 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{topDrama.views}</span>
                  <span>• {topDrama.episodes} EP</span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <p className="text-zinc-400 text-xs">EPISODE {topDrama.episodes}</p>
                <p className="text-zinc-300 text-xs">{topDrama.views} VIEWS</p>
              </div>
            </div>
              
              <Button 
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-white border-rose-500 group-hover:bg-rose-400 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-rose-600/20 via-rose-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
        </div>

        {/* Drama Card for Rank #1 */}
        <DramaCard
          title={topDrama.title}
          image={topDrama.image}
          episodes={topDrama.episodes}
          bookId={topDrama.book_id}
          rank={1}
        />
      </div>

      {/* Rank #2 & #3 - Side by side */}
      {otherDramas.map((drama, index) => (
        <div key={drama.book_id} className="relative group">
          <DramaCard
            title={drama.title}
            image={drama.image}
            episodes={drama.episodes}
            bookId={drama.book_id}
            rank={index + 2}
          />
          
          {/* Rank Badge Overlay */}
          <div className="absolute top-2 left-4 z-20">
            <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              #{index + 2}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}