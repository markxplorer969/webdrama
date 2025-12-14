import { NextRequest, NextResponse } from 'next/server';
import { dramabox } from '@/lib/dramabox';

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

    // Fetch latest dramas for the requested page
    const latest = await dramabox.latest(page);

    return NextResponse.json({
      success: true,
      data: latest,
      page: page,
      hasMore: latest.length > 0 // Assume there's more if we got results
    });

  } catch (error) {
    console.error('Latest API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch latest dramas',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}