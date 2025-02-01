// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

type TestCredentials = {
  [email: string]: {
    password: string;
    type: string;
    id: string;
  }
};

const TEST_CREDENTIALS: TestCredentials = {
  'lender@healthera.ai': {
    password: 'lender0101',
    type: 'lender',
    id: '1'
  },
  'applicant@healthera.ai': {
    password: 'applicant0101',
    type: 'applicant',
    id: '2'
  }
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = email.toLowerCase().trim();
    
    const user = TEST_CREDENTIALS[normalizedEmail];
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Valid credentials - create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: normalizedEmail,
        type: user.type
      }
    });

    // Set auth cookies with explicit path
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/healthera_ai'  // Set explicit path
    });

    response.cookies.set('userRole', user.type, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/healthera_ai'  // Set explicit path
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}