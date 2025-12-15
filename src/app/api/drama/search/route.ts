import { NextRequest, NextResponse } from 'next/server';
import { dramabox } from '@/lib/dramabox';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate query parameter
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Query parameter is required',
          message: 'Please provide a search keyword'
        },
        { status: 400 }
      );
    }

    // Fetch search results
    const results = await dramabox.search(query.trim());

    return NextResponse.json({
      success: true,
      query: query.trim(),
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search dramas',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}