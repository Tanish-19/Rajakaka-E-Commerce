// controllers/productController.js

import Product from '../models/Product.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      product_id,
      name,
      category,
      description,
      price,
      original_price,
      discount,
      images,
      offers,
      colors,
      ram,
      storage,
      is_best_seller,
      is_new_arrival,
      stock,
      brand,
      specifications
    } = req.body;

    // Validate required fields
    if (!name || !category || !description || !price || !original_price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Generate product_id if not provided
    const generatedProductId = product_id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if product_id already exists
    const existingProduct = await Product.findOne({ product_id: generatedProductId });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product ID already exists. Please use a different name or product ID.'
      });
    }

    // Calculate discount if not provided
    const calculatedDiscount = discount || Math.round(((original_price - price) / original_price) * 100);

    // Create product
    const product = await Product.create({
      product_id: generatedProductId,
      name,
      category: category.toLowerCase(),
      description,
      price,
      original_price,
      discount: calculatedDiscount,
      images: images || [],
      offers: offers || [],
      colors: colors || [],
      ram: ram || [],
      storage: storage || [],
      is_best_seller: is_best_seller || false,
      is_new_arrival: is_new_arrival || false,
      stock: stock || 0,
      brand: brand || '',
      specifications: specifications || {}
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const { 
      category, 
      is_best_seller, 
      is_new_arrival, 
      min_discount,
      search,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};
    
    if (category) {
      query.category = category.toLowerCase();
    }
    
    if (is_best_seller === 'true') {
      query.is_best_seller = true;
    }
    
    if (is_new_arrival === 'true') {
      query.is_new_arrival = true;
    }
    
    if (min_discount) {
      query.discount = { $gte: parseInt(min_discount) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sortOption = {};
    switch(sort) {
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'discount':
        sortOption = { discount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Get best sellers
// @route   GET /api/products/filter/best-sellers
// @access  Public
export const getBestSellers = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const query = { is_best_seller: true };
    if (category) {
      query.category = category.toLowerCase();
    }

    const products = await Product.find(query)
      .sort({ rating: -1, reviews_count: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers',
      error: error.message
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/filter/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const query = { is_new_arrival: true };
    if (category) {
      query.category = category.toLowerCase();
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching new arrivals',
      error: error.message
    });
  }
};

// @desc    Get products with high discounts (>10%)
// @route   GET /api/products/filter/best-deals
// @access  Public
export const getBestDeals = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const query = { discount: { $gte: 10 } };
    if (category) {
      query.category = category.toLowerCase();
    }

    const products = await Product.find(query)
      .sort({ discount: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching best deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching best deals',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { product_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ product_id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get similar products
// @route   GET /api/products/:id/similar
// @access  Public
export const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const similarProducts = await Product.find({
      category: product.category,
      product_id: { $ne: product.product_id }
    })
    .limit(4)
    .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: similarProducts
    });
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching similar products',
      error: error.message
    });
  }
};
