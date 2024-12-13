// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const authCookie = request.cookies.get('auth')?.value;
  // If trying to access dashboard without auth cookie, redirect to home
  if (!authCookie && request.nextUrl.pathname.startsWith('/healthera_ai/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If accessing home with auth cookie, allow it
  if (authCookie && request.nextUrl.pathname === '/healthera_ai') {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/healthera_ai/dashboard/:path*', '/healthera_ai']
};