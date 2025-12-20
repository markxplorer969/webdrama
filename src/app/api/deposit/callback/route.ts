import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb, serverTimestamp } from '@/lib/firebase-admin';

interface CallbackData {
  id?: string; // Provider transaction ID
  reff_id?: string; // Our reference ID
  status?: string; // success, failed, cancel
  amount?: number; // Confirmed amount
  message?: string; // Provider message
  signature?: string; // Security signature
  ip?: string; // Client IP
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.ATLANTIC_API_KEY;
    if (!apiKey) {
      console.error('ATLANTIC_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse callback data
    let callbackData: CallbackData;
    
    // Try to parse as JSON first
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        callbackData = await request.json();
      } else {
        // Fallback to form data
        const formData = await request.formData();
        callbackData = Object.fromEntries(formData.entries());
      }
    } catch (parseError) {
      console.error('Failed to parse callback data:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid callback data' },
        { status: 400 }
      );
    }

    const { id, reff_id, status, amount, message, signature, ip } = callbackData;

    // Validate required fields
    if (!id || !reff_id || !status) {
      console.error('Missing required fields in callback');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Security: Verify signature if provided
    if (signature) {
      const expectedSignature = crypto
        .createHash('md5')
        .update(`${id}${apiKey}`)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid signature:', {
          received: signature,
          expected: expectedSignature,
          id,
          apiKey: apiKey.substring(0, 8) + '...'
        });
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    console.log('Processing callback:', {
      id,
      reff_id,
      status,
      amount,
      message,
      ip
    });

    // Retrieve deposit document from Firestore
    const depositDoc = await adminDb.collection('deposits').doc(reff_id).get();
    
    if (!depositDoc.exists) {
      console.error('Deposit not found for reff_id:', reff_id);
      return NextResponse.json(
        { success: false, error: 'Deposit not found' },
        { status: 404 }
      );
    }

    const depositData = depositDoc.data();
    const userId = depositData.userId;

    if (!userId) {
      console.error('User ID not found in deposit record');
      return NextResponse.json(
        { success: false, error: 'User ID not found' },
        { status: 400 }
      );
    }

    // Update deposit record
    const updateData: any = {
      status: status.toLowerCase(),
      updatedAt: serverTimestamp(),
      callbackReceivedAt: serverTimestamp(),
    };

    // Add additional fields if available
    if (amount) {
      updateData.confirmedAmount = amount;
    }
    if (message) {
      updateData.providerMessage = message;
    }
    if (ip) {
      updateData.callbackIp = ip;
    }

    // If status is success, update user balance
    if (status.toLowerCase() === 'success') {
      updateData.completedAt = serverTimestamp();
      
      // Add credits to user's wallet
      const userDocRef = adminDb.collection('users').doc(userId);
      await userDocRef.update({
        credits: adminDb.FieldValue.increment(amount || 0),
        lastDepositAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('Successfully added credits to user:', {
        userId,
        amount,
        reff_id,
      });
    }

    // Update deposit document
    await adminDb.collection('deposits').doc(reff_id).update(updateData);

    console.log('Callback processed successfully:', {
      reff_id,
      status,
      amount,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
      reff_id,
      status,
      amount,
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
      );
  }
}