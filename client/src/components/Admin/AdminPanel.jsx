import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Menu, X, LogOut, User } from 'lucide-react';
import ProductManagement from './ProductManagement';
import ViewPurchases from './ViewPurchases';
import UserManagement from './UserManagement';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // Load admin data from localStorage on component mount
  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      try {
        setAdminData(JSON.parse(storedAdminData));
      } catch (error) {
        console.error('Error parsing admin data:', error);
      }
    }
  }, []);

  const tabs = [
    { id: 'products', label: 'Add Product', icon: Package },
    { id: 'purchases', label: 'View Purchases', icon: ShoppingBag },
    { id: 'users', label: 'User Management', icon: Users }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Remove token and admin data from storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      // Redirect to login page
      window.location.href = '/admin-login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={28} />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-blue-100 hidden sm:block">
                Welcome back, {adminData?.name || adminData?.email || 'Admin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Info */}
            <div className="hidden md:flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg">
              <User size={18} />
              <span className="text-sm font-medium">{adminData?.email || 'Loading...'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-blue-700 rounded-lg transition-all"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Admin Info in Sidebar (Mobile) */}
              <div className="md:hidden mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User size={16} />
                  <div>
                    <p className="font-medium text-gray-800">{adminData?.name || 'Admin'}</p>
                    <p className="text-xs">{adminData?.email || 'Loading...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              {activeTab === 'products' && <ProductManagement />}
              {activeTab === 'purchases' && <ViewPurchases />}
              {activeTab === 'users' && <UserManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
