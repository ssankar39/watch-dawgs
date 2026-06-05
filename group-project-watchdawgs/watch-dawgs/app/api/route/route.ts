import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const mode = searchParams.get('mode') || 'transit'; // Default to transit

    console.log('Route request received:', { origin, destination, mode });

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Missing origin or destination' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key not found in environment');
      return NextResponse.json(
        { error: 'Missing Google Maps API key' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&mode=${encodeURIComponent(mode)}&key=${apiKey}`;

    console.log('Calling Google Maps API with mode:', mode);
    const res = await fetch(url);
    const data = await res.json();

    console.log('Google Maps response status:', data.status);
    console.log('Routes found:', data.routes?.length || 0);

    if (data.status !== 'OK') {
      console.error('Google Maps API error:', data.error_message);
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error('Route API error:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch route', details: err.message },
      { status: 500 }
    );
  }
}
