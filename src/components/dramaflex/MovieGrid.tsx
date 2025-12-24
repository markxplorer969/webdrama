'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Star } from 'lucide-react'
import { DramaflexVideo } from '@/services/dramaflex'

interface MovieGridProps {
  title: string
  videos: DramaflexVideo[]
}

export default function MovieGrid({ title, videos }: MovieGridProps) {
  if (videos.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="flex h-40 items-center justify-center text-text-muted">
          <p>No content available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="group relative overflow-hidden rounded-lg bg-surface"
          >
            {/* Poster Image */}
            <div className="relative aspect-poster w-full">
              <Image
                src={video.image || 'https://via.placeholder.com/300x450/141414/ffffff?text=No+Cover'}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 240px"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-primary/90 p-3 backdrop-blur-sm">
                  <Play className="h-6 w-6 fill-white text-white" />
                </div>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-medium text-white">4.8</span>
              </div>

              {/* Episode Count Badge */}
              {video.totalEpisodes && (
                <div className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 backdrop-blur-sm">
                  <span className="text-xs font-medium text-white">
                    {video.totalEpisodes} EP
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="p-3">
              <h4 className="line-clamp-2 text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                {video.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
