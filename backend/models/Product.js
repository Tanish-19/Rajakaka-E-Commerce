// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mobiles', 'tablets', 'tvs', 'appliances', 'electronics'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  original_price: {
    type: Number,
    required: [true, 'Original price is required'],
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  images: [{
    type: String,
    required: true
  }],
  offers: [{
    type: String
  }],
  colors: [{
    type: String
  }],
  ram: [{
    type: String
  }],
  storage: [{
    type: String
  }],
  is_best_seller: {
    type: Boolean,
    default: false
  },
  is_new_arrival: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews_count: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  brand: {
    type: String,
    trim: true
  },
  specifications: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
productSchema.index({ category: 1, is_best_seller: 1 });
productSchema.index({ category: 1, is_new_arrival: 1 });
productSchema.index({ discount: -1 });
productSchema.index({ product_id: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
