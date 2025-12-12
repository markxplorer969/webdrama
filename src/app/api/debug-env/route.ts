import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("🔍 [Env Debug] Checking environment variables...");
    
    const envVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      FIREBASE_PRIVATE_KEY_EXISTS: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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