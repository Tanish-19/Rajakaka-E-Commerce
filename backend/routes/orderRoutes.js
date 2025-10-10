import express from 'express';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  completeOrder,
  getOrdersByStatus,
  deleteOrder,
  cancelOrderAdmin,
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder
} from '../controllers/orderController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protectUser);
router.get('/allorders', getAllOrders);
router.post('/create', createOrder);
router.get('/', getUserOrders);
router.get('/:orderId', getOrder);
router.put('/cancel/:orderId', cancelOrder);

router.get('/status/:status', getOrdersByStatus);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/complete', completeOrder);
router.patch('/:id/cancel', cancelOrderAdmin);
router.delete('/:id', deleteOrder);

export default router;
