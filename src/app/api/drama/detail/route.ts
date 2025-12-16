import { NextRequest, NextResponse } from 'next/server';
import { dramabox } from '@/lib/dramabox';

export async function GET(request: NextRequest) {
  try {
    // Parse bookId parameter
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    // Validate bookId parameter
    if (!bookId || bookId.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book ID parameter is required',
          message: 'Please provide a valid drama ID'
        },
        { status: 400 }
      );
    }

    // Fetch drama details with timeout
    const detailPromise = dramabox.detail(bookId.trim());
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 25000)
    );

    const detail = await Promise.race([detailPromise, timeoutPromise]);

    return NextResponse.json({
      success: true,
      data: detail,
      bookId: bookId.trim()
    });

  } catch (error) {
    console.error('Detail API error:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch drama details',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      bookId: bookId?.trim() || ''
    }, { status: 200 }); // Return 200 with error info instead of 500
  }
}