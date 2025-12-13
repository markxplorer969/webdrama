import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/api/auth'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );
  
  // Allow access to static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Get session from cookie
  const session = request.cookies.get('session')?.value;
  
  // If user is not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and trying to access login page
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Verify session for protected routes
  if (session && !isPublicRoute) {
    try {
      await adminAuth.verifyIdToken(session);
    } catch (error) {
      // Token is invalid, clear session and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('session', '', {
        httpOnly: true,
        secure: false, // Development mode
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};