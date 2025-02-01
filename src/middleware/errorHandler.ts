import { NextResponse } from 'next/server';

export function handleApiError(error: any) {
  console.error('API Error:', error);

  if (error.code === 'ECONNREFUSED') {
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 503 }
    );
  }

  if (error.code === '23505') { // PostgreSQL unique violation
    return NextResponse.json(
      { error: 'Duplicate entry' },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}