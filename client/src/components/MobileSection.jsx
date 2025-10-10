import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products'; // IMPORT: Data is now imported
import {
  Menu, X, Search, ShoppingCart, User, Star, Sparkles, Headphones,
  LogIn, LogOut, SlidersHorizontal, ChevronDown, ChevronUp
} from 'lucide-react';

const API_URL = 'http://localhost:5001/api/products';
const AUTH_URL = 'http://localhost:5001/api/auth';


// MODIFIED: Replaced with the more comprehensive AuthPopup
function AuthPopup({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? `${AUTH_URL}/login` : `${AUTH_URL}/register`;
      
      // Prepare request body based on login or signup
      const requestBody = isLogin 
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.success) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Store user data if provided
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, data);
        
        // Close popup and refresh or update UI
        onClose();
        
        // Optional: Reload page to update auth state
        window.location.reload();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-orange-700 p-1 rounded-full transition-all"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email {!isLogin && '/ Phone'}
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={isLogin ? "Enter email or phone" : "Enter your email"}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your address"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required={!isLogin}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required={!isLogin}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter PIN code"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Confirm password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Logging in...' : 'Signing up...'}
              </>
            ) : (
              <>{isLogin ? 'Login' : 'Sign Up'}</>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  state: '',
                  pinCode: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              disabled={loading}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sidebar Component: Provides navigation links and user actions.
function Sidebar({ isLoggedIn, onClose, onLogout, onLoginClick }) {
    const menuItems = [
        { icon: Star, label: 'Bestsellers' },
        { icon: Sparkles, label: 'New Releases' },
        { icon: User, label: 'Your Account' },
        { icon: Headphones, label: 'Customer Service' }
    ];

    const handleAuthAction = () => {
        if (isLoggedIn) {
            onLogout();
        } else {
            onLoginClick();
        }
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity lg:hidden"
                onClick={onClose}
            />
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Menu</h2>
                        <button
                            onClick={onClose}
                            className="hover:bg-orange-700 p-2 rounded-full transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    {isLoggedIn && (
                        <p className="mt-2 text-orange-100">Welcome back!</p>
                    )}
                </div>

                <div className="py-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-all border-b border-gray-100"
                        >
                            <item.icon size={20} className="text-orange-600" />
                            <span className="text-gray-800 font-medium">{item.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={handleAuthAction}
                        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-all"
                    >
                        {isLoggedIn ? (
                            <>
                                <LogOut size={20} className="text-orange-600" />
                                <span className="text-gray-800 font-medium">Sign Out</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} className="text-orange-600" />
                                <span className="text-gray-800 font-medium">Sign In</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

// Navbar Component: The main header with search, auth, and cart.
function Navbar({ isLoggedIn, onLogout }) {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <nav className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(true)}
                className="text-white hover:bg-orange-700 p-2 rounded-lg transition-all"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">
                Rajakaka
              </h1>
            </div>

            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAuthPopup(true)}
                className="flex items-center gap-2 text-white hover:bg-orange-700 px-4 py-2 rounded-lg transition-all"
              >
                <User size={20} />
                <span className="hidden sm:inline">
                  {isLoggedIn ? 'Account' : 'Login'}
                </span>
              </button>
              <button className="relative text-white hover:bg-orange-700 p-2 rounded-lg transition-all">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>
          </div>
        </div>
      </nav>

      {showAuthPopup && (
        <AuthPopup
          onClose={() => setShowAuthPopup(false)}
        />
      )}

      {showSidebar && (
        <Sidebar
          isLoggedIn={isLoggedIn}
          onClose={() => setShowSidebar(false)}
          onLogout={onLogout}
          onLoginClick={() => setShowAuthPopup(true)}
        />
      )}
    </>
  );
}

// FilterSection Component: Collapsible sidebar for filtering products.
function FilterSection({ maxPrice, setMaxPrice, selectedBrand, setSelectedBrand, onClearFilters, brands }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white shadow-md rounded-lg mb-6">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-orange-600" />
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Brand
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <button
                key="all-brands"
                onClick={() => setSelectedBrand('All')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  selectedBrand === 'All'
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    selectedBrand === brand
                      ? 'bg-orange-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Maximum Price
            </label>
            <input
              type="range"
              min="0"
              max="150000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">₹0</span>
              <span className="text-lg font-bold text-orange-600">
                ₹{maxPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">₹1,50,000</span>
            </div>
          </div>

          <button
            onClick={onClearFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}


// MODIFIED: This component now handles navigation and uses the imported product data structure.
function MobileCard({ mobile }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${mobile.product_id || mobile._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Product', mobile.name, 'added to cart.');
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={mobile.images?.[0] || '/placeholder.png'}
          alt={mobile.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
        />
        {mobile.discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            {mobile.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 h-14">
          {mobile.name}
        </h3>

        {/* RAM and Storage Specifications */}
        <div className="mb-3 space-y-1 text-sm text-gray-700">
          {/* RAM Options */}
          {mobile.ram && mobile.ram.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">RAM:</span>
              <span className="text-gray-600">
                {mobile.ram.slice(0, 3).join(', ')}
                {mobile.ram.length > 3 && '...'}
              </span>
            </div>
          )}

          {/* Storage Options */}
          {mobile.storage && mobile.storage.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">Storage:</span>
              <span className="text-gray-600">
                {mobile.storage.slice(0, 3).join(', ')}
                {mobile.storage.length > 3 && '...'}
              </span>
            </div>
          )}

          {/* Available Colors (Optional) */}
          {mobile.colors && mobile.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">Colors:</span>
              <span className="text-gray-600">
                {mobile.colors.slice(0, 2).join(', ')}
                {mobile.colors.length > 2 && ` +${mobile.colors.length - 2}`}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          {/* Pricing Section */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-orange-600">
              ₹{mobile.price?.toLocaleString()}
            </span>
            {mobile.original_price && mobile.original_price > mobile.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{mobile.original_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Savings Amount */}
          {mobile.discount > 0 && mobile.original_price && (
            <p className="text-xs text-green-600 font-semibold mb-3">
              Save ₹{(mobile.original_price - mobile.price).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// MobileListingPage Component: The main page that assembles all other components.
function MobileListingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [allMobiles, setAllMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMobiles();
  }, []);

  const fetchMobiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?category=mobiles`);
      const data = await response.json();
      
      if (data.success) {
        setAllMobiles(data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching mobiles:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const brands = [...new Set(allMobiles.map(mobile => mobile.brand).filter(Boolean))];

  const filteredMobiles = allMobiles.filter((mobile) => {
    const brandMatch = selectedBrand === 'All' || mobile.brand === selectedBrand;
    const priceMatch = mobile.price <= maxPrice;
    return brandMatch && priceMatch;
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleClearFilters = () => {
    setMaxPrice(150000);
    setSelectedBrand('All');
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-red-600">Error</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={fetchMobiles}
              className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSection
              brands={brands}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3">
            {filteredMobiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMobiles.map((mobile) => (
                  <MobileCard key={mobile._id} mobile={mobile} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md h-full">
                <h3 className="text-2xl font-bold text-gray-700">No Mobiles Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


export default MobileListingPage;