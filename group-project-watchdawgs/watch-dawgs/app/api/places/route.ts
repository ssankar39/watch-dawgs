import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Location from '@/lib/models/Location';

// GET user places
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
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}

// POST new place
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, name, address, latitude, longitude, type } = await request.json();

    if (!userId || !name || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, address, latitude, longitude' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['home', 'work', 'other'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: home, work, other' },
        { status: 400 }
      );
    }

    const location = new Location({
      userId,
      name,
      address,
      latitude,
      longitude,
      type: type || 'other',
    });

    await location.save();

    return NextResponse.json(
      { message: 'Place saved successfully', location },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving place:', error);
    return NextResponse.json(
      { error: 'Failed to save place' },
      { status: 500 }
    );
  }
}
