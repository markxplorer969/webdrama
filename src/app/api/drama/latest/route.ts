import { NextRequest, NextResponse } from 'next/server';
import { getLatest } from '@/lib/services/dramabox';

export async function GET(request: NextRequest) {
  try {
    // Parse page parameter
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // Validate page parameter
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid page parameter' },
        { status: 400 }
      );
    }

    // Fetch latest dramas for the requested page with timeout
    const latestPromise = getLatest();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 25000)
    );

    const latest = await Promise.race([latestPromise, timeoutPromise]);

    return NextResponse.json({
      success: true,
      data: latest,
      page: page,
      hasMore: latest.length > 0 // Assume there's more if we got results
    });

  } catch (error) {
    console.error('Latest API error:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch latest dramas',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      page: 1,
      hasMore: false
    }, { status: 200 }); // Return 200 with error info instead of 500
  }
}