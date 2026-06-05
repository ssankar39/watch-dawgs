import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Incident from '@/lib/models/Incident';

// GET single incident
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const incident = await Incident.findById(id);
    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ incident }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
}

// UPDATE incident
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const { location, type, severity, description } = await request.json();

    const incident = await Incident.findByIdAndUpdate(
      id,
      { location, type, severity, description },
      { new: true, runValidators: true }
    );

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Incident updated', incident },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}

// DELETE incident
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const incident = await Incident.findByIdAndDelete(id);
    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Incident deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    );
  }
}
