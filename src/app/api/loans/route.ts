// src/app/api/loans/route.ts
import { NextResponse } from 'next/server';
import { mockDB } from '../../../services/mockData';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userType = searchParams.get('userType');
    const userId = searchParams.get('userId');

    if (process.env.NODE_ENV === 'development') {
      // Return mock loan data
      const loans = Object.values(mockDB.loans);
      
      if (userType === 'applicant') {
        return NextResponse.json(
          loans.filter(loan => loan.applicant.id === userId)
        );
      }
      
      // For lenders, return all available loans
      return NextResponse.json(loans);
    }

    // Add production logic here...

  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const loanData = await req.json();

    if (process.env.NODE_ENV === 'development') {
      // Create mock loan
      const newLoan = {
        id: Date.now(),
        ...loanData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      mockDB.loans[newLoan.id] = newLoan;
      return NextResponse.json(newLoan);
    }

    // Add production logic here...

  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
