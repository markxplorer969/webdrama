import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear session cookie
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: false, // Development mode
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}