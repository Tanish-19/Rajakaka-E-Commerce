import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, brand, min_discount, limit, bestSeller, newArrival, is_best_seller, is_new_arrival } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (min_discount) query.discount = { $gt: parseInt(min_discount) };
    
    // Support both naming conventions
    if (bestSeller === 'true' || is_best_seller === 'true') {
      query.$or = [{ isBestSeller: true }, { is_best_seller: true }];
    }
    if (newArrival === 'true' || is_new_arrival === 'true') {
      query.$or = [{ isNewArrival: true }, { is_new_arrival: true }];
    }

    let productQuery = Product.find(query);
    if (limit) productQuery = productQuery.limit(parseInt(limit));

    const products = await productQuery;
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ product_id: id });
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};
