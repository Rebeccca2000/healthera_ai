// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear auth cookies
  response.cookies.delete('auth');
  response.cookies.delete('userRole');
  
  return response;
}
