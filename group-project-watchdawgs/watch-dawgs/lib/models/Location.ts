import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'other';
  createdAt: Date;
}

const LocationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
