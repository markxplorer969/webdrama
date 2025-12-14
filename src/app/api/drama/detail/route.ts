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

    // Fetch drama details
    const detail = await dramabox.detail(bookId.trim());

    return NextResponse.json({
      success: true,
      data: detail,
      bookId: bookId.trim()
    });

  } catch (error) {
    console.error('Detail API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch drama details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}