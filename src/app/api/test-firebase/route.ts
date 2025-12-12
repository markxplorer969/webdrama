import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Test basic Firestore connection
    const testDoc = {
      test: 'Hello from Firestore',
      timestamp: new Date().toISOString()
    };
    
    await adminDb.collection('test').doc('connection').set(testDoc);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      data: testDoc
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: 'Firebase connection failed'
    }, { status: 500 });
  }
}