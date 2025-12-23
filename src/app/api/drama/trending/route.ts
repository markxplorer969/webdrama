import { NextRequest, NextResponse } from 'next/server';
import { getTrending } from '@/lib/services/dramabox';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch trending dramas from external API
    const trendingDramas = await getTrending();

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = trendingDramas.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      page,
      hasMore: endIndex < trendingDramas.length
    });
  } catch (error) {
    console.error('Error fetching trending dramas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending dramas' },
      { status: 500 }
    );
  }
}