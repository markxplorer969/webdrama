'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Heart, List, Play, LayoutGrid, Loader2, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useVideoProgress } from '@/hooks/useVideoProgress';

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
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column - Video Player Skeleton (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Skeleton */}
            <div className="relative aspect-video bg-black rounded-xl animate-pulse">
              <div className="absolute inset-0 bg-zinc-800/20" />
            </div>

            {/* Drama Info Skeleton */}
            <div className="space-y-6">
              <div className="h-8 lg:h-10 bg-zinc-800 rounded w-3/4 animate-pulse" />
              <div className="flex gap-4 lg:gap-6">
                <div className="h-4 lg:h-5 bg-zinc-800 rounded w-20 lg:w-24 animate-pulse" />
                <div className="h-4 lg:h-5 bg-zinc-800 rounded w-20 lg:w-24 animate-pulse" />
                <div className="h-4 lg:h-5 bg-zinc-800 rounded w-16 lg:w-20 animate-pulse" />
              </div>
              <div className="h-16 lg:h-20 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Right Column - Episode List Skeleton (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 lg:p-6 backdrop-blur-sm">
                {/* Header Skeleton */}
                <div className="flex items-center gap-2 mb-4 lg:mb-6">
                  <div className="w-4 h-4 lg:w-5 lg:h-5 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 lg:h-6 bg-zinc-800 rounded w-24 lg:w-32 animate-pulse" />
                </div>

                {/* Current Episode Info Skeleton */}
                <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 lg:h-5 bg-zinc-700 rounded w-16 lg:w-20 animate-pulse" />
                      <div className="h-3 lg:h-4 bg-zinc-600 rounded w-20 lg:w-24 animate-pulse" />
                    </div>
                    <div className="w-4 h-4 bg-zinc-700 rounded animate-pulse" />
                  </div>
                </div>

                {/* Episode Grid Skeleton */}
                <div className="grid gap-2 lg:gap-3 grid-cols-4 sm:grid-cols-5 lg:grid-cols-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg h-10 lg:h-12 animate-pulse" />
                  ))}
                </div>

                {/* Navigation Skeleton */}
                <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="h-3 lg:h-4 bg-zinc-700 rounded w-20 lg:w-24 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-6 lg:h-8 bg-zinc-800 rounded w-16 lg:w-20 animate-pulse" />
                      <div className="h-6 lg:h-8 bg-rose-600 rounded w-12 lg:w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  const [progressRestored, setProgressRestored] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { userData, updateUserData } = useAuth();

  // Initialize video progress tracking
  const { loadSavedProgress } = useVideoProgress({
    bookId: drama.book_id,
    episode: currentEpisode?.episode || 0,
    title: drama.title,
    poster: drama.poster || drama.thumbnail,
    videoRef
  });

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

  // Load and restore saved progress when stream data is available
  useEffect(() => {
    if (!streamData?.video_url || !currentEpisode || progressRestored) return;

    const restoreProgress = async () => {
      try {
        const savedProgress = await loadSavedProgress();
        
        if (savedProgress && videoRef.current) {
          const { currentTime, duration } = savedProgress;
          
          // Only restore if progress is meaningful (more than 5% and less than 95%)
          if (currentTime > 0 && duration > 0 && savedProgress.progress > 5 && savedProgress.progress < 95) {
            // Wait for video metadata to load before setting currentTime
            const video = videoRef.current;
            
            const handleLoadedMetadata = () => {
              video.currentTime = currentTime;
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              
              toast.success(`Resumed from ${savedProgress.progress.toFixed(1)}%`);
              console.log('Progress restored:', {
                bookId: drama.book_id,
                episode: currentEpisode.episode,
                currentTime: `${currentTime.toFixed(1)}s`,
                duration: `${duration.toFixed(1)}s`,
                progress: `${savedProgress.progress.toFixed(1)}%`
              });
            };
            
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            
            // Fallback if metadata already loaded
            if (video.readyState >= 1) {
              video.currentTime = currentTime;
              toast.success(`Resumed from ${savedProgress.progress.toFixed(1)}%`);
            }
          }
        }
        
        setProgressRestored(true);
      } catch (error) {
        console.error('Failed to restore progress:', error);
        setProgressRestored(true); // Don't try again
      }
    };

    // Small delay to ensure video element is ready
    setTimeout(restoreProgress, 500);
  }, [streamData, currentEpisode, drama.book_id, loadSavedProgress, progressRestored]);

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
          unlocked_episodes: [...(userData.unlocked_episodes || []), unlockKey]
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

  // Reset progress restored state when episode changes
  useEffect(() => {
    setProgressRestored(false);
  }, [currentEpisode]);

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
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        {/* Desktop Layout: Video Kiri, Episode Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column - Video Player & Info (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              {currentEpisode && (
                <>
                  {streamData?.video_url ? (
                    <video
                      ref={videoRef}
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

            {/* Drama Info Section */}
            <div className="space-y-6">
              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                {drama.title}
              </h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-zinc-300">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-rose-500" />
                  <span className="font-medium text-sm lg:text-base">{drama.stats?.followers || '0'} Likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                  <span className="font-medium text-sm lg:text-base">{drama.episode_list?.length || '0'} Episodes</span>
                </div>
                {drama.upload_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400" />
                    <span className="font-medium text-sm lg:text-base">{new Date(drama.upload_date).toLocaleDateString()}</span>
                  </div>
                )}
                {userData && (
                  <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full">
                    <span className="text-rose-400 font-bold text-sm">{userData.credits}</span>
                    <span className="text-zinc-400 text-sm">Credits</span>
                  </div>
                )}
                {drama.status && (
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">
                    {drama.status}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 text-sm lg:text-base leading-relaxed">
                  {drama.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Episode List (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            {/* Sticky Episode Container */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 lg:p-6 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 lg:mb-6">
                  <LayoutGrid className="w-4 h-4 lg:w-5 lg:h-5 text-rose-500" />
                  <h3 className="text-base lg:text-lg font-semibold text-white">
                    Select Episode
                  </h3>
                  <span className="text-zinc-500 text-xs lg:text-sm">
                    ({drama.episode_list?.length || '0'} episodes)
                  </span>
                </div>

                {/* Current Episode Info */}
                {currentEpisode && (
                  <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm lg:text-base">
                          Episode {currentEpisode.episode}
                        </div>
                        <div className="text-zinc-400 text-xs lg:text-sm">
                          Currently Playing
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-rose-500" fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Episode Grid */}
                <div className={`
                  grid gap-2 lg:gap-3
                  ${drama.episode_list?.length > 50 ? 'max-h-[400px] lg:max-h-[500px] overflow-y-auto custom-scrollbar pr-2' : ''}
                  grid-cols-4 sm:grid-cols-5 lg:grid-cols-3
                `}>
                  {drama.episode_list?.map((episode) => {
                    const isCurrentEpisode = currentEpisode?.id === episode.id;
                    const isAccessible = isEpisodeAccessible(episode);
                    const isCurrentlyUnlocking = isUnlocking === episode.id;
                    
                    return (
                      <button
                        key={episode.id}
                        onClick={() => handleEpisodeChange(episode)}
                        disabled={isCurrentlyUnlocking}
                        className={`
                          transition-all rounded-lg h-10 lg:h-12 flex items-center justify-center font-medium text-xs lg:text-sm relative
                          ${isCurrentEpisode
                            ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] ring-2 ring-rose-600/50'
                            : isAccessible
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white hover:bg-zinc-700/50'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400'
                          }
                          ${isCurrentlyUnlocking ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {isCurrentlyUnlocking ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                            <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin text-white" />
                          </div>
                        ) : (
                          <>
                            <span>{episode.episode}</span>
                            {isCurrentEpisode && (
                              <Play className="w-3 h-3 lg:w-4 lg:h-4" fill="white" />
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Episode Navigation */}
                {drama.episode_list && drama.episode_list.length > 1 && (
                  <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-xs lg:text-sm text-zinc-500">
                      <span>Episode {currentEpisode?.episode || 1} of {drama.episode_list.length}</span>
                      <div className="flex gap-2">
                        {currentEpisode && currentEpisode.episode > 1 && (
                          <button
                            onClick={() => {
                              const prevIndex = drama.episode_list.findIndex(ep => ep.id === currentEpisode.id);
                              if (prevIndex > 0) {
                                handleEpisodeChange(drama.episode_list[prevIndex - 1]);
                              }
                            }}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                          >
                            Previous
                          </button>
                        )}
                        {currentEpisode && currentEpisode.episode < drama.episode_list.length && (
                          <button
                            onClick={() => {
                              const nextIndex = drama.episode_list.findIndex(ep => ep.id === currentEpisode.id);
                              if (nextIndex < drama.episode_list.length - 1) {
                                handleEpisodeChange(drama.episode_list[nextIndex + 1]);
                              }
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}