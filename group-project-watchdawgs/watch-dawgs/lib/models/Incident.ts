import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  location: string;
  type: 'traffic' | 'accident' | 'construction' | 'hazard' | 'event' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  author: string;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema(
  {
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['traffic', 'accident', 'construction', 'hazard', 'event', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    description: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);
