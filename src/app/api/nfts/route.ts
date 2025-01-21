// src/app/api/nfts/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Add this line to enable dynamic API routes in static exports
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType');

    let query = `
      SELECT me.*, l.status as loan_status
      FROM medical_equipment me
      LEFT JOIN loans l ON me.loan_id = l.loan_id
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
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { 
      userId,
      equipmentName,
      equipmentType,
      description,
      images
    } = await req.json();

    const result = await pool.query(`
      INSERT INTO medical_equipment (
        name,
        description,
        verified,
        token_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      equipmentName,
      description,
      false,
      'HER-' + Date.now().toString().slice(-6)
    ]);

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}