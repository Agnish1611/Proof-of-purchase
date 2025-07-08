import { Router } from 'express';
import { ScanController } from '../controllers/scanController';

const router = Router();
const scanController = new ScanController();

router.post('/scan', (req, res) => scanController.scanProduct(req, res));

export default router; 