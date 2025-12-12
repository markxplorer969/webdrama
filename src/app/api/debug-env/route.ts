import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    firebase_project_id: process.env.FIREBASE_PROJECT_ID,
    firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL,
    has_private_key: !!process.env.FIREBASE_PRIVATE_KEY,
    private_key_length: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
  });
}