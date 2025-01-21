// src/app/api/loans/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/loans - Get all loans
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userType = searchParams.get('userType');
    const userId = searchParams.get('userId');

    let query = `
      SELECT l.*, u.user_type, me.name as equipment_name, me.token_id
      FROM loans l
      JOIN users u ON l.applicant_id = u.user_id
      LEFT JOIN medical_equipment me ON l.loan_id = me.loan_id
    `;

    if (userType === 'Applicant') {
      query += ' WHERE l.applicant_id = $1';
    } else if (userType === 'Lender') {
      query += ` 
        WHERE l.loan_id IN (
          SELECT loan_id FROM loan_contributions 
          WHERE lender_id = $1
        )
      `;
    }

    const result = await pool.query(query, [userId]);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/loans - Create new loan
export async function POST(req: Request) {
  try {
    const { 
      applicantId, 
      amount, 
      purpose,
      equipmentDetails 
    } = await req.json();

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create loan
      const loanResult = await client.query(`
        INSERT INTO loans (applicant_id, loan_amount, interest_rate, status)
        VALUES ($1, $2, $3, $4)
        RETURNING loan_id
      `, [applicantId, amount, 6.99, 'Pending']);

      const loanId = loanResult.rows[0].loan_id;

      // Create equipment NFT record
      await client.query(`
        INSERT INTO medical_equipment (
          loan_id, name, description, verified
        )
        VALUES ($1, $2, $3, $4)
      `, [loanId, equipmentDetails.name, equipmentDetails.description, false]);

      await client.query('COMMIT');

      return NextResponse.json({ 
        success: true, 
        loanId 
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}