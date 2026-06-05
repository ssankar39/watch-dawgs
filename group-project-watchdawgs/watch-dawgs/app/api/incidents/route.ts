import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Incident from '@/lib/models/Incident';

// GET all incidents or filter by severity
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const location = searchParams.get('location');

    let query: any = {};
    if (severity) query.severity = severity;
    if (location) query.location = { $regex: location, $options: 'i' };

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ incidents }, { status: 200 });
  } catch (error: any) {
    console.error('Get incidents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

// POST new incident
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { location, type, severity, description, author, authorId } =
      await request.json();

    // Validate input
    if (!location || !type || !severity || !description || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const incident = new Incident({
      location,
      type,
      severity,
      description,
      author,
      authorId,
    });

    await incident.save();

    return NextResponse.json(
      { message: 'Incident created successfully', incident },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create incident error:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
}
