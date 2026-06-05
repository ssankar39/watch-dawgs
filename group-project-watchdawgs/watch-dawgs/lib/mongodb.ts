import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/watchdawgs';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as any).mongoose as CachedConnection;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    console.log('📍 Database:', cached.conn.connection.db.databaseName); // ADD THIS
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
    };

    console.log('Creating new MongoDB connection...');
    console.log('MONGODB_URI:', MONGODB_URI.substring(0, 50) + '...');
    console.log('Full URI (masked):', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // ADD THIS to see the full URI

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        console.log('📍 Connected to database:', mongoose.connection.db.databaseName); // ADD THIS
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;