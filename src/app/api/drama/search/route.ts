import { NextRequest, NextResponse } from 'next/server';

// Mock data untuk fallback
const mockSearchResults = [
  {
    title: "Sample Drama 1",
    book_id: "sample1",
    image: "https://via.placeholder.com/300x400?text=Sample+Drama+1",
    views: "1.2M",
    episodes: "12"
  },
  {
    title: "Sample Drama 2", 
    book_id: "sample2",
    image: "https://via.placeholder.com/300x400?text=Sample+Drama+2",
    views: "800K",
    episodes: "8"
  }
];

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

    // Try to use dramabox library with timeout
    try {
      const { dramabox } = await import('@/lib/dramabox');
      const searchPromise = dramabox.search(query.trim());
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
      );

      const results = await Promise.race([searchPromise, timeoutPromise]);
      
      return NextResponse.json({
        success: true,
        query: query.trim(),
        data: results,
        count: results.length
      });
    } catch (scrapeError) {
      console.warn('Dramabox scraping failed, using fallback:', scrapeError.message);
      
      // Fallback to mock data
      const filteredResults = mockSearchResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      
      return NextResponse.json({
        success: true,
        query: query.trim(),
        data: filteredResults,
        count: filteredResults.length,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Search API error:', error);
    
    // Return fallback data on error
    const filteredResults = mockSearchResults.filter(item => 
      item.title.toLowerCase().includes(query?.toLowerCase() || '')
    );
    
    return NextResponse.json({
      success: false,
      error: 'Search temporarily unavailable',
      message: 'Please try again later',
      query: query?.trim() || '',
      data: filteredResults,
      fallback: true
    }, { status: 200 }); // Return 200 with fallback data
  }
}