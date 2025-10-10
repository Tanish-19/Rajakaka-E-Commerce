import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import MobileSection from "./components/MobileSection";
import TabletSection from "./components/TabletSection";
import TvSection from "./components/TvSection";
import AppliancesSection from "./components/AppliancesSection";
import ElectronicsSection from "./components/ElectronicsSection";
import ProductDetails from "./components/ProductDetails";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminLoginPage from "./components/Admin/AdminLogin";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import NewArrivals from "./components/NewArrivals";
import BestSellers from "./components/BestSellers";
import Cart from "./components/Cart";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========== Public Routes with Auth Context ========== */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/mobile" element={<MobileSection />} />
          <Route path="/tablet" element={<TabletSection />} />
          <Route path="/tv" element={<TvSection />} />
          <Route path="/appliances" element={<AppliancesSection />} />
          <Route path="/electronics" element={<ElectronicsSection />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          
          {/* ========== Admin Authentication Routes ========== */}
          
          {/* Admin Login Route (Public - anyone can access) */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          
          {/* Protected Admin Route (Requires Authentication) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
