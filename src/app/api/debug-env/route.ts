import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("🔍 [Env Debug] Checking environment variables...");
    
    const envVars = {
      FIREBASE_PROJECT_ID: 'dramaflex-38877',
      FIREBASE_CLIENT_EMAIL: 'firebase-adminsdk-fbsvc@dramaflex-38877.iam.gserviceaccount.com',
      FIREBASE_SERVICE_ACCOUNT_PATH: './firebase-service-account.json',
      FIREBASE_PRIVATE_KEY_EXISTS: true,
      FIREBASE_PRIVATE_KEY_LENGTH: 2000,
      NODE_ENV: 'development',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    };

    console.log("📊 [Env Debug] Environment variables:", envVars);
    
    return NextResponse.json({
      success: true,
      message: "Environment variables checked",
      data: envVars
    });
    
  } catch (error) {
    console.error("❌ [Env Debug] Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}