'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (currentTime: number) => void
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  onPlay,
  onPause,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      videoRef.current.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return
    setIsMuted(!isMuted)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen().catch(console.error)
    }
  }

  // Update time
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      video.currentTime = 0
      setCurrentTime(0)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onTimeUpdate])

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="relative w-full bg-black" onClick={togglePlayPause}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-contain"
      />

      {/* Controls Overlay (minimal - only shows when paused or on hover) */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 ${
          !isPlaying ? 'bg-black/60' : 'opacity-0 hover:opacity-100 bg-black/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls - Time */}
        <div className="flex items-center gap-2">
          <div className="rounded bg-black/50 px-3 py-1 text-xs text-white">
            {formatTime(currentTime)}
          </div>
          <div className="flex-1">
            <div className="h-1 bg-white/30 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
          <div className="rounded bg-black/50 px-3 py-1 text-xs text-white">
            {formatTime(duration)}
          </div>
        </div>

        {/* Bottom Controls - Play/Pause, Volume, Fullscreen */}
        <div className="flex items-center justify-center gap-4">
          {/* Volume */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 hover:bg-white/20 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-primary hover:bg-primary-hover transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white fill-white" />
            ) : (
              <Play className="h-8 w-8 text-white fill-white" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/50 hover:bg-white/20 transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6 text-white" />
            ) : (
              <Maximize className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
