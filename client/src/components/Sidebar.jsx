import { useNavigate } from 'react-router-dom';
import { Star, Sparkles, User, Headphones, LogIn, LogOut, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

export default function Sidebar({ onClose, onLoginClick }) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Star, label: 'Bestsellers', path: '/best-sellers' },
    { icon: Sparkles, label: 'New Arrivals', path: '/new-arrivals' },
    { icon: User, label: 'Your Account', path: '/account' },
    { icon: Headphones, label: 'Customer Service', path: '/support' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button onClick={onClose} className="hover:bg-orange-700 p-2 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>
          {isLoggedIn && user && (
            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-orange-600 text-lg">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-orange-100">Welcome back!</p>
              </div>
            </div>
          )}
        </div>

        <div className="py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.path)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-all border-b border-gray-100"
            >
              <item.icon size={20} className="text-orange-600" />
              <span className="text-gray-800 font-medium">{item.label}</span>
            </button>
          ))}

          <button
            onClick={isLoggedIn ? handleLogout : () => { onClose(); onLoginClick(); }}
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
