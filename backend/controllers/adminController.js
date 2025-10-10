import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying token' });
  }
};

export const addProduct = async (req, res) => {
  try {
    // Extract product data from request body
    const productData = { ...req.body };
    
    // Auto-generate product_id if not provided
    if (!productData.product_id || productData.product_id.trim() === '') {
      const prefix = getCategoryPrefix(productData.category);
      const nextId = await getNextSequenceValue(productData.category);
      productData.product_id = `${prefix}${String(nextId).padStart(5, '0')}`;
    }
    
    // Auto-calculate discount if not provided
    if (!productData.discount || productData.discount === 0) {
      if (productData.price && productData.original_price) {
        const discountPercentage = Math.round(
          ((productData.original_price - productData.price) / productData.original_price) * 100
        );
        productData.discount = discountPercentage > 0 ? discountPercentage : 0;
      }
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Product added successfully', 
      product 
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding product', 
      error: error.message 
    });
  }
};

// Helper function to get category prefix
function getCategoryPrefix(category) {
  const prefixMap = {
    'mobiles': 'MOB',
    'tablets': 'TAB',
    'tvs': 'TV',
    'appliances': 'APP',
    'electronics': 'ELEC'
  };
  return prefixMap[category] || 'PROD';
}

// Helper function to get next sequence value for a category
async function getNextSequenceValue(category) {
  const Counter = mongoose.model('Counter', new mongoose.Schema({
    _id: String,
    sequence_value: { type: Number, default: 0 }
  }));
  
  const result = await Counter.findOneAndUpdate(
    { _id: `${category}_id` },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  
  return result.sequence_value;
}

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};
