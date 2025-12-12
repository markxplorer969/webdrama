import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    console.log("🔍 [Real-time] Checking latest Firestore data...");
    
    // Get all documents sorted by lastSync
    const contentsSnapshot = await adminDb
      .collection('contents')
      .orderBy('lastSyncAt', 'desc')
      .limit(10)
      .get();
    
    console.log(`📊 [Real-time] Found ${contentsSnapshot.size} recent documents`);
    
    const recentDramas = [];
    contentsSnapshot.forEach(doc => {
      const data = doc.data();
      recentDramas.push({
        id: doc.id,
        title: data?.title || 'No Title',
        episodes: data?.episode_list?.length || 0,
        lastSync: data?.lastSyncAt,
        hasValidData: !!(data?.title === '' && data?.episode_list?.length === 0)
      });
    });
    
    return NextResponse.json({
      success: true,
      message: "Real-time Firestore data retrieved",
      data: {
        totalDocuments: contentsSnapshot.size,
        recentDramas: recentDramas,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error("❌ [Real-time] Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}