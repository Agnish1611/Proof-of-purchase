import mongoose from 'mongoose';

const CampaignProgressSchema = new mongoose.Schema(
  {
    user_wallet: {
      type: String, // store Solana public key (base58 string)
      required: true,
      index: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    scan_count: {
      type: Number,
      default: 0,
    },
    scanned_skus: [
      {
        type: String,
      },
    ],
    last_scanned_at: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure a user can have only one progress record per campaign
CampaignProgressSchema.index({ user_wallet: 1, campaign: 1 }, { unique: true });

export const CampaignProgress = mongoose.model('CampaignProgress', CampaignProgressSchema);
