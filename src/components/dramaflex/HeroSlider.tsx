'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { DramaflexVideo } from '@/services/dramaflex'

interface HeroSliderProps {
  videos: DramaflexVideo[]
}

export default function HeroSlider({ videos }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (videos.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, 5000) // Auto-slide every 5 seconds

    return () => clearInterval(interval)
  }, [videos.length])

  if (videos.length === 0) {
    return (
      <div className="relative h-[280px] w-full bg-surface">
        <div className="flex h-full items-center justify-center text-text-muted">
          <p>No trending content</p>
        </div>
      </div>
    )
  }

  const currentVideo = videos[currentIndex]

  return (
    <div className="relative h-[280px] w-full overflow-hidden bg-surface md:h-[400px]">
      {/* Slider Container */}
      <div className="relative h-full w-full">
        <Link href={`/watch/${currentVideo.bookId || currentVideo.id}`}>
          <div className="relative h-full w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={currentVideo.image || 'https://via.placeholder.com/800x600/141414/ffffff?text=Trending'}
                alt={currentVideo.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="gradient-overlay absolute inset-0" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="mb-2 line-clamp-2 text-xl font-bold text-white">
                {currentVideo.title}
              </h2>

              <div className="flex items-center gap-3">
                {currentVideo.episodes && (
                  <span className="text-sm text-text-secondary">
                    {currentVideo.episodes} Episode
                  </span>
                )}

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-white">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-16 right-4 flex gap-1.5">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
