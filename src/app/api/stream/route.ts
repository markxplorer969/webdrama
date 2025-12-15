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

    // Fetch stream URL
    const streamData = await dramabox.stream(bookId, episode);

    return NextResponse.json({
      success: true,
      data: streamData,
      bookId: bookId,
      episode: episode
    });

  } catch (error) {
    console.error('Stream API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get stream URL',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}