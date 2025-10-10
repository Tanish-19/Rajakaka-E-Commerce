import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);                           // GET /api/products?category=mobiles&min_discount=10
router.get('/category/:category', getProductsByCategory);  // GET /api/products/category/mobiles
router.get('/:id', getProductById);                        // GET /api/products/123 or /api/products/iphone-15

export default router;
