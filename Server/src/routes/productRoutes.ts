import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

router.post('/products', (req, res) => productController.createProduct(req, res));

export default router; 