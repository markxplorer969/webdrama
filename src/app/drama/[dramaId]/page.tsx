'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, List, Play, Pause, Volume2, Maximize2, Loader2, Calendar, Clock, Star, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';

interface DramaDetail {
  book_id: string;
  title: string;
  description: string;
  thumbnail: string;
  poster: string;
  upload_date: string;
  release_year: string;
  rating: string;
  duration: string;
  status: string;
  country: string;
  language: string;
  director: string;
  cast: string[];
  genres: string[];
  stats: {
    followers: string;
    total_episodes: string;
    views: string;
  };
  episode_list: Array<{
    episode: number;
    id: string;
    title: string;
    is_free: boolean;
  }>;
}

interface StreamData {
  book_id: string;
  episode: string;
  video_url: string;
}

export default function WatchDramaPage() {
  const params = useParams();
  const router = useRouter();
  const dramaId = params?.dramaId as string;

  const [drama, setDrama] = useState<DramaDetail | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDramaDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/drama/detail?bookId=${dramaId}`);
      const data = await response.json();
      
      if (data.success) {
        setDrama(data.data);
        if (data.data.episode_list && data.data.episode_list.length > 0) {
          setSelectedEpisode(data.data.episode_list[0].episode);
        }
      } else {
          setError(data.error || 'Failed to load drama details');
        }
    } catch (err) {
      setError('Failed to load drama details');
      console.error('Error fetching drama details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreamData = async () => {
    try {
      setStreamData(null);
      setError(null);
      const response = await fetch(`/api/stream?bookId=${dramaId}&episode=${selectedEpisode}`);
      const data = await response.json();
      
      if (data.success) {
        setStreamData(data.data);
      } else {
        setError(data.error || 'Failed to load episode');
      }
    } catch (err) {
      setError('Failed to load episode stream');
      console.error('Error fetching stream data:', err);
    }
  };

  const handleEpisodeSelect = (episode: number) => {
    setSelectedEpisode(episode);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    const video = document.getElementById('video-player') as HTMLVideoElement;
    if (video?.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  useEffect(() => {
    if (dramaId) {
      fetchDramaDetails();
    }
  }, [dramaId]);

  useEffect(() => {
    if (drama && selectedEpisode) {
      fetchStreamData();
    }
  }, [drama, selectedEpisode, dramaId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-zinc-950 pt-20">
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto" />
              <p className="text-white text-lg">Loading drama details...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-zinc-950 pt-20">
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-500 text-2xl">!</span>
              </div>
              <p className="text-white text-lg">{error}</p>
              <Link href="/">
                <Button className="bg-rose-500 hover:bg-rose-600">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!drama) {
    return null;
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-zinc-950 pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-8">
            
            <div className="relative w-full aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden">
              <Link href="/" className="absolute top-4 left-4 z-20">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="bg-black/20 backdrop-blur-md text-white hover:bg-black/40 border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
              
              {streamData?.video_url ? (
                <div className="relative w-full h-full">
                  <video
                    id="video-player"
                    className="w-full h-full"
                    controls={showControls}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={() => setShowControls(!showControls)}
                  >
                    <source src={streamData.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handlePlayPause}
                          className="text-white hover:text-rose-400"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:text-rose-400"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                      <Play className="w-8 h-8 text-rose-500" />
                    </div>
                    <p className="text-white text-lg">Loading episode...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-6 md:px-0 max-w-5xl mx-auto">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{drama.title}</h1>
                  
                  <div className="flex items-center gap-6 text-zinc-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>{drama.stats?.followers || '0'} Likes</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4 text-blue-500" />
                      <span>{drama.stats?.total_episodes || '0'} Episodes</span>
                    </div>
                    
                    {drama.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{drama.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {drama.description && (
                  <div className="border-l-2 border-rose-600/50 pl-4">
                    <p className="text-zinc-300 leading-relaxed">
                      {drama.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-6 md:px-0 max-w-5xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-rose-500" />
                  Select Episode
                </h3>
                
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {drama.episode_list?.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => handleEpisodeSelect(episode.episode)}
                      className={`relative aspect-square rounded-lg transition-all duration-200 ${
                        selectedEpisode === episode.episode
                          ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {episode.episode}
                      </span>
                      
                      {selectedEpisode === episode.episode && (
                        <div className="absolute inset-0 flex items-center justify-center bg-rose-600/90 rounded-lg">
                          <Play className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
}