import mongoose, { Schema, Document } from 'mongoose';

export interface IBusLocation extends Document {
  busId: string;
  latitude: number;
  longitude: number;
  route: string;
  destination: string;
  lastUpdated: Date;
}

const BusLocationSchema = new Schema(
  {
    busId: { type: String, required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    route: { type: String, required: true },
    destination: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.BusLocation || mongoose.model('BusLocation', BusLocationSchema);
