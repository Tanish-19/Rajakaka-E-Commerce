import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getBestSellers,
  getNewArrivals,
  getBestDeals,
  updateProduct,
  deleteProduct,
  getSimilarProducts
} from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/filter/best-sellers', getBestSellers);
router.get('/filter/new-arrivals', getNewArrivals);
router.get('/filter/best-deals', getBestDeals);
router.get('/:id', getProductById);
router.get('/:id/similar', getSimilarProducts);

// Protected routes (Admin only)
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
