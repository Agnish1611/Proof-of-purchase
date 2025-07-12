import { Request, Response } from "express";
import { CampaignModel } from "../models/Campaign";
import { CampaignProgress } from "../models/CampaignProgress";

export class CampaignProgressController {
  async updateProgress(req: Request, res: Response) {
    try {
      console.log('inside update progress');
      const { userPublicKey, campaignId, scannedSKU } = req.body;

      const campaign = await CampaignModel.findById(campaignId);
      if (!campaign) throw new Error("Campaign not found");

      if (!campaign.required_skus.includes(scannedSKU)) {
        res.status(400).json({
          success: false,
          message: "SKU does not belong to this campaign",
        });
      }

      const now = new Date();
      if (
        now < new Date(campaign.start_time) ||
        now > new Date(campaign.end_time)
      ) {
        throw new Error("Campaign not active");
      }

      let progress = await CampaignProgress.findOne({
        user_wallet: userPublicKey,
        campaign: campaignId,
      });

      if (!progress) {
        progress = await CampaignProgress.create({
          user_wallet: userPublicKey,
          campaign: campaignId,
          scanned_skus: [scannedSKU],
          scan_count: 1,
          last_scanned_at: now,
        });
      } else {
        if (progress.completed) {
          res.status(200).json({
            success: true,
            message: "Campaign already completed",
            data: progress,
          });
        }

        progress.scan_count = Math.min(
          progress.scan_count + 1,
          campaign.scan_count_required
        );
        progress.scanned_skus.push(scannedSKU);
        progress.last_scanned_at = now;

        if (progress.scan_count >= campaign.scan_count_required) {
          progress.completed = true;
        }

        await progress.save();
      }

      res.status(200).json({
        success: true,
        message: "Updated campaign progress",
        data: progress,
      });
    } catch (err) {
      console.log("updateProgress : ", err);
      res.status(500).json({
        success: false,
        message: "Failed to updated campaign progress",
      });
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const { userWallet, campaignId } = req.params;

      const progress = await CampaignProgress.findOne({
        campaign: campaignId,
        user_wallet: userWallet,
      });

      if (!progress) {
        const newProgress = await CampaignProgress.create({
          user_wallet: userWallet,
          campaign: campaignId,
          scanned_skus: [],
          scan_count: 0,
          last_scanned_at: undefined,
        });

        res.status(200).json({
          success: true,
          message: "Fetched progress data",
          data: newProgress,
        });
      }

      res.status(200).json({
        success: true,
        message: "Fetched progress data",
        data: progress,
      });
    } catch (err) {
      console.log("getProgress : ", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch progress",
      });
    }
  }
}
