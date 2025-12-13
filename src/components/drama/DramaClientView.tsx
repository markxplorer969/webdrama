/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Eye, 
  Users, 
  TrendingUp,
  Star,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Image from 'next/image';
import SmartPlayer from '@/components/drama/SmartPlayer';
import './violet-theme.css';

// Helper function to format view count
const formatViews = (views?: string) => {
  if (!views) return 'N/A';
  const num = parseInt(views.replace(/[^0-9]/g, ''));
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return views;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
};

interface Episode {
  episode: number;
  id: string;
  videoUrl?: string;
}

interface DramaData {
  title: string;
  thumbnail: string;
  description: string;
  stats: {
    total_episodes: string;
    followers: string;
  };
  upload_date: string;
  episode_list: Episode[];
}

interface DramaClientViewProps {
  drama: DramaData;
}

export default function DramaClientView({ drama }: DramaClientViewProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const currentEpisode = drama.episode_list[currentEpisodeIndex];  
  // Generate video URL based on episode (mock implementation)
  const getVideoUrl = (episode: Episode) => {
    // In a real app, this would come from your API
    return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
  };

  const handleEpisodeChange = (index: number) => {
    if (index !== currentEpisodeIndex) {
      setCurrentEpisodeIndex(index);
      // Scroll to player when episode changes
      setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const toggleSynopsis = () => {
    setIsSynopsisExpanded(!isSynopsisExpanded);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient Background Effects with Violet Theme */}
      <div className="fixed inset-0 z-0">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-fuchsia-900/5 via-transparent to-transparent" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Hero Section with SmartPlayer */}
        <section className="relative" ref={playerRef}>
          <div className="container mx-auto px-4 py-4 sm:py-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              
              {/* SmartPlayer Container */}
              <div className="relative order-2 lg:order-1">
                {/* Glowing effect behind player */}
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 rounded-2xl blur-xl animate-pulse" />
                
                {/* SmartPlayer Component */}
                <SmartPlayer
                  videoUrl={getVideoUrl(currentEpisode)}
                  poster={drama.thumbnail}
                  episodeId={`${drama.title?.replace(/\s+/g, '-')}-ep${currentEpisode.episode}`}
                  dramaTitle={drama.title}
                  episodeNumber={currentEpisode.episode}
                />
              </div>

              {/* Modern Info Card */}
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                {/* Title Section */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                        {drama.title}
                      </h1>
                      
                      {/* Glass Pills for Stats */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatViews(drama.stats.followers)}
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {drama.stats.total_episodes} Episodes
                        </div>
                        <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-violet-300 flex items-center gap-1 border border-violet-500/20">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="text-center flex-shrink-0">
                      <div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-lg p-2 sm:p-3 text-center min-w-[60px] sm:min-w-[80px]">
                        <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 mx-auto mb-1" />
                        <div className="text-white font-bold text-sm sm:text-base">4.8</div>
                        <div className="text-white/80 text-xs">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Episode Info */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      Currently Playing: Episode {currentEpisode.episode}
                    </h3>
                    <div className="text-violet-400 text-sm font-medium">
                      {currentEpisodeIndex + 1} of {drama.episode_list.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Synopsis Section */}
          <section className="container mx-auto px-4 py-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Synopsis</h2>
                <Button
                  onClick={toggleSynopsis}
                  variant="ghost"
                  className="text-violet-400 hover:text-violet-300 hover:bg-white/5 transition-all duration-300"
                >
                  {isSynopsisExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Sembunyikan
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Selengkapnya
                    </>
                  )}
                </Button>
              </div>
              <div className="text-slate-200 leading-relaxed text-lg">
                <p className={`${isSynopsisExpanded ? '' : 'line-clamp-3'} transition-all duration-300`}>
                  {drama.description || 'No synopsis available.'}
                </p>
              </div>
            </div>
          </section>

          {/* Interactive Episode Grid */}
          <section className="container mx-auto px-4 py-8 pb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              {/* Sticky Header */}
              <div className="sticky top-20 z-40 backdrop-blur-md bg-white/5 border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Episodes</h2>
                  <div className="text-slate-400 text-sm">
                    {drama.episode_list.length} Episodes Available
                  </div>
                </div>
              </div>

              {/* Episode Grid */}
              <div className="p-6">
                <ScrollArea className="h-[600px] custom-scrollbar">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {drama.episode_list.map((episode, index) => {
                      const isActive = index === currentEpisodeIndex;
                      const isLocked = index > 2; // Simulate locked episodes
                      
                      return (
                        <button
                          key={`${episode.episode}-${episode.id}`}
                          onClick={() => handleEpisodeChange(index)}
                          className={`
                            episode-card relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 transform hover:scale-105
                            ${isActive 
                              ? 'border-violet-500 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 shadow-lg shadow-violet-500/25' 
                              : isLocked 
                                ? 'border-white/10 bg-white/5 opacity-60 cursor-not-allowed' 
                                : 'border-white/20 bg-white/5 hover:border-white/30 cursor-pointer'
                            }
                          `}
                          disabled={isLocked}
                        >
                          {/* Episode Number */}
                          <div className="absolute top-2 left-2 z-10">
                            <div className={`
                              px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300
                              ${isActive 
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white' 
                                : 'bg-black/60 text-white/80'
                              }
                            `}>
                              EP {episode.episode}
                            </div>
                          </div>

                          {/* Lock Overlay */}
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Lock className="w-8 h-8 text-white/60" />
                            </div>
                          )}

                          {/* Active Indicator */}
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                                <Play className="w-6 h-6 text-white ml-1" />
                              </div>
                            </div>
                          )}

                          {/* Hover Effect */}
                          {!isLocked && !isActive && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          )}

                          {/* Background Image */}
                          <div className="absolute inset-0">
                            <Image
                              src={drama.thumbnail}
                              alt={`Episode ${episode.episode}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}