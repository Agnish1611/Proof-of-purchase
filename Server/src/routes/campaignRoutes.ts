import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';

const router = Router();
const campaignController = new CampaignController();

router.post('/campaigns/scan', (req, res) => campaignController.createCampaign(req, res));

export default router; 