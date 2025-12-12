import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Test Firestore connection by getting a sample document or listing collections
    const usersCollection = await adminDb.collection('users').limit(5).get();
    
    const users = usersCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      message: 'Firestore connection successful',
      userCount: usersCollection.size,
      sampleUsers: users,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Firestore test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uid, testData } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required' },
        { status: 400 }
      );
    }

    // Create a test user document
    const testDoc = {
      email: 'test@example.com',
      displayName: 'Test User',
      credits: 20,
      isVip: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...testData
    };

    await adminDb.collection('users').doc(uid).set(testDoc);

    return NextResponse.json({
      success: true,
      message: 'Test user document created successfully',
      uid,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Firestore test creation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}