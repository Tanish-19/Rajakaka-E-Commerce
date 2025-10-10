import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import AuthPopup from './AuthPopup';
import Sidebar from './Sidebar';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
              <Link to="/">
                <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide cursor-pointer">
                  Rajakaka
                </h1>
              </Link>
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
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-orange-600 cursor-pointer hover:scale-105 transition-transform">
                    {getInitials(user.name)}
                  </div>
                  <button
                    onClick={logout}
                    className="hidden sm:flex items-center gap-2 text-white hover:bg-orange-700 px-4 py-2 rounded-lg transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthPopup(true)}
                  className="flex items-center gap-2 text-white hover:bg-orange-700 px-4 py-2 rounded-lg transition-all"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {isLoggedIn && (
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  <span>Cart</span>
                </Link>
              )}
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
        <AuthPopup onClose={() => setShowAuthPopup(false)} />
      )}

      {showSidebar && (
        <Sidebar
          onClose={() => setShowSidebar(false)}
          onLoginClick={() => setShowAuthPopup(true)}
        />
      )}
    </>
  );
}
