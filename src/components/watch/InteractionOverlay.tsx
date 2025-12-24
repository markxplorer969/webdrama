'use client'

import { useState } from 'react'
import { Heart, Share2 } from 'lucide-react'

interface InteractionOverlayProps {
  bookId: string
  initialLiked?: boolean
}

export default function InteractionOverlay({ bookId, initialLiked = false }: InteractionOverlayProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isSharing, setIsSharing] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    // Like state toggled locally
    // Server action would be called here in production
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Tonton di Dramaflex',
          url: window.location.href,
          text: 'Tonton short drama seru di Dramaflex!',
        })
      } else {
        navigator.clipboard?.writeText(window.location.href)
        alert('Link berhasil disalin!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
      {/* Share Button */}
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors"
        title="Bagikan"
      >
        {isSharing ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
        ) : (
          <Share2 className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Like Button */}
      <button
        onClick={handleLike}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors"
        title="Sukai"
      >
        {isLiked ? (
          <Heart className="h-5 w-5 fill-white" />
        ) : (
          <Heart className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  )
}
