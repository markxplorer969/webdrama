'use client';

import React from 'react';
import { ChevronLeft, Heart, List, Play, LayoutGrid, Loader2, Calendar, Users, Clock, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface WatchContentProps {
  drama: any;
  episode: string;
}

async function getStreamUrl(bookId: string, episode: string) {
  try {
    const response = await fetch(`/api/stream?bookId=${bookId}&episode=${episode}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch stream URL:', error);
    return null;
  }
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

export function WatchContent({ drama, episode }: WatchContentProps) {
  const [streamData, setStreamData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [unlockingEpId, setUnlockingEpId] = React.useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = React.useState<string>(episode);

  const { userData } = useAuth();

  React.useEffect(() => {
    const loadStream = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/stream?bookId=${drama.book_id}&episode=${episode}`, {
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

    loadStream();
  }, [drama.book_id, episode]);

  const handleEpisodeSelect = async (episodeId: string, episodeNumber: number) => {
    // Check if user data is available
    if (!userData) {
      toast.error('Please sign in to unlock episodes');
      return;
    }

    // Check if episode is already unlocked
    const isUnlocked = userData.unlocked_episodes?.includes(episodeId);
    
    if (isUnlocked) {
      // Episode is already unlocked, play immediately
      setCurrentEpisode(episodeId);
      window.location.href = `/watch/${drama.book_id}?episode=${episodeNumber}`;
      return;
    }

    // Check if user has sufficient credits
    if (userData.credits < 5) {
      toast.error('Saldo tidak cukup, silakan topup. Anda membutuhkan 5 credits.');
      return;
    }

    // Start unlock process
    setUnlockingEpId(episodeId);

    try {
      const response = await fetch('/api/user/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.uid,
          dramaId: drama.book_id,
          episodeId: episodeId,
          cost: 5
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local user data
        userData.credits = result.newBalance;
        userData.unlocked_episodes?.push(episodeId);
        userData.history?.push(`${drama.book_id}:${episodeId}`);

        setCurrentEpisode(episodeId);
        setStreamData({ video_url: `auto-play-ready` }); // Trigger video play
        toast.success(`Episode berhasil dibuka! -5 credits`);
      } else {
        toast.error(result.error || 'Failed to unlock episode');
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('Failed to unlock episode');
    } finally {
      setUnlockingEpId(null);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Video Player Area */}
      <div className="relative w-full aspect-video bg-black shadow-2xl">
        {streamData?.video_url ? (
          <video
            controls
            autoPlay
            className="w-full h-full"
            preload="metadata"
            poster={drama.thumbnail}
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
        
        {/* Floating Back Button */}
        <Link 
          href={`/search?q=${encodeURIComponent(drama.title)}`}
          className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 text-white p-2 rounded-lg transition-all hover:bg-zinc-800/80"
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
          {drama.episode_list?.map((ep: any) => {
            const isCurrentEpisode = ep.episode === parseInt(currentEpisode);
            const isUnlocked = userData?.unlocked_episodes?.includes(ep.id);
            const isUnlocking = unlockingEpId === ep.id;
            
            return (
              <button
                key={ep.id}
                onClick={() => handleEpisodeSelect(ep.id, ep.episode)}
                disabled={isUnlocking}
                className={`transition-all rounded-lg h-12 flex items-center justify-center font-medium text-sm relative ${
                  isCurrentEpisode
                    ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                    : isUnlocked
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {isUnlocking ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                ) : (
                  <>
                    {!isUnlocked && !isCurrentEpisode && (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>{ep.episode}</span>
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