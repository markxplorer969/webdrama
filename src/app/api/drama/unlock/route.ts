import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { userId, episodeId, dramaTitle, episodeNumber } = await request.json();

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!episodeId) {
      return NextResponse.json(
        { success: false, error: 'Episode ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔓 [Unlock] User ${userId} trying to unlock episode ${episodeId}`);

    // Get user document from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const currentCredits = userData?.credits || 0;

    // Check if user has enough credits
    if (currentCredits < 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient credits. You need at least 1 coin to unlock this episode.',
          currentCredits 
        },
        { status: 400 }
      );
    }

    // Check if episode is already unlocked
    const unlockRecord = await adminDb
      .collection('unlocked_episodes')
      .where('userId', '==', userId)
      .where('episodeId', '==', episodeId)
      .limit(1)
      .get();

    if (!unlockRecord.empty) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Episode already unlocked',
          alreadyUnlocked: true
        },
        { status: 400 }
      );
    }

    // Perform transaction: deduct credit and unlock episode
    const batch = adminDb.batch();

    // Deduct 1 credit from user
    const userRef = adminDb.collection('users').doc(userId);
    batch.update(userRef, {
      credits: currentCredits - 1,
      updatedAt: new Date().toISOString()
    });

    // Create unlock record
    const unlockRef = adminDb.collection('unlocked_episodes').doc();
    const unlockData = {
      userId,
      episodeId,
      dramaTitle: dramaTitle || 'Unknown Drama',
      episodeNumber: episodeNumber || null,
      unlockedAt: new Date().toISOString(),
      cost: 1
    };
    batch.set(unlockRef, unlockData);

    // Commit the transaction
    await batch.commit();

    console.log(`✅ [Unlock] Successfully unlocked episode ${episodeId} for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Episode unlocked successfully!',
      newCreditBalance: currentCredits - 1,
      unlockData
    });

  } catch (error) {
    console.error('❌ [Unlock] Error unlocking episode:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to unlock episode. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}