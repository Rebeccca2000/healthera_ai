// src/app/api/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Development environment active',
        timestamp: new Date().toISOString()
      });
    }

    // Add production database connection test here...

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}