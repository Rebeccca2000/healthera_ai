// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_CONFIG } from './config/urls';

// Add paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/',
  '/api/auth/login',
  '/api/auth/logout'
];

export function middleware(request: NextRequest) {
  // Remove basePath from the pathname for checking
  const pathname = request.nextUrl.pathname.replace(APP_CONFIG.baseUrl, '');
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get auth status from cookies
  const isAuthenticated = request.cookies.get('auth')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // Redirect to login if trying to access protected route
    const url = new URL(`${APP_CONFIG.baseUrl}/login`, request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && pathname === '/login') {
    // Redirect to appropriate dashboard if already logged in
    const redirectPath = userRole === 'lender' 
      ? `${APP_CONFIG.baseUrl}/lender-dashboard`
      : `${APP_CONFIG.baseUrl}/applicant-dashboard`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Role-based access control
  if (isAuthenticated && userRole) {
    if (pathname.startsWith('/lender-dashboard') && userRole !== 'lender') {
      return NextResponse.redirect(new URL(`${APP_CONFIG.baseUrl}/applicant-dashboard`, request.url));
    }
    if (pathname.startsWith('/applicant-dashboard') && userRole !== 'applicant') {
      return NextResponse.redirect(new URL(`${APP_CONFIG.baseUrl}/lender-dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /images/* (inside public directory)
     * 5. /favicon.ico, /site.webmanifest (static files)
     */
    '/((?!api/auth|_next|fonts|images|favicon.ico|site.webmanifest).*)',
  ],
};