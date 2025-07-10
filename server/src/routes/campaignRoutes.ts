import { Request, Response, Router } from 'express';
import { CampaignController } from '../controllers/campaignController';
import { CampaignProgressController } from '../controllers/campaignProgressController';

const router = Router();
const campaignController = new CampaignController();
const campaignProgressController = new CampaignProgressController();

router.post('/campaigns', (req, res) => campaignController.createCampaign(req, res));
router.get('/campaigns', (req, res) => campaignController.getAllCampaigns(req, res));
router.post('/campaign/progress', (req, res) => campaignProgressController.updateProgress(req, res));
router.get('/campaign/progress/:userWallet/:campaignId', (req, res) => campaignProgressController.getProgress(req, res));

export default router;