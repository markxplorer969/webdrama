import { getTrending, getLatest, DramaflexVideo } from '@/services/dramaflex'
import HeroSlider from '@/components/dramaflex/HeroSlider'
import MovieGrid from '@/components/dramaflex/MovieGrid'
import BottomNav from '@/components/dramaflex/BottomNav'
import { Loader2 } from 'lucide-react'

async function getTrendingVideos(): Promise<DramaflexVideo[]> {
  try {
    const result = await getTrending()
    console.log('Trending full result:', JSON.stringify(result, null, 2))

    if (result.success && result.data) {
      console.log('Trending result.data type:', typeof result.data)
      console.log('Trending result.data is array:', Array.isArray(result.data))

      // Handle different response formats
      let videos: any[] = []

      // Case 1: Data is already an array
      if (Array.isArray(result.data)) {
        videos = result.data
      }
      // Case 2: Data is nested in a 'data' property
      else if (result.data && typeof result.data === 'object' && 'data' in result.data) {
        videos = (result.data as any).data || []
      }
      // Case 3: Data is in a 'data' property but at root
      else if (Array.isArray(result.data)) {
        videos = result.data
      }

      console.log('Trending processed videos count:', videos.length)
      console.log('Sample trending video:', videos[0] ? JSON.stringify(videos[0], null, 2) : 'No videos')

      // Map to DramaflexVideo format
      return videos.map((video: any) => ({
        id: video.book_id || video.id || Math.random().toString(),
        bookId: video.book_id || video.id || Math.random().toString(),
        title: video.title || video.name || 'Untitled',
        image: video.image || 'https://via.placeholder.com/300x450/141414/ffffff?text=No+Image',
        description: video.description || '',
        category: video.category || '',
        episodes: video.episodes || 0,
        status: video.status || '',
        views: video.views || 0,
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching trending videos:', error)
    return []
  }
}

async function getLatestVideos(): Promise<DramaflexVideo[]> {
  try {
    const result = await getLatest()
    console.log('Latest full result:', JSON.stringify(result, null, 2))

    if (result.success && result.data) {
      console.log('Latest result.data type:', typeof result.data)
      console.log('Latest result.data is array:', Array.isArray(result.data))

      // Handle different response formats
      let videos: any[] = []

      // Case 1: Data is already an array
      if (Array.isArray(result.data)) {
        videos = result.data
      }
      // Case 2: Data is nested in a 'data' property
      else if (result.data && typeof result.data === 'object' && 'data' in result.data) {
        videos = (result.data as any).data || []
      }
      // Case 3: Data is in a 'data' property but at root
      else if (Array.isArray(result.data)) {
        videos = result.data
      }

      console.log('Latest processed videos count:', videos.length)
      console.log('Sample latest video:', videos[0] ? JSON.stringify(videos[0], null, 2) : 'No videos')

      // Map to DramaflexVideo format
      return videos.map((video: any) => ({
        id: video.book_id || video.id || Math.random().toString(),
        bookId: video.book_id || video.id || Math.random().toString(),
        title: video.title || video.name || 'Untitled',
        image: video.image || 'https://via.placeholder.com/300x450/141414/ffffff?text=No+Image',
        description: video.description || '',
        category: video.category || '',
        episodes: video.episodes || 0,
        status: video.status || '',
        views: video.views || 0,
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching latest videos:', error)
    return []
  }
}

export default async function HomePage() {
  // Parallel data fetching with Promise.all
  const [trendingVideos, latestVideos] = await Promise.all([
    getTrendingVideos(),
    getLatestVideos(),
  ])

  console.log('Trending videos count:', trendingVideos.length)
  console.log('Latest videos count:', latestVideos.length)

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Hero Slider - Trending */}
      {trendingVideos.length > 0 && <HeroSlider videos={trendingVideos.slice(0, 5)} />}

      <div className="space-y-8 px-4 py-6">
        {/* Latest Drops Section */}
        {latestVideos.length > 0 && (
          <MovieGrid title="Terbaru" videos={latestVideos} />
        )}

        {/* Show loading indicator if no data */}
        {trendingVideos.length === 0 && latestVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-text-secondary">Memuat konten...</p>
          </div>
        )}
      </div>
    </div>
  )
}
