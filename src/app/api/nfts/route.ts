// src/app/api/nfts/route.ts
import { NextResponse } from 'next/server';
import { mockDB } from '../../../services/mockData';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType');

    if (process.env.NODE_ENV === 'development') {
      // Return mock NFT data
      return NextResponse.json(mockDB.nfts);
    }

    // Add production logic here...

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
    const nftData = await req.json();

    if (process.env.NODE_ENV === 'development') {
      // Create mock NFT
      const newNFT = {
        id: Date.now(),
        tokenId: `HER-${Date.now().toString().slice(-6)}`,
        ...nftData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      mockDB.nfts.push(newNFT);
      return NextResponse.json(newNFT);
    }

    // Add production logic here...

  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
