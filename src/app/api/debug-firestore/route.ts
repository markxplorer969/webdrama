import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    console.log("🔍 [Debug] Checking Firestore connection...");
    
    if (!adminDb) {
      return NextResponse.json({
        success: false,
        error: "Firebase Admin not initialized"
      }, { status: 500 });
    }

    // Check connection
    console.log("🔍 [Debug] Testing Firestore read...");
    const testDoc = await adminDb.collection('test').doc('connection').get();
    console.log(`📄 [Debug] Test doc exists: ${testDoc.exists}`);

    // List all collections
    console.log("🔍 [Debug] Listing collections...");
    const collections = await adminDb.listCollections();
    console.log(`📚 [Debug] Found ${collections.length} collections:`, collections.map(c => c.id));

    // Check contents collection with more details
    console.log("🔍 [Debug] Checking contents collection...");
    const contentsSnapshot = await adminDb.collection('contents').get();
    console.log(`📄 [Debug] Contents collection has ${contentsSnapshot.size} documents`);
    
    // List all document IDs
    const documentIds = [];
    contentsSnapshot.forEach(doc => {
      documentIds.push(doc.id);
      console.log(`📝 [Debug] Document ID: ${doc.id}, Data:`, {
        title: doc.data()?.title,
        hasData: Object.keys(doc.data() || {}).length > 0
      });
    });

    // Get specific drama details
    const dramaId = '41000122939';
    console.log(`🔍 [Debug] Getting specific drama: ${dramaId}`);
    const dramaDoc = await adminDb.collection('contents').doc(dramaId).get();
    
    if (dramaDoc.exists) {
      const dramaData = dramaDoc.data();
      console.log(`📊 [Debug] Drama found:`, dramaData?.title);
      
      // Check episodes subcollection
      const episodesSnapshot = await adminDb
        .collection('contents')
        .doc(dramaId)
        .collection('episodes')
        .get();
      
      console.log(`🎬 [Debug] Episodes found: ${episodesSnapshot.size}`);
      
      // List episode IDs
      const episodeIds = [];
      episodesSnapshot.forEach(ep => {
        episodeIds.push(ep.id);
      });
      
      return NextResponse.json({
        success: true,
        message: "Data verified in Firestore",
        data: {
          collections: collections.map(c => c.id),
          contentsCount: contentsSnapshot.size,
          allDocumentIds: documentIds,
          drama: {
            id: dramaId,
            title: dramaData?.title,
            exists: true,
            episodesCount: episodesSnapshot.size,
            episodeIds: episodeIds,
            lastSync: dramaData?.lastSyncAt,
            fullData: dramaData
          }
        }
      });
    } else {
      console.log(`❌ [Debug] Drama not found: ${dramaId}`);
      return NextResponse.json({
        success: false,
        message: "Drama not found in Firestore",
        data: {
          dramaId,
          exists: false,
          allDocumentIds: documentIds
        }
      });
    }

  } catch (error) {
    console.error("❌ [Debug] Firestore check failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        code: error.code,
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
}