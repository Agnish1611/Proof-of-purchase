import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface CampaignType extends mongoose.Document {
  id: string;
  title: string;
  brand: string;
  required_skus: string[];
  scan_count_required: number;
  reward_tokens: number;
  start_time: Date;
  end_time: Date;
  status: 'active' | 'inactive';
}

const campaignSchema = new Schema<CampaignType>({
  id: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  required_skus: { type: [String], required: true },
  scan_count_required: { type: Number, required: true },
  reward_tokens: { type: Number, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true },
}, { timestamps: true });

export const CampaignModel = mongoose.model<CampaignType>('Campaign', campaignSchema); 