import express from 'express';
import { login, addProduct, getProducts, updateProduct, deleteProduct, verifyToken } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import Admin from '../models/Admin.js';

const router = express.Router();

// Public route
router.post('/login', login);

// Protected route - verify token
router.get('/verify', protectAdmin, verifyToken);

// Other protected admin routes
router.post('/products', protectAdmin, addProduct);
router.get('/products', protectAdmin, getProducts);
router.put('/products/:id', protectAdmin, updateProduct);
router.delete('/products/:id', protectAdmin, deleteProduct);

// Admin Details Route with logic 
router.get('/me', protectAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }
    
    res.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.name,
        email: admin.email,
        role: admin.role || 'admin',
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching admin profile' 
    });
  }
});

export default router;
