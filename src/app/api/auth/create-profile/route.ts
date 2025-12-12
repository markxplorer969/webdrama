import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, displayName, uid } = await request.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: 'Email and UID are required' },
        { status: 400 }
      );
    }

    // Create a document in Firestore collection 'users' with ID = uid
    const userDoc = {
      email: email,
      displayName: displayName || '',
      credits: 20, // Give 20 free credits to new users
      isVip: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating user document in Firestore:', userDoc);
    
    // Use real Firestore
    await adminDb.collection('users').doc(uid).set(userDoc);
    console.log('✅ User document created successfully in Firestore for UID:', uid);
    
    // Verify it was created by reading it back
    const createdDoc = await adminDb.collection('users').doc(uid).get();
    console.log('✅ Verification - Document exists:', createdDoc.exists);
    console.log('✅ Verification - Document data:', createdDoc.data());

    return NextResponse.json({
      success: true,
      message: 'User profile created successfully with 20 free credits!',
      user: {
        uid,
        email,
        displayName: displayName || '',
        credits: 20,
        isVip: false,
      }
    });

  } catch (error: any) {
    console.error('❌ User profile creation error:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);

    let errorMessage = 'Failed to create user profile';
    let statusCode = 500;

    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Check Firestore rules.';
      statusCode = 403;
    } else if (error.code === 'not-found') {
      errorMessage = 'User not found in authentication.';
      statusCode = 404;
    } else if (error.message && error.message.includes('Firestore')) {
      errorMessage = 'Failed to create user profile. Please try again.';
      statusCode = 500;
    }

    return NextResponse.json(
      { error: errorMessage, code: error.code },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all users from Firestore...');
    
    // Get all users from Firestore
    const usersSnapshot = await adminDb.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach((doc) => {
      if (doc.exists) {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    
    console.log('✅ Retrieved', users.length, 'users from Firestore');
    
    return NextResponse.json({
      success: true,
      message: 'Users retrieved successfully from Firestore',
      count: users.length,
      users
    });

  } catch (error: any) {
    console.error('❌ Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}