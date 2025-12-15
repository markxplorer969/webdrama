import { NextRequest, NextResponse } from 'next/server';
import { adminDb, serverTimestamp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, dramaId, episodeId, cost = 5 } = body;

    // Validate required fields
    if (!uid || !dramaId || !episodeId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'uid, dramaId, and episodeId are required'
        },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          message: 'User account not found'
        },
        { status: 404 }
      );
    }

    const userData = userDoc.data() as any;
    const currentCredits = userData.credits || 0;

    // Check if user has sufficient credits
    if (currentCredits < cost) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'insufficient_funds',
          message: `Saldo tidak cukup. Anda membutuhkan ${cost} credits, saldo Anda: ${currentCredits}`,
          currentBalance: currentCredits,
          required: cost
        },
        { status: 402 }
      );
    }

    // Process unlock with COMPOSITE KEY SYSTEM (Backward Compatible)
    const newBalance = currentCredits - cost;
    const unlockedEpisodes = userData.unlocked_episodes || [];
    const history = userData.history || [];
    
    // CRITICAL FIX: Create composite key for drama-specific unlocks
    const unlockKey = `${dramaId}_${episodeId}`;
    
    // Check if episode is already unlocked with composite key OR old format
    const isAlreadyUnlocked = unlockedEpisodes.includes(unlockKey) || 
                           unlockedEpisodes.includes(episodeId);
    
    if (isAlreadyUnlocked) {
      return NextResponse.json({
        success: true,
        message: 'Episode already unlocked',
        dramaId,
        episodeId,
        alreadyUnlocked: true,
        unlockKey // Return the composite key for reference
      });
    }

    // Update user document with composite key
    await userRef.update({
      credits: newBalance,
      unlocked_episodes: [...unlockedEpisodes, unlockKey],
      history: [...history, `${dramaId}:${episodeId}`],
      lastUnlockedAt: serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      message: `Episode berhasil dibuka! -${cost} credits`,
      dramaId,
      episodeId,
      cost,
      previousBalance: currentCredits,
      newBalance
    });

  } catch (error) {
    console.error('Unlock API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to unlock episode',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}