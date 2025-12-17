import { NextRequest, NextResponse } from 'next/server';

// Mock data untuk fallback
const mockLatestData = [
  {
    title: "Trending Drama 1",
    book_id: "trending1",
    image: "https://via.placeholder.com/300x400?text=Trending+1",
    views: "2.1M",
    episodes: "24"
  },
  {
    title: "Popular Drama 2",
    book_id: "popular2", 
    image: "https://via.placeholder.com/300x400?text=Popular+2",
    views: "1.8M",
    episodes: "16"
  },
  {
    title: "New Release 3",
    book_id: "new3",
    image: "https://via.placeholder.com/300x400?text=New+3",
    views: "950K",
    episodes: "12"
  }
];

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

    // Try to use dramabox library with timeout
    try {
      const { dramabox } = await import('@/lib/dramabox');
      const latestPromise = dramabox.latest(page);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
      );

      const latest = await Promise.race([latestPromise, timeoutPromise]);
      
      return NextResponse.json({
        success: true,
        data: latest,
        page: page,
        hasMore: latest.length > 0
      });
    } catch (scrapeError) {
      console.warn('Dramabox scraping failed, using fallback:', scrapeError.message);
      
      // Fallback to mock data with pagination
      const startIndex = (page - 1) * 3;
      const endIndex = startIndex + 3;
      const paginatedResults = mockLatestData.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: paginatedResults,
        page: page,
        hasMore: endIndex < mockLatestData.length,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Latest API error:', error);
    
    // Return fallback data on error
    const startIndex = (page - 1) * 3;
    const endIndex = startIndex + 3;
    const paginatedResults = mockLatestData.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: false,
      error: 'Service temporarily unavailable',
      message: 'Please try again later',
      data: paginatedResults,
      page: page,
      hasMore: false,
      fallback: true
    }, { status: 200 }); // Return 200 with fallback data
  }
}