'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Heart, List, Play, LayoutGrid, Loader2, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface Episode {
  episode: number;
  id: string;
  title?: string;
  is_free?: boolean;
}

interface Drama {
  book_id: string;
  title: string;
  description: string;
  thumbnail: string;
  poster?: string;
  upload_date: string;
  release_year?: string;
  rating?: string;
  duration?: string;
  status: string;
  country?: string;
  language?: string;
  director?: string;
  cast?: string[];
  genres?: string[];
  stats: {
    followers: string;
    total_episodes: string;
    views?: string;
  };
  episode_list: Episode[];
}

interface StreamData {
  book_id: string;
  episode: string;
  video_url: string;
}

interface WatchClientProps {
  drama: Drama;
  initialEpisode: string;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Video Player Skeleton */}
      <div className="w-full aspect-video bg-black relative animate-pulse">
        <div className="absolute inset-0 bg-zinc-800/20" />
      </div>

      {/* Info Section Skeleton */}
      <div className="px-4 py-6 md:px-0 max-w-5xl mx-auto">
        <div className="flex items-start gap-6">
          <div className="w-24 h-32 bg-zinc-800 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-zinc-800 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
            <div className="flex gap-6">
              <div className="h-4 bg-zinc-800 rounded w-20 animate-pulse" />
              <div className="h-4 bg-zinc-800 rounded w-20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Episode Grid Skeleton */}
      <div className="mt-8 max-w-5xl mx-auto px-4 md:px-0">
        <div className="h-6 bg-zinc-800 rounded w-32 animate-pulse mb-4" />
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg h-12 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <Play className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-white">Video Error</h3>
        <p className="text-zinc-400">{error}</p>
        <Button onClick={onRetry} className="bg-rose-600 hover:bg-rose-700">
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default function WatchClient({ drama, initialEpisode }: WatchClientProps) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { userData, updateUserData } = useAuth();

  // Initialize current episode based on initialEpisode prop
  useEffect(() => {
    const episode = drama.episode_list.find(ep => ep.episode === parseInt(initialEpisode));
    if (episode) {
      setCurrentEpisode(episode);
    } else if (drama.episode_list.length > 0) {
      setCurrentEpisode(drama.episode_list[0]);
    }
  }, [drama.episode_list, initialEpisode]);

  // Fetch stream data when current episode changes
  useEffect(() => {
    if (!currentEpisode) return;

    const fetchStreamData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/stream?bookId=${drama.book_id}&episode=${currentEpisode.episode}`, {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStreamData(data.data);
          } else {
            setError('Failed to load video');
          }
        } else {
          setError('Video not available');
        }
      } catch (err) {
        setError('An error occurred while loading video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamData();
  }, [currentEpisode, drama.book_id]);

  // Update URL without page reload
  const updateURL = (episodeNumber: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('episode', episodeNumber.toString());
    window.history.replaceState({}, '', url.toString());
  };

  // Check if episode is accessible with COMPOSITE KEY SYSTEM (Backward Compatible)
  const isEpisodeAccessible = (episode: Episode): boolean => {
    if (!userData) return false;
    if (episode.is_free) return true;
    
    // CRITICAL FIX: Use composite key for drama-specific unlock checking
    const unlockKey = `${drama.book_id}_${episode.id}`;
    
    // Check for new composite key format first
    if (userData.unlocked_episodes?.includes(unlockKey)) {
      return true;
    }
    
    // Backward compatibility: Check for old format (episode ID only)
    // This allows existing users to still access their previously unlocked episodes
    if (userData.unlocked_episodes?.includes(episode.id)) {
      return true;
    }
    
    return false;
  };

  // CRITICAL FIX: Rewritten handleEpisodeChange with strict error handling
  const handleEpisodeChange = async (targetEp: Episode) => {
    // 1. Prevent clicking current ep or if already processing
    if (!currentEpisode || currentEpisode.id === targetEp.id || isUnlocking) {
      return;
    }

    // 2. Start button spinner immediately
    setIsUnlocking(targetEp.id);

    try {
      // 3. Check if user is authenticated
      if (!userData) {
        toast.error('Please sign in to unlock episodes');
        return;
      }

      // 4. Check if episode is locked
      const isLocked = !isEpisodeAccessible(targetEp);

      if (isLocked) {
        // 5. Check Balance BEFORE any API call
        if (userData.credits < 5) {
          toast.error("Saldo tidak cukup! Silakan Top Up.");
          return; // STOP here - but finally will still clear loading
        }

        // 6. Process Transaction
        const response = await fetch('/api/user/unlock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userData.uid,
            dramaId: drama.book_id,
            episodeId: targetEp.id,
            cost: 5
          }),
        });

        const result = await response.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to unlock episode');
          return; // STOP here - but finally will still clear loading
        }

        // 7. Update Auth Context locally with COMPOSITE KEY
        const unlockKey = `${drama.book_id}_${targetEp.id}`;
        updateUserData({
          credits: result.newBalance,
          unlocked_episodes: [...(userData.unlocked_episodes || []), unlockKey],
          history: [...(userData.history || []), `${drama.book_id}:${targetEp.id}`]
        });

        toast.success("Episode Terbuka (-5 Credits)");
      }

      // 8. THE CRITICAL SWITCH - This ALWAYS happens if we reach here
      setCurrentEpisode(targetEp);
      updateURL(targetEp.episode);
      setAutoPlay(true);

    } catch (error) {
      console.error('Episode change error:', error);
      toast.error("Gagal memuat episode.");
    } finally {
      // 9. ALWAYS STOP LOADING - This prevents hanging spinners
      setIsUnlocking(null);
    }
  };

  // Handle video end for auto-next episode
  const handleVideoEnd = () => {
    if (!currentEpisode) return;

    const currentIndex = drama.episode_list.findIndex(ep => ep.id === currentEpisode.id);
    const nextEpisode = drama.episode_list[currentIndex + 1];

    if (nextEpisode) {
      handleEpisodeChange(nextEpisode);
    }
  };

  // Auto-play when stream data is available and autoPlay is true
  useEffect(() => {
    if (streamData?.video_url && autoPlay && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play failed:', err);
      });
      setAutoPlay(false);
    }
  }, [streamData, autoPlay]);

  if (isLoading && !streamData) {
    return <LoadingSkeleton />;
  }

  if (error && !streamData) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* CRITICAL FIX: Video Player Area with proper key handling */}
      <div className="relative w-full aspect-video bg-black shadow-2xl">
        {currentEpisode && (
          <>
            {streamData?.video_url ? (
              <video
                ref={videoRef}
                // THE SECRET SAUCE: Key prop forces React to destroy and recreate video element
                key={currentEpisode.id}
                controls
                className="w-full h-full"
                preload="metadata"
                poster={drama.thumbnail}
                onEnded={handleVideoEnd}
                autoPlay={autoPlay}
              >
                <source src={streamData.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={drama.thumbnail}
                  alt={drama.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-4 transition-colors cursor-pointer">
                    <Play className="w-8 h-8" fill="white" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Floating Back Button */}
        <Link 
          href={`/search?q=${encodeURIComponent(drama.title)}`}
          className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 text-white p-2 rounded-lg transition-all hover:bg-zinc-800/80 z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Info Section */}
      <div className="px-4 py-6 md:px-0 max-w-5xl mx-auto">
        <div className="flex items-start gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-32 rounded-lg overflow-hidden">
              <Image
                src={drama.thumbnail}
                alt={drama.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{drama.title}</h1>
            
            {/* Meta Row */}
            <div className="flex items-center gap-6 text-zinc-400 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{drama.stats?.followers || '0'} Likes</span>
              </div>
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-blue-500" />
                <span>{drama.episode_list?.length || '0'} Episodes</span>
              </div>
              {userData && (
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">{userData.credits}</span>
                  <span className="text-zinc-400"> Credits</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-l-2 border-rose-600/50 pl-4">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {drama.description || 'No description available.'}
              </p>
            </div>

            {/* Additional Meta */}
            <div className="flex items-center gap-6 text-zinc-400 text-sm">
              {drama.upload_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(drama.upload_date).toLocaleDateString()}</span>
                </div>
              )}
              {drama.status && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  {drama.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episode Grid */}
      <div className="mt-8 max-w-5xl mx-auto px-4 md:px-0">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-rose-500" />
          Select Episode
        </h3>
        
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {drama.episode_list?.map((episode) => {
            const isCurrentEpisode = currentEpisode?.id === episode.id;
            const isAccessible = isEpisodeAccessible(episode);
            const isCurrentlyUnlocking = isUnlocking === episode.id;
            
            return (
              <button
                key={episode.id}
                onClick={() => handleEpisodeChange(episode)}
                disabled={isCurrentlyUnlocking}
                className={`transition-all rounded-lg h-12 flex items-center justify-center font-medium text-sm relative ${
                  isCurrentEpisode
                    ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                    : isAccessible
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {isCurrentlyUnlocking ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                ) : (
                  <>
                    <span>{episode.episode}</span>
                    {isCurrentEpisode && (
                      <Play className="w-4 h-4" fill="white" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}