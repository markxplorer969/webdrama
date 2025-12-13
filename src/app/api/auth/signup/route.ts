import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  let createdUserUid: string | null = null;

  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Step A: Create User in Firebase Authentication using Admin SDK
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || '',
    });

    createdUserUid = userRecord.uid; // Track created user for potential rollback

    // Step B: Create a document in Firestore collection 'users' with ID = uid
    const userDoc = {
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      credits: 20, // Give 20 free credits to new users
      isVip: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('users').doc(userRecord.uid).set(userDoc);

    // Create session cookie directly
    const sessionCookie = await adminAuth.createSessionCookie(userRecord.uid, {
      expiresIn: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    const response = NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      },
      message: 'Account created successfully with 20 free credits!',
    });

    // Set session cookie
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: false, // Development mode
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Signup error:', error);

    // Step D: Rollback - If we created an auth user but failed to create Firestore document,
    // delete the auth user to avoid "ghost users"
    if (createdUserUid && error.message && !error.message.includes('auth/')) {
      try {
        console.warn('Firestore creation failed, rolling back auth user:', createdUserUid);
        await adminAuth.deleteUser(createdUserUid);
        console.info('Successfully rolled back auth user:', createdUserUid);
      } catch (rollbackError) {
        console.error('Failed to rollback auth user:', rollbackError);
        // In production, you might want to log this for manual cleanup
      }
    }

    // Handle specific Firebase errors
    let errorMessage = 'Failed to create account';
    let statusCode = 500;

    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email is already registered';
      statusCode = 409;
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak (minimum 6 characters)';
      statusCode = 400;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      statusCode = 400;
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password accounts are not enabled';
      statusCode = 503;
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