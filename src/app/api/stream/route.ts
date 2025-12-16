import { NextRequest, NextResponse } from 'next/server';
import { dramabox } from '@/lib/dramabox';

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

    // Fetch stream URL with timeout
    const streamPromise = dramabox.stream(bookId, episode);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 25000)
    );

    const streamData = await Promise.race([streamPromise, timeoutPromise]);

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