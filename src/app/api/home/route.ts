import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Get cached content from Firestore
    const doc = await adminDb.collection('content_cache').doc('home_v1').get();
    
    if (doc.exists) {
      const data = doc.data();
      return NextResponse.json({
        trending: data?.trending || [],
        latest: data?.latest || [],
        updatedAt: data?.updatedAt || null
      }, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate'
        }
      });
    } else {
      // Return empty arrays if no cached data exists
      return NextResponse.json({
        trending: [],
        latest: [],
        updatedAt: null
      }, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate'
        }
      });
    }
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