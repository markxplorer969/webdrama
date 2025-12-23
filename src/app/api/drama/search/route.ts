import { NextRequest, NextResponse } from 'next/server';
import { searchDramas } from '@/lib/services/dramabox';

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

    // Fetch search results with timeout
    const searchPromise = searchDramas(query.trim());
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 25000)
    );

    const results = await Promise.race([searchPromise, timeoutPromise]);

    return NextResponse.json({
      success: true,
      query: query.trim(),
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to search dramas',
      message: error instanceof Error ? error.message : 'Unknown error',
      query: query?.trim() || '',
      data: [],
      count: 0
    }, { status: 200 }); // Return 200 with error info instead of 500
  }
}