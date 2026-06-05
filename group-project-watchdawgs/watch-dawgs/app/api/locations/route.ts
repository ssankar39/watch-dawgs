import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Location from '@/lib/models/Location';

// GET user locations
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

    const locations = await Location.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ locations }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

// POST new location
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, name, latitude, longitude, type } = await request.json();

    if (!userId || !name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const location = new Location({
      userId,
      name,
      latitude,
      longitude,
      type: type || 'other',
    });

    await location.save();

    return NextResponse.json(
      { message: 'Location saved', location },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to save location' },
      { status: 500 }
    );
  }
}
