import { NextRequest, NextResponse } from 'next/server';
import { dramabox } from '@/lib/dramabox';
import { adminDb, serverTimestamp } from '@/lib/firebase-admin';

// Mock data for testing when scraper fails
const mockData = {
  trending: [
    {
      rank: "1",
      title: "The CEO's Secret Love",
      book_id: "mock123",
      image: "https://via.placeholder.com/300x400/ff6b6b/ffffff?text=CEO+Love",
      views: "1.2M",
      episodes: "120"
    },
    {
      rank: "2", 
      title: "My Billionaire Husband",
      book_id: "mock456",
      image: "https://via.placeholder.com/300x400/4ecdc4/ffffff?text=Billionaire",
      views: "980K",
      episodes: "85"
    },
    {
      rank: "3",
      title: "The Doctor's Fake Marriage",
      book_id: "mock789",
      image: "https://via.placeholder.com/300x400/45b7d1/ffffff?text=Doctor+Love",
      views: "756K", 
      episodes: "95"
    },
    {
      rank: "4",
      title: "My Mafia Boss Protector",
      book_id: "mock012",
      image: "https://via.placeholder.com/300x400/f39c12/ffffff?text=Mafia+Boss",
      views: "623K",
      episodes: "67"
    },
    {
      rank: "5",
      title: "The Professor's Student",
      book_id: "mock345",
      image: "https://via.placeholder.com/300x400/9b59b6/ffffff?text=Professor",
      views: "512K",
      episodes: "45"
    },
    {
      rank: "6",
      title: "Sweet Revenge of the Maid",
      book_id: "mock678",
      image: "https://via.placeholder.com/300x400/e74c3c/ffffff?text=Sweet+Revenge",
      views: "445K",
      episodes: "78"
    }
  ],
  latest: [
    {
      title: "Hati yang Tersesat Episode 120",
      book_id: "latest001",
      image: "https://via.placeholder.com/300x400/e74c3c/ffffff?text=Hati+Tersesat",
      views: "45K",
      episodes: "120"
    },
    {
      title: "Cinta Pertama Episode 89",
      book_id: "latest002", 
      image: "https://via.placeholder.com/300x400/3498db/ffffff?text=Cinta+Pertama",
      views: "38K",
      episodes: "89"
    },
    {
      title: "My Sweet Enemy Episode 156",
      book_id: "latest003",
      image: "https://via.placeholder.com/300x400/2ecc71/ffffff?text=Sweet+Enemy",
      views: "52K",
      episodes: "156"
    },
    {
      title: "The CEO's Twins Episode 201",
      book_id: "latest004",
      image: "https://via.placeholder.com/300x400/f1c40f/ffffff?text=CEO+Twins",
      views: "67K",
      episodes: "201"
    },
    {
      title: "My Guardian Angel Episode 98",
      book_id: "latest005",
      image: "https://via.placeholder.com/300x400/8e44ad/ffffff?text=Guardian+Angel",
      views: "41K",
      episodes: "98"
    }
  ]
};

// Helper function to clean and validate data
const cleanData = (data: any[]) => {
  return data.map(item => ({
    rank: item.rank || '',
    title: item.title || 'Unknown Title',
    book_id: item.book_id || '',
    image: item.image || '',
    views: item.views || '0',
    episodes: item.episodes || '0'
  })).filter(item => item.book_id && item.title); // Filter out items without essential data
};

export async function POST(request: NextRequest) {
  console.log('=== NEW SYNC VERSION ===');
  try {
    console.log('Starting content sync...');
    
    let result;
    
    try {
      // Try to scrape the website
      result = await dramabox.home();
      console.log('Scraper result:', { 
        trendingCount: result.trending?.length || 0, 
        latestCount: result.latest?.length || 0 
      });
    } catch (scraperError) {
      console.warn('Scraper failed, using mock data:', scraperError);
      // Use mock data if scraper fails
      result = mockData;
    }
    
    // Clean and validate the data
    const cleanTrending = cleanData(result.trending || []);
    const cleanLatest = cleanData(result.latest || []);
    
    console.log('Cleaned data:', { 
      trendingCount: cleanTrending.length, 
      latestCount: cleanLatest.length 
    });
    
    // Save to Firestore
    await adminDb.collection('content_cache').doc('home_v1').set({
      trending: cleanTrending,
      latest: cleanLatest,
      updatedAt: serverTimestamp()
    });

    console.log('Data saved to Firestore successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Content synced successfully',
      data: {
        trendingCount: cleanTrending.length,
        latestCount: cleanLatest.length,
        source: result === mockData ? 'mock' : 'scraper'
      }
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to sync content',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}