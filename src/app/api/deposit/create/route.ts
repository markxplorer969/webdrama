import { NextRequest, NextResponse } from 'next/server';
import { adminDb, serverTimestamp } from '@/lib/firebase-admin';

interface CreateDepositRequest {
  amount: number;
  userId: string;
}

interface AtlanticCreateResponse {
  success: boolean;
  data?: {
    id: string; // Provider Transaction ID
    qr_string: string;
  };
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateDepositRequest = await request.json();
    const { amount, userId } = body;

    // Validate input
    if (!amount || !userId) {
      return NextResponse.json(
        { success: false, error: 'Amount and userId are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
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

    // Generate unique reference ID
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const reffId = `DEP-${timestamp}-${randomSuffix}`;

    // Prepare request to Atlantic H2H
    const formData = new URLSearchParams();
    formData.append('api_key', apiKey);
    formData.append('reff_id', reffId);
    formData.append('nominal', amount.toString());
    formData.append('type', 'ewallet');
    formData.append('method', 'qris');

    console.log('Creating deposit with reff_id:', reffId, 'amount:', amount);

    // Call Atlantic H2H API
    const atlanticResponse = await fetch('https://atlantich2h.com/deposit/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!atlanticResponse.ok) {
      console.error('Atlantic API error:', atlanticResponse.status, atlanticResponse.statusText);
      return NextResponse.json(
        { success: false, error: 'Failed to create deposit transaction' },
        { status: 500 }
      );
    }

    const atlanticData: AtlanticCreateResponse = await atlanticResponse.json();

    if (!atlanticData.success || !atlanticData.data) {
      console.error('Atlantic API returned error:', atlanticData);
      return NextResponse.json(
        { success: false, error: atlanticData.message || 'Failed to create deposit' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const depositData = {
      reffId,
      providerId: atlanticData.data.id,
      userId,
      amount,
      status: 'pending',
      qrContent: atlanticData.data.qr_string,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await adminDb.collection('deposits').doc(reffId).set(depositData);

    console.log('Deposit created successfully:', {
      reffId,
      providerId: atlanticData.data.id,
      userId,
      amount,
    });

    return NextResponse.json({
      success: true,
      qr_content: atlanticData.data.qr_string,
      reff_id: reffId,
      provider_id: atlanticData.data.id,
    });

  } catch (error) {
    console.error('Deposit creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}