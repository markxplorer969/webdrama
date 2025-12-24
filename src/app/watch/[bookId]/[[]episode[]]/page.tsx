import { getDetail, getStream, DramaflexDetail, DramaflexStream } from '@/services/dramaflex'
import VideoPlayer from '@/components/watch/VideoPlayer'
import InteractionOverlay from '@/components/watch/InteractionOverlay'
import CommentSection from '@/components/watch/CommentSection'
import EpisodeList from '@/components/watch/EpisodeList'
import { incrementView } from '@/lib/actions'

interface EpisodePageProps {
  params: {
    bookId: string
    episode: string
  }
}

async function getVideoData(bookId: string, episode: string) {
  try {
    const [detailResult, streamResult] = await Promise.all([
      getDetail(bookId),
      getStream(bookId, parseInt(episode)),
    ])

    if (!detailResult.success || !streamResult.success) {
      return null
    }

    const detail = detailResult.data
    const stream = streamResult.data

    if (!detail || !stream) {
      return null
    }

    return {
      detail,
      stream,
    }
  } catch (error) {
    console.error('Error fetching video data:', error)
    return null
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { bookId, episode } = params
  const data = await getVideoData(bookId, episode)

  if (!data) {
    notFound()
  }

  // Increment view count
  await incrementView(bookId)

  const { detail, stream } = data

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background pb-20 lg:pb-0">
      {/* Mobile Layout - Immersive Fullscreen */}
      <div className="flex-1 lg:hidden">
        {/* Video Player - Fullscreen */}
        <div className="relative h-screen bg-black">
          <VideoPlayer
            src={stream.streamUrl}
            poster={detail.image}
            autoPlay={true}
          />

          {/* Like/Share Overlay */}
          <InteractionOverlay bookId={bookId} />

          {/* Description Overlay - Bottom Left */}
          <div className="absolute bottom-4 left-4 right-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className="space-y-2 px-4 py-4">
              <h1 className="text-xl font-bold text-white line-clamp-2">
                {detail.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                Episode {episode} dari {detail.episodes?.length || 0}
              </div>
              {detail.description && (
                <p className="text-sm text-text-secondary line-clamp-3">
                  {detail.description}
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
      <div className="hidden lg:flex w-[240px] border-r border-neutral-800 bg-[#141414] flex-col overflow-y-auto">
        {/* Video Player Section */}
        <div className="sticky top-0">
          <div className="relative aspect-video bg-black">
            <VideoPlayer
              src={stream.streamUrl}
              poster={detail.image}
              autoPlay={true}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">
              {detail.title}
            </h1>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  Episode {episode}
                </div>
                <span>•</span>
                <span>{detail.episodes?.length || 0} Episode Tersedia</span>
              </div>

              {detail.description && (
                <p className="text-base text-text-secondary">
                  {detail.description}
                </p>
              )}
            </div>

            {/* Episode List */}
            <div className="border-t border-neutral-800 pt-6">
              <EpisodeList
                currentEpisode={parseInt(episode)}
                totalEpisodes={detail.episodes?.length || 0}
                bookId={bookId}
              />
            </div>

            {/* Comment Section */}
            <div className="border-t border-neutral-800 pt-6">
              <CommentSection bookId={bookId} commentsCount={0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
