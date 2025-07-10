import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, sku, brand, category, has_warranty, warranty_days } = req.body;
      const product = await ProductModel.create({
        name,
        sku,
        brand,
        category,
        has_warranty,
        warranty_days,
      });
      res.status(201).json({
        success: true,
        message: 'Product registered successfully',
        data: product,
      });
    } catch (err) {
      console.log('createProduct : ', err);
      res.status(500).json({ success: false, message: 'Failed to create product' });
    }
  }
}