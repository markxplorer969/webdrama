import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface VideoProgress {
  bookId: string;
  episode: number;
  title: string;
  poster: string;
  currentTime: number;
  duration: number;
  progress: number;
  updatedAt: any;
}

interface UseVideoProgressOptions {
  bookId: string;
  episode: number;
  title: string;
  poster: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useVideoProgress = ({
  bookId,
  episode,
  title,
  poster,
  videoRef
}: UseVideoProgressOptions) => {
  const { user } = useAuth();
  const lastSaveTimeRef = useRef<number>(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save progress to Firestore
  const saveProgress = useCallback(async (isPaused: boolean = false) => {
    if (!user || !videoRef.current) return;

    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;

    // Don't save if video hasn't started or duration is invalid
    if (!duration || duration <= 0 || currentTime <= 0) return;

    // Throttle: Save every 10 seconds OR when paused
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTimeRef.current;
    
    if (!isPaused && timeSinceLastSave < 10000) {
      return; // Don't save if less than 10 seconds and not paused
    }

    try {
      // Save to sub-collection: users/{uid}/history/{bookId}
      const progressRef = doc(db, 'users', user.uid, 'history', bookId);
      
      const progressData: VideoProgress = {
        bookId,
        episode,
        title,
        poster,
        currentTime,
        duration,
        progress: (currentTime / duration) * 100,
        updatedAt: serverTimestamp()
      };

      await setDoc(progressRef, progressData, { merge: true });
      
      lastSaveTimeRef.current = now;
      console.log('Progress saved:', {
        bookId,
        episode,
        progress: `${progressData.progress.toFixed(1)}%`,
        currentTime: `${currentTime.toFixed(1)}s`
      });
      
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  }, [user, bookId, episode, title, poster, videoRef]);

  // Handle time updates (throttled)
  const handleTimeUpdate = useCallback(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after 10 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(false); // Save every 10 seconds
    }, 10000);
  }, [saveProgress]);

  // Handle pause (immediate save)
  const handlePause = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveProgress(true); // Save immediately when paused
  }, [saveProgress]);

  // Handle video end (mark as completed)
  const handleEnded = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveProgress(true); // Save when video ends
  }, [saveProgress]);

  // Load saved progress
  const loadSavedProgress = useCallback(async (): Promise<VideoProgress | null> => {
    if (!user) return null;

    try {
      const { getDoc } = await import('firebase/firestore');
      const progressRef = doc(db, 'users', user.uid, 'history', bookId);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const data = progressDoc.data() as VideoProgress;
        console.log('Loaded saved progress:', {
          bookId,
          episode: data.episode,
          progress: `${data.progress.toFixed(1)}%`,
          currentTime: `${data.currentTime.toFixed(1)}s`
        });
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load video progress:', error);
      return null;
    }
  }, [user, bookId]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Cleanup function
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      
      // Clear any pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save final progress when component unmounts
      saveProgress(true);
    };
  }, [videoRef, handleTimeUpdate, handlePause, handleEnded, saveProgress]);

  return {
    saveProgress,
    loadSavedProgress,
    handleTimeUpdate,
    handlePause,
    handleEnded
  };
};