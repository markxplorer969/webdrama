import { NextRequest, NextResponse } from 'next/server';
import { getEpisodeStream, getBestVideoUrl } from '@/lib/services/dramabox';

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

    // Fetch episode stream data directly
    const episodeStreamData = await getEpisodeStream(bookId, episode);
    
    if (!episodeStreamData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Episode stream not found',
          message: `Unable to load stream for episode ${episode} of drama ${bookId}`
        },
        { status: 404 }
      );
    }

    // Get best video URL for this episode
    const videoUrl = getBestVideoUrl(episodeStreamData);

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
      chapterId: episodeStreamData.chapterId,
      chapterName: episodeStreamData.chapterName,
      qualities: episodeStreamData.cdnList?.[0]?.videoPathList || []
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