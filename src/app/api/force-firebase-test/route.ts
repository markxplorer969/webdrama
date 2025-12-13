import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import fs from 'fs';

export async function GET() {
  try {
    console.log("🔍 [Force Test] Forcing Firebase connection to dramaflex-38877...");
    
    // Force re-initialization with correct project
    if (admin.apps.length > 0) {
      console.log("🔄 [Force Test] Deleting existing Firebase apps...");
      admin.apps.forEach(app => app.delete());
    }
    
    // Read service account file
    const serviceAccountPath = './firebase-service-account.json';
    const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountData);
    
    // Initialize with service account
    admin.initializeApp({
      projectId: 'dramaflex-38877',
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log("✅ [Force Test] Firebase initialized with dramaflex-38877");
    
    const db = admin.firestore();
    
    // Test write operation
    console.log("💾 [Force Test] Testing write operation...");
    await db.collection('test').doc('connection').set({
      test: true,
      timestamp: new Date().toISOString(),
      project: 'dramaflex-38877'
    });
    
    // Test read operation
    console.log("🔎 [Force Test] Testing read operation...");
    const testDoc = await db.collection('test').doc('connection').get();
    console.log(`📄 [Force Test] Test document exists: ${testDoc.exists}`);
    
    // Check collections
    console.log("📚 [Force Test] Listing collections...");
    const collections = await db.listCollections();
    console.log(`📊 [Force Test] Found ${collections.length} collections:`, collections.map(c => c.id));
    
    return NextResponse.json({
      success: true,
      message: "Firebase force test completed",
      data: {
        projectId: 'dramaflex-38877',
        testDocExists: testDoc.exists,
        collectionsCount: collections.length,
        collections: collections.map(c => c.id),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error("❌ [Force Test] Firebase test failed:", error);
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