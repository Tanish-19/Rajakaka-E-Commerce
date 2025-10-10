import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:5001/api';

function Cart() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
      } else {
        setError(data.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      setError('Error loading cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for auth to finish loading before checking login status
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    fetchCart();
  }, [isLoggedIn, authLoading, navigate, fetchCart]);

  const updateQuantity = async (itemId, newQuantity) => {
  if (newQuantity < 1) return;

  console.log('=== UPDATE QUANTITY DEBUG ===');
  console.log('Item ID:', itemId);
  console.log('New Quantity:', newQuantity);

  setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

  try {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        itemId,
        quantity: newQuantity
      })
    });

    const data = await response.json();
    console.log('Update response:', data);

    if (data.success) {
      setCart(data.data);
    } else {
      alert(data.message || 'Failed to update quantity');
    }
  } catch (error) {
    console.error('Update quantity error:', error);
    alert('Error updating quantity');
  } finally {
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
  }
};

const removeItem = async (itemId) => {
  if (!window.confirm('Remove this item from cart?')) return;

  console.log('=== REMOVE ITEM DEBUG ===');
  console.log('Item ID:', itemId);
  console.log('API URL:', `${API_BASE_URL}/cart/remove/${itemId}`);

  try {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    const response = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Remove response:', data);

    if (data.success) {
      setCart(data.data);
      alert('Item removed from cart');
    } else {
      alert(data.message || 'Failed to remove item');
    }
  } catch (error) {
    console.error('Remove item error:', error);
    alert('Error removing item');
  }
};

  const clearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
        alert('Cart cleared');
      } else {
        alert(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      alert('Error clearing cart');
    }
  };

  const handleCheckout = async () => {
  if (!cart || cart.items.length === 0) {
    alert('Cart is empty');
    return;
  }

  console.log('=== CHECKOUT DEBUG ===');
  console.log('Cart data:', cart);

  try {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);

    const requestBody = {
      fromCart: true,
      paymentMethod: 'COD',
      deliveryCharge: 40
    };

    console.log('Checkout request body:', requestBody);
    console.log('API URL:', `${API_BASE_URL}/orders/create`);

    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Checkout response:', data);

    if (data.success) {
      alert('Order placed successfully!');
      navigate(`/`);
    } else {
      alert(data.message || 'Failed to place order');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Error during checkout');
  }
};

  // AUTH LOADING CHECK - MUST BE FIRST
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // CART LOADING CHECK - SECOND
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // ERROR CHECK - THIRD
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
            <button
              onClick={fetchCart}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCart size={32} className="text-orange-600" />
            My Cart
          </h1>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
            >
              <Trash2 size={20} />
              Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all font-semibold inline-flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div 
                      className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold text-gray-800 mb-2 hover:text-orange-600 cursor-pointer"
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      >
                        {item.name}
                      </h3>

                      {/* Product Specifications */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        {item.selectedColor && (
                          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                            Color: <span className="font-semibold">{item.selectedColor}</span>
                          </span>
                        )}
                        {item.selectedRam && (
                          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                            RAM: <span className="font-semibold">{item.selectedRam}</span>
                          </span>
                        )}
                        {item.selectedStorage && (
                          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                            Storage: <span className="font-semibold">{item.selectedStorage}</span>
                          </span>
                        )}
                      </div>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Subtotal: ₹{item.subtotal.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems[item._id]}
                              className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold text-lg w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={updatingItems[item._id]}
                              className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Items ({cart.totalItems}):</span>
                    <span className="font-semibold">₹{cart.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-green-600">₹40</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total Amount:</span>
                      <span className="text-orange-600">
                        ₹{(cart.totalPrice + 40).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={24} />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
