import mongoose, { Schema } from 'mongoose';

export interface ScanLogType extends mongoose.Document {
  _id: string;
  user_id: string;
  product_id: string;
  scanned_at: Date;
  location: string;
  warranty_expires_at: Date | null;
}

const scanLogSchema = new Schema<ScanLogType>({
  user_id: { type: String, required: true },
  product_id: { type: String, required: true },
  scanned_at: { type: Date, default: Date.now },
  location: { type: String, required: false },
  warranty_expires_at: { type: Date, default: null },
}, { timestamps: true });

export const ScanLogModel = mongoose.model<ScanLogType>('ScanLog', scanLogSchema); 