import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Star, Sparkles, Headphones, LogIn, LogOut, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

// AuthPopup Component: Handles user login and sign-up in a modal.
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
    // In a real app, you would handle authentication here.
    console.log('Form submitted:', formData);
    onClose(); // Close the popup after submission
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
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
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
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
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
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
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
function FilterSection({ maxPrice, setMaxPrice, selectedCategory, setSelectedCategory, onClearFilters, categories, filterTitle }) {
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
              {filterTitle || 'Category'}
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
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
              max="250000"
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

// ElectronicsCard Component: Displays individual electronic product information.
function ElectronicsCard({ electronic }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col">
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={electronic.image}
          alt={electronic.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
        />
        {electronic.discount && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            {electronic.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
          {electronic.name}
        </h3>

        <div className="space-y-1 mb-3 text-sm text-gray-600">
            {Object.entries(electronic.specs).map(([key, value]) => (
                 <div key={key} className="flex items-center gap-2">
                    <span className="font-medium capitalize">{key}:</span>
                    <span className="line-clamp-1">{value}</span>
                </div>
            ))}
        </div>

        <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-orange-600">
                ₹{electronic.price.toLocaleString()}
            </span>
            {electronic.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                ₹{electronic.originalPrice.toLocaleString()}
                </span>
            )}
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md">
            Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
}

// ElectronicsListingPage Component: The main page that assembles all other components.
function ElectronicsListingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allElectronics = [
    {
      name: 'Apple MacBook Air M3 Chip',
      category: 'Computing',
      price: 124990,
      originalPrice: 134990,
      discount: 7,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/m/b/n/-original-imagzvnw45a9z58c.jpeg?q=70',
      specs: { processor: 'Apple M3', ram: '8 GB', storage: '512 GB SSD' }
    },
    {
        name: 'HP Victus Gaming Laptop',
        category: 'Computing',
        price: 81990,
        originalPrice: 99632,
        discount: 17,
        image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/c/6/1/15-fa1332tx-gaming-laptop-hp-original-imagx2859b9vkffg.jpeg?q=70',
        specs: { processor: 'Intel Core i7 12th Gen', ram: '16 GB', storage: '512 GB SSD' }
    },
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'Audio',
      price: 26990,
      originalPrice: 34990,
      discount: 22,
      image: 'https://rukminim2.flixcart.com/image/416/416/l31x2fk0/headphone/d/s/k/-original-image92chzndv7g.jpeg?q=70',
      specs: { type: 'Over-Ear', connectivity: 'Bluetooth 5.2', battery: 'Up to 30 hours' }
    },
    {
        name: 'JBL Charge 5 Portable Bluetooth Speaker',
        category: 'Audio',
        price: 14999,
        originalPrice: 18999,
        discount: 21,
        image: 'https://rukminim2.flixcart.com/image/416/416/kpsnzww0/speaker/portable-speaker/p/x/j/charge-5-jbl-original-imag3y6fgg8efhtd.jpeg?q=70',
        specs: { type: 'Portable', connectivity: 'Bluetooth 5.1', battery: 'Up to 20 hours' }
    },
    {
      name: 'Apple Watch Series 9',
      category: 'Wearables',
      price: 41900,
      originalPrice: 44900,
      discount: 6,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/k/h/h/-original-imagtcw6g5ghx2va.jpeg?q=70',
      specs: { display: '45mm Always-On Retina', connectivity: 'GPS', features: 'Temperature sensing' }
    },
    {
        name: 'Samsung Galaxy Watch6 Classic',
        category: 'Wearables',
        price: 36999,
        originalPrice: 43999,
        discount: 15,
        image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/z/c/c/-original-imags3b2v3dujthz.jpeg?q=70',
        specs: { display: '1.47" Super AMOLED', connectivity: 'LTE + Bluetooth', features: 'Rotating Bezel' }
    },
    {
        name: 'Logitech MX Master 3S Mouse',
        category: 'Accessories',
        price: 9495,
        originalPrice: 12495,
        discount: 24,
        image: 'https://rukminim2.flixcart.com/image/416/416/l4n2oi80/mouse/v/p/a/mx-master-3s-logitech-original-imagfgg55tztzrmb.jpeg?q=70',
        specs: { type: 'Wireless Mouse', connectivity: 'Bluetooth, USB', compatibility: 'Windows, macOS' }
    },
    {
      name: 'Dell Alienware AW2723DF Gaming Monitor',
      category: 'Computing',
      price: 64999,
      originalPrice: 82500,
      discount: 21,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/monitor/k/d/m/-original-imagz7bahzsgy34u.jpeg?q=70',
      specs: { size: '27 inch QHD', refreshRate: '280 Hz', responseTime: '1 ms' }
    },
    {
      name: 'Bose SoundLink Flex Bluetooth Speaker',
      category: 'Audio',
      price: 14900,
      originalPrice: 15900,
      discount: 6,
      image: 'https://rukminim2.flixcart.com/image/416/416/ky90scw0/speaker/portable-speaker/x/a/s/soundlink-flex-bose-original-imagagnfghzmsyv6.jpeg?q=70',
      specs: { type: 'Portable', connectivity: 'Bluetooth 4.2', battery: 'Up to 12 hours' }
    },
    {
      name: 'Amazfit GTS 4 Smart Watch',
      category: 'Wearables',
      price: 16999,
      originalPrice: 23999,
      discount: 29,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/a/n/i/-original-imagh89vkgzaxn2h.jpeg?q=70',
      specs: { display: '1.75" AMOLED', connectivity: 'GPS + Bluetooth', features: '150+ Sports Modes' }
    },
    {
      name: 'Anker PowerCore 20000 PD Power Bank',
      category: 'Accessories',
      price: 4999,
      originalPrice: 7999,
      discount: 37,
      image: 'https://rukminim2.flixcart.com/image/416/416/kmp7ngw0/power-bank/s/p/o/powercore-20000-pd-a1281h11-anker-original-imagfgh5rgrs2z3j.jpeg?q=70',
      specs: { capacity: '20,000mAh', output: '20W Power Delivery', compatibility: 'Universal' }
    },
    {
        name: 'Razer BlackWidow V4 Pro Keyboard',
        category: 'Accessories',
        price: 19999,
        originalPrice: 24999,
        discount: 20,
        image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/keyboard/gaming-keyboard/e/z/o/blackwidow-v4-pro-razer-original-imaghzaa6zbr6hfy.jpeg?q=70',
        specs: { type: 'Mechanical Keyboard', connectivity: 'Wired', compatibility: 'PC' }
    },
  ];

  const categories = [...new Set(allElectronics.map(item => item.category))].sort();

  const filteredElectronics = allElectronics.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const priceMatch = item.price <= maxPrice;
    return categoryMatch && priceMatch;
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleClearFilters = () => {
    setMaxPrice(250000);
    setSelectedCategory('All');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Section */}
          <div className="lg:col-span-1">
            <FilterSection
              categories={categories}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onClearFilters={handleClearFilters}
              filterTitle="Category"
            />
          </div>

          {/* Electronics Listing Section */}
          <div className="lg:col-span-3">
            {filteredElectronics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredElectronics.map((electronic, index) => (
                  <ElectronicsCard key={index} electronic={electronic} />
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