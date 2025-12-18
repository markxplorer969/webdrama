import { NextRequest, NextResponse } from 'next/server';
import { getDramaDetails, getBestVideoUrl, type DramaDetails } from '@/lib/services/dramabox';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const episode = searchParams.get('episode');

    // Validate parameters
    if (!bookId || !episode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book ID and Episode are required',
          message: 'Please provide both bookId and episode parameters'
        },
        { status: 400 }
      );
    }

    // Fetch drama details with episodes
    const dramaData = await getDramaDetails(bookId);
    
    if (!dramaData || !dramaData.episodes || dramaData.episodes.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Drama not found or no episodes available',
          message: 'Unable to load episode data'
        },
        { status: 404 }
      );
    }

    // Find the specific episode
    const episodeIndex = parseInt(episode) - 1; // Convert to 0-based index
    const episodeData = dramaData.episodes[episodeIndex];

    if (!episodeData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Episode not found',
          message: `Episode ${episode} is not available`
        },
        { status: 404 }
      );
    }

    // Get the best video URL for this episode
    const videoUrl = getBestVideoUrl(episodeData);

    if (!videoUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Video URL not available',
          message: 'Unable to get video stream for this episode'
        },
        { status: 404 }
      );
    }

    // Return stream data in expected format
    const streamData = {
      book_id: bookId,
      episode: episode,
      video_url: videoUrl,
      chapterId: episodeData.chapterId,
      chapterName: episodeData.chapterName,
      qualities: episodeData.cdnList?.[0]?.videoPathList || []
    };

    return NextResponse.json({
      success: true,
      data: streamData,
      bookId: bookId,
      episode: episode
    });

  } catch (error) {
    console.error('Stream API error:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to get stream URL',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      bookId: bookId || '',
      episode: episode || ''
    }, { status: 200 }); // Return 200 with error info instead of 500
  }
}
