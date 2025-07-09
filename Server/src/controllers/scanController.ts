import { Request, Response } from "express";
import { ProductModel } from "../models/Product";
import { ScanLogModel } from "../models/ScanLog";

export class ScanController {
  async scanProduct(req: Request, res: Response) {
    try {
      const { wallet_address, sku, location } = req.body;
      // Find product by SKU
      const product = await ProductModel.findOne({ sku });
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      // Calculate warranty_expires_at if product has warranty
      let warranty_expires_at = null;
      if (product.has_warranty && product.warranty_days) {
        warranty_expires_at = new Date(
          Date.now() + product.warranty_days * 24 * 60 * 60 * 1000
        );
      } else {
        warranty_expires_at = new Date(Date.now());
      }
      // Create ScanLog
      const scanLog = await ScanLogModel.create({
        user_id: wallet_address, // For now, use wallet_address as user_id
        product_id: product.id || product._id,
        scanned_at: new Date(),
        location: location || "",
        warranty_expires_at,
      });
      res.status(201).json({
        success: true,
        message: "Scan logged successfully",
        data: scanLog,
      });
    } catch (err) {
      console.log("scanProduct : ", err);
      res.status(500).json({ success: false, message: "Failed to log scan" });
    }
  }

  async getUserScans(req: Request, res: Response) {
    try {
      const { wallet_address } = req.params;

      if (!wallet_address) {
        return res
          .status(400)
          .json({ success: false, message: "wallet_address is required" });
      }

      const scans = await ScanLogModel.find({ user_id: wallet_address }).sort({
        scanned_at: -1,
      });

      res.status(200).json({
        success: true,
        message: "Scans fetched successfully",
        data: scans,
      });
    } catch (err) {
      console.error("getUserScans : ", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch user scans" });
    }
  }
}
