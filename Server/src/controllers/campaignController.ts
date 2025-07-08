import { Request, Response } from 'express';
import { CampaignModel } from '../models/Campaign';

export class CampaignController {
  async createCampaign(req: Request, res: Response) {
    try {
      const { title, brand, required_skus, scan_count_required, reward_tokens, start_time, end_time, status } = req.body;
      const campaign = await CampaignModel.create({
        title,
        brand,
        required_skus,
        scan_count_required,
        reward_tokens,
        start_time,
        end_time,
        status,
      });
      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign,
      });
    } catch (err) {
      console.log('createCampaign : ', err);
      res.status(500).json({ success: false, message: 'Failed to create campaign' });
    }
  }
} 