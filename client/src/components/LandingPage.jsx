import { Link } from "react-router-dom";
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Star, Sparkles, Headphones, LogIn, LogOut, Smartphone, Tablet, Tv, Refrigerator, Cpu } from 'lucide-react';

function AuthPopup({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
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
              Email {!isLogin && '/ Phone'}
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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

function Sidebar({ isLoggedIn, onClose, onLogout }) {
  const menuItems = [
    { icon: Star, label: 'Bestsellers' },
    { icon: Sparkles, label: 'New Releases' },
    { icon: User, label: 'Your Account' },
    { icon: Headphones, label: 'Customer Service' }
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
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
            onClick={isLoggedIn ? onLogout : onClose}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-all border-b border-gray-100"
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
        />
      )}
    </>
  );
}

function CategorySection() {
  const categories = [
    { icon: Smartphone, name: "Mobiles", path: "/mobile", color: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: Tablet, name: "Tablets", path: "/tablet", color: "bg-green-100", iconColor: "text-green-600" },
    { icon: Tv, name: "TVs", path: "/tv", color: "bg-red-100", iconColor: "text-red-600" },
    { icon: Refrigerator, name: "Appliances", path: "/appliances", color: "bg-yellow-100", iconColor: "text-yellow-600" },
    { icon: Cpu, name: "Electronics", path: "/electronics", color: "bg-pink-100", iconColor: "text-pink-600" }
  ];

  return (
    <div className="py-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Shop by Category
        </h2>
        <div className="flex justify-around items-center gap-4 flex-wrap">
          {categories.map((category, index) => (
            <Link to={category.path} key={index}>
              <button className="flex flex-col items-center gap-3 group transition-transform hover:scale-110">
                <div
                  className={`${category.color} w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all`}
                >
                  <category.icon size={36} className={category.iconColor} />
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  {category.name}
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}



function ProductSection({ title, products }) {
  return (
    <div className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-xl p-4 shadow-md">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="bg-gray-50 rounded-b-xl p-6 shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-4 flex flex-col group cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-orange-600">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                {product.discount && (
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full self-start">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const smartphoneDeals = [
    {
  name: 'iPhone 15 Pro',
  price: '124,999',
  originalPrice: '134,999',
  discount: 7,
  image: 'https://res.cloudinary.com/dcdwworlp/image/upload/v1759304475/81dT7CUY6GL._UF350_350_QL80__ccviju.jpg'
},

    {
      name: 'Samsung Galaxy S24 Ultra',
      price: '109,999',
      originalPrice: '124,999',
      discount: 12,
      image: 'https://res.cloudinary.com/dcdwworlp/image/upload/v1759305068/-original-imagx9egm9mgmvab_rtv12x.jpg'
    },
    {
      name: 'OnePlus 12',
      price: '59,999',
      originalPrice: '69,999',
      discount: 14,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/smartphone_3.jpg'
    },
    {
      name: 'Google Pixel 8 Pro',
      price: '89,999',
      originalPrice: '99,999',
      discount: 10,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/smartphone_4.jpg'
    },
    {
      name: 'Xiaomi 14 Pro',
      price: '54,999',
      originalPrice: '64,999',
      discount: 15,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/smartphone_5.jpg'
    }
  ];

  const tvDeals = [
    {
      name: 'Samsung 55" 4K Smart TV',
      price: '49,999',
      originalPrice: '69,999',
      discount: 29,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tv_1.jpg'
    },
    {
      name: 'LG OLED 65" TV',
      price: '139,999',
      originalPrice: '179,999',
      discount: 22,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tv_2.jpg'
    },
    {
      name: 'Sony Bravia 50" 4K',
      price: '59,999',
      originalPrice: '79,999',
      discount: 25,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tv_3.jpg'
    },
    {
      name: 'Mi TV 43" Smart',
      price: '24,999',
      originalPrice: '34,999',
      discount: 29,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tv_4.jpg'
    },
    {
      name: 'OnePlus TV 55" QLED',
      price: '44,999',
      originalPrice: '59,999',
      discount: 25,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tv_5.jpg'
    }
  ];

  const tabletDeals = [
    {
      name: 'iPad Pro 12.9"',
      price: '99,999',
      originalPrice: '109,999',
      discount: 9,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tablet_1.jpg'
    },
    {
      name: 'Samsung Galaxy Tab S9',
      price: '64,999',
      originalPrice: '79,999',
      discount: 19,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tablet_2.jpg'
    },
    {
      name: 'iPad Air',
      price: '54,999',
      originalPrice: '64,999',
      discount: 15,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tablet_3.jpg'
    },
    {
      name: 'OnePlus Pad',
      price: '34,999',
      originalPrice: '44,999',
      discount: 22,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tablet_4.jpg'
    },
    {
      name: 'Lenovo Tab P12',
      price: '39,999',
      originalPrice: '49,999',
      discount: 20,
      image: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/tablet_5.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />

      <CategorySection />

      <div className="space-y-8 pb-12">
        <ProductSection
          title="Best Deals on Smartphones"
          products={smartphoneDeals}
        />

        <ProductSection
          title="Best Deals on TVs"
          products={tvDeals}
        />

        <ProductSection
          title="Best Deals on Tablets"
          products={tabletDeals}
        />
      </div>
    </div>
  );
}

export default LandingPage;
