import { notFound } from 'next/navigation'
import { getDetail, getStream, DramaflexDetail, DramaflexVideo } from '@/services/dramaflex'
import VideoPlayer from '@/components/watch/VideoPlayer'
import InteractionOverlay from '@/components/watch/InteractionOverlay'
import CommentSection from '@/components/watch/CommentSection'
import { incrementView } from '@/lib/actions'
import { Eye } from 'lucide-react'

interface WatchPageProps {
  params: {
    bookId: string
  }
}

async function getVideoData(bookId: string) {
  try {
    const [detailResult, streamResult] = await Promise.all([
      getDetail(bookId),
      getStream(bookId, 1),
    ])

    if (!detailResult.success || !streamResult.success) {
      return null
    }

    const detail = detailResult.data
    const stream = streamResult.data

    if (!detail || !stream) {
      return null
    }

    // Map to DramaflexVideo format
    const video: DramaflexVideo = {
      id: detail.book_id || bookId,
      bookId: detail.book_id || bookId,
      title: detail.title || 'Untitled',
      image: detail.image || '',
      description: detail.description || '',
      category: detail.category || '',
      episodes: detail.episodes?.length || 0,
      status: detail.status || '',
      views: detail.views || 0,
    }

    return {
      detail: {
        ...detail,
        episodes: detail.episodes || [],
      },
      stream,
      video,
    }
  } catch (error) {
    console.error('Error fetching video data:', error)
    return null
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { bookId } = params
  const data = await getVideoData(bookId)

  if (!data) {
    notFound()
  }

  // Increment view count
  await incrementView(bookId)

  const { detail, stream, video } = data

  // Get current episode (default to episode 1)
  // In production, you'd get this from URL params

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background pb-20 lg:pb-0">
      {/* Mobile Layout - Immersive Fullscreen */}
      <div className="flex-1 lg:hidden">
        {/* Video Player - Fullscreen */}
        <div className="relative h-screen bg-black">
          <VideoPlayer
            src={stream.streamUrl}
            poster={video.image}
            autoPlay={true}
          />

          {/* Like/Share Overlay */}
          <InteractionOverlay bookId={bookId} />

          {/* Description Overlay - Bottom Left */}
          <div className="absolute bottom-4 left-4 right-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className="space-y-2 px-4 py-4">
              <h1 className="text-xl font-bold text-white line-clamp-2">
                {video.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Eye className="h-4 w-4" />
                <span>{video.views || 0} ditonton</span>
                <span>• {video.episodes} Episode</span>
              </div>
              {video.description && (
                <p className="text-sm text-text-secondary line-clamp-3">
                  {video.description}
                </p>
              )}
            </div>
          </div>

          {/* Comment Button - Bottom Right */}
          <div className="absolute bottom-4 right-4">
            <CommentSection bookId={bookId} commentsCount={0} />
          </div>
        </div>
      </div>

      {/* Desktop Layout - Split View */}
      <div className="hidden lg:flex w-[240px] border-r border-neutral-800 bg-[#141414] flex-col">
        {/* Video Player Section */}
        <div className="sticky top-0">
          <div className="relative aspect-video bg-black">
            <VideoPlayer
              src={stream.streamUrl}
              poster={video.image}
              autoPlay={true}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">
              {video.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{video.views || 0} ditonton</span>
              </div>
              <span>• {video.episodes} Episode</span>
            </div>

            {video.description && (
              <p className="text-base text-text-secondary">
                {video.description}
              </p>
            )}

            {/* Episode List */}
            <div className="border-t border-neutral-800 pt-6">
              {/* Episode list would be here */}
              <p className="text-center text-text-secondary">
                Daftar episode akan muncul di sini...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
