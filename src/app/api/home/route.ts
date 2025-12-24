import { NextResponse } from 'next/server';
import { getTrending, getLatest } from '@/lib/services/dramabox';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Try to get fresh data from new API first
    let trending = [];
    let latest = [];
    
    try {
      // Fetch fresh data with timeout
      const trendingPromise = getTrending();
      const latestPromise = getLatest();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 25000)
      );

      [trending, latest] = await Promise.all([
        Promise.race([trendingPromise, timeoutPromise]),
        Promise.race([latestPromise, timeoutPromise])
      ]);
    } catch (apiError) {
      console.warn('Failed to fetch fresh data, falling back to cache:', apiError);
      
      // Fallback to cached content from Firestore
      const doc = await adminDb.collection('content_cache').doc('home_v1').get();
      
      if (doc.exists) {
        const data = doc.data();
        trending = data?.trending || [];
        latest = data?.latest || [];
      }
    }

    return NextResponse.json({
      trending,
      latest,
      updatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      }
    });

  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json(
      { 
        trending: [],
        latest: [],
        error: 'Failed to fetch content'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate'
        }
      }
    );
  }
}