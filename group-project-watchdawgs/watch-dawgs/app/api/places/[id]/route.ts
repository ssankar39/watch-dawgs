import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Location from '@/lib/models/Location';

// DELETE a place
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Place deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting place:', error);
    return NextResponse.json(
      { error: 'Failed to delete place' },
      { status: 500 }
    );
  }
}

// UPDATE a place
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const updates = await request.json();

    // Validate type if provided
    if (updates.type && !['home', 'work', 'other'].includes(updates.type)) {
      return NextResponse.json(
        { error: 'Type must be one of: home, work, other' },
        { status: 400 }
      );
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedLocation) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Place updated successfully', location: updatedLocation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating place:', error);
    return NextResponse.json(
      { error: 'Failed to update place' },
      { status: 500 }
    );
  }
}
