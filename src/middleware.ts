// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// src/middleware.ts
export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth')?.value;
  const isRootPath = request.nextUrl.pathname === '/healthera_ai' || request.nextUrl.pathname === '/';
  
  // Add a small delay before redirecting
  if (authCookie && isRootPath) {
    const userRole = request.cookies.get('userRole')?.value;
    const response = NextResponse.next();
    
    if (userRole === 'lender') {
      response.headers.set('Location', '/lender-dashboard');
      response.headers.set('Refresh', '0.1;url=/lender-dashboard');
      return response;
    } else if (userRole === 'applicant') {
      response.headers.set('Location', '/applicant-dashboard');
      response.headers.set('Refresh', '0.1;url=/applicant-dashboard');
      return response;
    }
  }

  // If trying to access dashboard without auth cookie, redirect to home
  if (!authCookie && (
    request.nextUrl.pathname.startsWith('/lender-dashboard') ||
    request.nextUrl.pathname.startsWith('/applicant-dashboard')
  )) {
    return NextResponse.redirect(new URL('/healthera_ai', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/healthera_ai',
    '/',
    '/lender-dashboard/:path*', 
    '/applicant-dashboard/:path*'
  ]
};