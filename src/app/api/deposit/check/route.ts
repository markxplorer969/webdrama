import { NextRequest, NextResponse } from 'next/server';
import { adminDb, serverTimestamp } from '@/lib/firebase-admin';

interface CheckDepositRequest {
  reffId: string;
}

interface AtlanticStatusResponse {
  success: boolean;
  data?: {
    status: string;
    amount?: number;
    message?: string;
  };
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CheckDepositRequest = await request.json();
    const { reffId } = body;

    // Validate input
    if (!reffId) {
      return NextResponse.json(
        { success: false, error: 'Reference ID is required' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.ATLANTIC_API_KEY;
    if (!apiKey) {
      console.error('ATLANTIC_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Retrieve deposit document from Firestore
    const depositDoc = await adminDb.collection('deposits').doc(reffId).get();
    
    if (!depositDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Deposit not found' },
        { status: 404 }
      );
    }

    const depositData = depositDoc.data();
    const providerId = depositData.providerId;

    if (!providerId) {
      return NextResponse.json(
        { success: false, error: 'Provider ID not found in deposit record' },
        { status: 400 }
      );
    }

    console.log('Checking deposit status for reff_id:', reffId, 'provider_id:', providerId);

    // Prepare request to Atlantic H2H
    const formData = new URLSearchParams();
    formData.append('api_key', apiKey);
    formData.append('id', providerId); // IMPORTANT: Send providerId, not reffId

    // Call Atlantic H2H API
    const atlanticResponse = await fetch('https://atlantich2h.com/deposit/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!atlanticResponse.ok) {
      console.error('Atlantic API error:', atlanticResponse.status, atlanticResponse.statusText);
      return NextResponse.json(
        { success: false, error: 'Failed to check deposit status' },
        { status: 500 }
      );
    }

    const atlanticData: AtlanticStatusResponse = await atlanticResponse.json();

    if (!atlanticData.success) {
      console.error('Atlantic API returned error:', atlanticData);
      return NextResponse.json(
        { success: false, error: atlanticData.message || 'Failed to check deposit status' },
        { status: 400 }
      );
    }

    // Update deposit document in Firestore based on provider response
    const newStatus = atlanticData.data?.status || 'unknown';
    const updateData: any = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };

    // Add additional fields if available
    if (atlanticData.data?.amount) {
      updateData.confirmedAmount = atlanticData.data.amount;
    }

    if (atlanticData.data?.message) {
      updateData.providerMessage = atlanticData.data.message;
    }

    // If status is success, mark as completed
    if (newStatus.toLowerCase() === 'success') {
      updateData.completedAt = serverTimestamp();
    }

    await adminDb.collection('deposits').doc(reffId).update(updateData);

    console.log('Deposit status updated:', {
      reffId,
      providerId,
      oldStatus: depositData.status,
      newStatus,
      confirmedAmount: atlanticData.data?.amount,
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
      amount: atlanticData.data?.amount,
      message: atlanticData.data?.message,
      reff_id: reffId,
      provider_id: providerId,
    });

  } catch (error) {
    console.error('Deposit status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}