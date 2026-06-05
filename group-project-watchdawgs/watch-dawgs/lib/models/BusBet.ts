import mongoose, { Schema, Document } from 'mongoose';

export interface IBusBet extends Document {
  userId: mongoose.Types.ObjectId;
  busId: string;
  predictedArrival: number;
  actualArrival?: number;
  points: number;
  status: 'pending' | 'completed';
  createdAt: Date;
}

const BusBetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    busId: { type: String, required: true },
    predictedArrival: { type: Number, required: true },
    actualArrival: { type: Number },
    points: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.BusBet || mongoose.model('BusBet', BusBetSchema);
