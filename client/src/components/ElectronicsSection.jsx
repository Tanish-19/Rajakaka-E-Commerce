import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, Star, Sparkles, Headphones, LogIn, LogOut, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = 'http://localhost:5001/api/products';

// AuthPopup Component
function AuthPopup({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
          <button onClick={onClose} className="hover:bg-orange-700 p-1 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter password"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm password"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sidebar Component
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity lg:hidden" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button onClick={onClose} className="hover:bg-orange-700 p-2 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>
          {isLoggedIn && <p className="mt-2 text-orange-100">Welcome back!</p>}
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

// Navbar Component
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
              <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">Rajakaka</h1>
            </div>

            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for electronics..."
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
                <span className="hidden sm:inline">{isLoggedIn ? 'Account' : 'Login'}</span>
              </button>
              <button className="relative text-white hover:bg-orange-700 p-2 rounded-lg transition-all">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>
          </div>
        </div>
      </nav>

      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
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

// FilterSection Component
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
            <label className="block text-gray-700 font-semibold mb-3">Brand</label>
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
            <label className="block text-gray-700 font-semibold mb-3">Maximum Price</label>
            <input
              type="range"
              min="0"
              max="250000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">₹0</span>
              <span className="text-lg font-bold text-orange-600">₹{maxPrice.toLocaleString()}</span>
              <span className="text-sm text-gray-600">₹2,50,000</span>
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

// ElectronicsCard Component
function ElectronicsCard({ electronic }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${electronic.product_id || electronic._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Product', electronic.name, 'added to cart.');
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={electronic.images?.[0] || '/placeholder.png'}
          alt={electronic.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
        />
        {electronic.discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            {electronic.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{electronic.name}</h3>

        <div className="space-y-1 mb-3 text-sm text-gray-600">
          {electronic.ram && electronic.ram.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-medium">RAM:</span>
              <span className="line-clamp-1">{electronic.ram.slice(0, 2).join(', ')}</span>
            </div>
          )}
          {electronic.storage && electronic.storage.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Storage:</span>
              <span className="line-clamp-1">{electronic.storage.slice(0, 2).join(', ')}</span>
            </div>
          )}
          {electronic.brand && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Brand:</span>
              <span>{electronic.brand}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-orange-600">₹{electronic.price?.toLocaleString()}</span>
            {electronic.original_price && electronic.original_price > electronic.price && (
              <span className="text-sm text-gray-500 line-through">₹{electronic.original_price.toLocaleString()}</span>
            )}
          </div>

          {electronic.discount > 0 && electronic.original_price && (
            <p className="text-xs text-green-600 font-semibold mb-3">
              Save ₹{(electronic.original_price - electronic.price).toLocaleString()}
            </p>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ElectronicsListingPage Component
function ElectronicsListingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [allElectronics, setAllElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchElectronics();
  }, []);

  const fetchElectronics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?category=electronics`);
      const data = await response.json();

      if (data.success) {
        setAllElectronics(data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching electronics:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const brands = [...new Set(allElectronics.map(item => item.brand).filter(Boolean))].sort();

  const filteredElectronics = allElectronics.filter(item => {
    const brandMatch = selectedBrand === 'All' || item.brand === selectedBrand;
    const priceMatch = item.price <= maxPrice;
    return brandMatch && priceMatch;
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleClearFilters = () => {
    setMaxPrice(250000);
    setSelectedBrand('All');
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading electronics...</p>
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
              onClick={fetchElectronics}
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
            {filteredElectronics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredElectronics.map((electronic) => (
                  <ElectronicsCard key={electronic._id} electronic={electronic} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md h-full">
                <h3 className="text-2xl font-bold text-gray-700">No Electronics Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ElectronicsListingPage;
