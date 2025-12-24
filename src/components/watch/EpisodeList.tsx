'use client'

import { useState, useEffect } from 'react'
import { Play, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Episode {
  episode: number
  title?: string
  watchHref: string
}

interface EpisodeListProps {
  currentEpisode: number
  totalEpisodes: number
  bookId: string
}

export default function EpisodeList({ currentEpisode, totalEpisodes, bookId }: EpisodeListProps) {
  const router = useRouter()
  const [visibleRange, setVisibleRange] = useState({ start: 1, end: 5 })

  useEffect(() => {
    if (currentEpisode > visibleRange.end - 2) {
      // Auto-show more episodes when approaching end of visible range
      setVisibleRange({ start: currentEpisode - 2, end: currentEpisode + 3 })
    }
  }, [currentEpisode])

  // Load more episodes
  const loadMore = () => {
    setVisibleRange((prev) => ({
      start: Math.max(1, prev.start - 5),
      end: Math.min(totalEpisodes, prev.end + 5),
    }))
  }

  // Load previous episodes
  const loadPrevious = () => {
    setVisibleRange((prev) => ({
      start: Math.max(1, prev.start - 5),
      end: Math.min(totalEpisodes, prev.end + 5),
    }))
  }

  const episodes: Episode[] = Array.from({ length: totalEpisodes }, (_, i) => ({
    episode: i + 1,
    title: `Episode ${i + 1}`,
    watchHref: `/watch/${bookId}/${i + 1}`,
  }))

  const visibleEpisodes = episodes.filter(
    (ep) => ep.episode >= visibleRange.start && ep.episode <= visibleRange.end
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Daftar Episode ({totalEpisodes})
        </h3>

        {visibleRange.start > 1 && (
          <button
            onClick={loadPrevious}
            className="flex items-center gap-1 px-3 py-1 rounded bg-surface hover:bg-neutral-800 transition-colors text-xs text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Sebelumnya
          </button>
        )}

        {visibleRange.end < totalEpisodes && (
          <button
            onClick={loadMore}
            className="flex items-center gap-1 px-3 py-1 rounded bg-surface hover:bg-neutral-800 transition-colors text-xs text-white"
          >
            Lebih Banyak
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Episode List */}
      <div className="space-y-2">
        {visibleEpisodes.map((episode) => (
          <button
            key={episode.episode}
            onClick={() => router.push(episode.watchHref)}
            className={`group flex items-center gap-3 w-full p-4 rounded-lg border border-neutral-800 bg-surface transition-all ${
              episode.episode === currentEpisode
                ? 'border-primary bg-primary/10'
                : 'hover:border-primary/50 hover:bg-neutral-800'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <span className="text-xs font-bold text-primary">{episode.episode}</span>
            </div>

            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                {episode.title}
              </p>
            </div>

            <Play className={`h-5 w-5 transition-colors ${
              episode.episode === currentEpisode
                ? 'text-primary'
                : 'text-text-muted group-hover:text-white'
            }`} />
          </button>
        ))}
      </div>
    </div>
  )
}
