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

// MobileCard Component: Displays individual mobile product information.
function MobileCard({ mobile }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col">
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={mobile.image}
          alt={mobile.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
        />
        {mobile.discount && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            {mobile.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
          {mobile.name}
        </h3>

        <div className="space-y-1 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Display:</span>
            <span className="line-clamp-1">{mobile.specs.display}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">RAM:</span>
            <span>{mobile.specs.ram}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Storage:</span>
            <span>{mobile.specs.storage}</span>
          </div>
        </div>

        <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-orange-600">
                ₹{mobile.price.toLocaleString()}
            </span>
            {mobile.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                ₹{mobile.originalPrice.toLocaleString()}
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

// MobileListingPage Component: The main page that assembles all other components.
function MobileListingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedBrand, setSelectedBrand] = useState('All');

  const allMobiles = [
    {
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 134999,
      originalPrice: 144999,
      discount: 7,
      image: 'https://res.cloudinary.com/dcdwworlp/image/upload/v1759304475/81dT7CUY6GL._UF350_350_QL80__ccviju.jpg',
      specs: { ram: '8GB', storage: '256GB', display: '6.7" Super Retina XDR' }
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 124999,
      originalPrice: 134999,
      discount: 7,
      image: 'https://res.cloudinary.com/dcdwworlp/image/upload/v1759305068/-original-imagx9egm9mgmvab_rtv12x.jpg',
      specs: { ram: '12GB', storage: '256GB', display: '6.8" Dynamic AMOLED 2X' }
    },
    {
      name: 'OnePlus 12',
      brand: 'OnePlus',
      price: 64999,
      originalPrice: 69999,
      discount: 7,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/k/p/g/-original-imagw29ffdskz4fy.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.82" AMOLED' }
    },
    {
      name: 'Google Pixel 8 Pro',
      brand: 'Google',
      price: 89999,
      originalPrice: 99999,
      discount: 10,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/v/a/n/-original-imagt893dfth4zkp.jpeg?q=70',
      specs: { ram: '12GB', storage: '128GB', display: '6.7" LTPO OLED' }
    },
    {
      name: 'Xiaomi 14',
      brand: 'Xiaomi',
      price: 54999,
      originalPrice: 64999,
      discount: 15,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/o/f/x/14-mzb0gmtin-xiaomi-original-imagy4g4rhajpams.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.36" AMOLED' }
    },
    {
      name: 'Vivo X100 Pro',
      brand: 'Vivo',
      price: 89999,
      originalPrice: 99999,
      discount: 10,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/p/x/f/-original-imagx24wjfzgrjcz.jpeg?q=70',
      specs: { ram: '16GB', storage: '512GB', display: '6.78" AMOLED' }
    },
    {
      name: 'Oppo Reno11 Pro 5G',
      brand: 'Oppo',
      price: 37999,
      originalPrice: 44999,
      discount: 15,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/j/s/z/reno11-pro-5g-cph2607-oppo-original-imagwu6mg5asajyq.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.7" AMOLED' }
    },
    {
      name: 'Realme GT 6',
      brand: 'Realme',
      price: 44999,
      originalPrice: 54999,
      discount: 18,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/w/i/d/gt-6-rmx3851-realme-original-imagyv5ghfchzfsz.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.78" AMOLED' }
    },
    {
      name: 'Nothing Phone (2)',
      brand: 'Nothing',
      price: 39999,
      originalPrice: 44999,
      discount: 11,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/u/v/h/-original-imags37hy7uz2usv.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.7" LTPO OLED' }
    },
    {
      name: 'Motorola Edge 50 Pro',
      brand: 'Motorola',
      price: 34999,
      originalPrice: 39999,
      discount: 13,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/i/p/b/-original-imagzm8qmrdsrhbz.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.7" pOLED' }
    },
    {
      name: 'iQOO 12',
      brand: 'iQOO',
      price: 52999,
      originalPrice: 59999,
      discount: 12,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/e/y/h/12-5g-i2220-iqoo-original-imagwu4x8chmcxhm.jpeg?q=70',
      specs: { ram: '12GB', storage: '256GB', display: '6.78" AMOLED' }
    },
    {
      name: 'Honor X9b 5G',
      brand: 'Honor',
      price: 21999,
      originalPrice: 24999,
      discount: 12,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/s/g/m/-original-imagx2k2eggevrda.jpeg?q=70',
      specs: { ram: '8GB', storage: '256GB', display: '6.78" AMOLED' }
    }
  ];

  const brands = [...new Set(allMobiles.map(mobile => mobile.brand))].sort();

  const filteredMobiles = allMobiles.filter(mobile => {
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Section */}
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

          {/* Mobile Listing Section */}
          <div className="lg:col-span-3">
            {filteredMobiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMobiles.map((mobile, index) => (
                  <MobileCard key={index} mobile={mobile} />
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