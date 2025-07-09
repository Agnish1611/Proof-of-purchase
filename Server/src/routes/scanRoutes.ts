import { Request, Response, Router } from "express";
import { ScanController } from "../controllers/scanController";

const router = Router();
const scanController = new ScanController();

router.post("/scan", (req, res) => scanController.scanProduct(req, res));
router.get(
  "/scans/:wallet_address",
  async (req: Request<{ wallet_address: string }>, res: Response) => {
    await scanController.getUserScans(req, res);
  }
);

export default router;