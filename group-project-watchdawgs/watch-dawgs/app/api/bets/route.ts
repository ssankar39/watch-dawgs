import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BusBet from '@/lib/models/BusBet';

// GET user bets
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const bets = await BusBet.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ bets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch bets' },
      { status: 500 }
    );
  }
}

// POST new bet
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, busId, predictedArrival } = await request.json();

    if (!userId || !busId || !predictedArrival) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bet = new BusBet({
      userId,
      busId,
      predictedArrival,
      status: 'pending',
    });

    await bet.save();

    return NextResponse.json(
      { message: 'Bet placed successfully', bet },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to place bet' },
      { status: 500 }
    );
  }
}
