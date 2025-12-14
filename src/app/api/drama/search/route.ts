import { NextRequest, NextResponse } from 'next/server';
import { dramabox } from '@/lib/dramabox';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        query: query || ''
      });
    }

    const results = await dramabox.search(query.trim());

    return NextResponse.json({
      success: true,
      data: results,
      query: query.trim()
    });

  } catch (error) {
    console.error('Search API Error:', error);
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