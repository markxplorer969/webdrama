'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Play, Loader2, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SmartPlayerProps {
  videoUrl?: string;
  poster?: string;
  episodeId?: string;
  dramaTitle?: string;
  episodeNumber?: number;
}

export default function SmartPlayer({ 
  videoUrl, 
  poster, 
  episodeId, 
  dramaTitle, 
  episodeNumber 
}: SmartPlayerProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
        console.log('User detected:', user.uid);
      } else {
        setCurrentUserId(null);
        console.log('No user detected');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto-play video when videoUrl changes
  useEffect(() => {
    if (videoUrl && videoRef.current && isUnlocked) {
      // Auto-play when video is unlocked and URL changes
      videoRef.current.play().catch(error => {
        console.log('Auto-play failed:', error);
        // Auto-play might be blocked by browser, that's okay
      });
    }
  }, [videoUrl, isUnlocked]);

  // Handle unlock action
  const handleUnlock = async () => {
    if (!currentUserId) {
      // Redirect to login if no user
      router.push('/login');
      return;
    }

    setIsUnlocking(true);
    
    try {
      // Call server action to deduct credit
      const response = await fetch('/api/drama/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          episodeId,
          dramaTitle,
          episodeNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsUnlocked(true);
        console.log('Episode unlocked successfully');
      } else {
        console.error('Failed to unlock episode:', result.error);
        // Handle error (show toast, alert, etc.)
        alert(result.error || 'Failed to unlock episode. Please try again.');
      }
    } catch (error) {
      console.error('Error unlocking episode:', error);
      alert('An error occurred while unlocking the episode. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full bg-slate-900 border-slate-800">
        <CardContent className="p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-violet-500" />
              <p className="text-slate-400">Loading player...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State A: Not Logged In
  if (!currentUserId) {
    return (
      <Card className="w-full bg-slate-900 border-slate-800">
        <CardContent className="p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Content Restricted
              </h3>
              <p className="text-slate-400 mb-6">
                Please login to watch this episode
              </p>
              <Button 
                onClick={() => router.push('/login')}
                className="bg-violet-600 hover:bg-violet-700 text-white"
                size="lg"
              >
                🔒 Login untuk Nonton
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State B: Logged In but Locked
  if (!isUnlocked) {
    return (
      <Card className="w-full bg-slate-900 border-slate-800">
        <CardContent className="p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-24 h-24 bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-12 h-12 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Unlock Episode
              </h3>
              <p className="text-slate-400 mb-6">
                {dramaTitle && episodeNumber && (
                  <>Watch {dramaTitle} Episode {episodeNumber}</>
                )}{' '}
                for just 1 coin
              </p>
              <Button 
                onClick={handleUnlock}
                disabled={isUnlocking}
                className="bg-violet-600 hover:bg-violet-700 text-white"
                size="lg"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    🔒 Buka Episode (1 Koin)
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State C: Unlocked - Show Video Player
  return (
    <Card className="w-full bg-slate-900 border-slate-800">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          {videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full rounded-lg"
              controls
              poster={poster}
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Video not available</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Episode Info */}
        {(dramaTitle || episodeNumber) && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {dramaTitle && episodeNumber 
                    ? `${dramaTitle} - Episode ${episodeNumber}`
                    : dramaTitle || 'Unknown Episode'
                  }
                </h3>
                <p className="text-sm text-slate-400">
                  Unlocked and ready to watch
                </p>
              </div>
              <div className="flex items-center text-green-400">
                <Play className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Unlocked</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}