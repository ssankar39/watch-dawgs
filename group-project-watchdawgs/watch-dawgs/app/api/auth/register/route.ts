import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('Register endpoint called');
    await dbConnect();
    console.log('Database connected');

    const { email, password, name } = await request.json();
    console.log('Request data received:', { email, name, passwordLength: password?.length });

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing fields validation failed');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log('Existing user check:', existingUser ? 'User exists' : 'User does not exist');
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log('Password hashed');

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    console.log('User object created, attempting to save...');
    await user.save();
    console.log('User saved to database:', user._id);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
