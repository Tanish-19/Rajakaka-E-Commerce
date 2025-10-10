import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
      .populate('userId', 'name email');

    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { 
      productId, 
      product_id,
      name,
      price,
      quantity = 1,
      image,
      selectedColor,
      selectedRam,
      selectedStorage
    } = req.body;

    // Validate required fields
    if (!productId || !product_id || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required product information'
      });
    }

    const subtotal = price * quantity;

    // Find existing cart - NO ACTIVE FILTER
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      // Create new cart only if none exists
      cart = new Cart({
        userId: req.userId,
        items: [{
          productId,
          product_id,
          name,
          price,
          quantity,
          image,
          selectedColor,
          selectedRam,
          selectedStorage,
          subtotal
        }]
      });
    } else {
      // Cart exists - check if item already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product_id === product_id && 
                item.selectedColor === selectedColor &&
                item.selectedRam === selectedRam &&
                item.selectedStorage === selectedStorage
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity and subtotal
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal = 
          cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
      } else {
        // Add new item to existing cart
        cart.items.push({
          productId,
          product_id,
          name,
          price,
          quantity,
          image,
          selectedColor,
          selectedRam,
          selectedStorage,
          subtotal
        });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID or quantity'
      });
    }

    // NO ACTIVE FILTER
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // NO ACTIVE FILTER
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemExists = cart.items.some(item => item._id.toString() === itemId);

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    // NO ACTIVE FILTER
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};
