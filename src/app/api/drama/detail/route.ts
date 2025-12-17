import { NextRequest, NextResponse } from 'next/server';

// Mock data untuk fallback
const mockDetailData = {
  "sample1": {
    book_id: "sample1",
    title: "Sample Drama Title",
    description: "This is a sample drama description for testing purposes. The story follows a young protagonist who faces various challenges in their life journey.",
    thumbnail: "https://via.placeholder.com/300x450?text=Sample+Drama",
    upload_date: "2024-01-15",
    stats: {
      followers: "125K",
      total_episodes: "24"
    },
    episode_list: [
      { episode: 1, id: "ep1" },
      { episode: 2, id: "ep2" },
      { episode: 3, id: "ep3" }
    ],
    genres: ["Romance", "Drama", "Comedy"],
    status: "Ongoing"
  }
};

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

    // Try to use dramabox library with timeout
    try {
      const { dramabox } = await import('@/lib/dramabox');
      const detailPromise = dramabox.detail(bookId.trim());
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
      );

      const detail = await Promise.race([detailPromise, timeoutPromise]);
      
      return NextResponse.json({
        success: true,
        data: detail,
        bookId: bookId.trim()
      });
    } catch (scrapeError) {
      console.warn('Dramabox scraping failed, using fallback:', scrapeError.message);
      
      // Fallback to mock data
      const mockData = mockDetailData[bookId.trim()] || mockDetailData["sample1"];
      
      return NextResponse.json({
        success: true,
        data: mockData,
        bookId: bookId.trim(),
        fallback: true
      });
    }
  } catch (error) {
    console.error('Detail API error:', error);
    
    // Return fallback data on error
    const mockData = mockDetailData[bookId?.trim() || ''] || mockDetailData["sample1"];
    
    return NextResponse.json({
      success: false,
      error: 'Service temporarily unavailable',
      message: 'Please try again later',
      data: mockData,
      bookId: bookId?.trim() || '',
      fallback: true
    }, { status: 200 }); // Return 200 with fallback data
  }
}