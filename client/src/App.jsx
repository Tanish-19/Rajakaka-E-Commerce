import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import MobileSection from "./components/MobileSection";
import TabletSection from "./components/TabletSection";
import TvSection from "./components/TvSection";
import AppliancesSection from "./components/AppliancesSection";
import ElectronicsSection from "./components/ElectronicsSection";
import ProductDetails from "./components/ProductDetails";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminLoginPage from "./components/Admin/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mobile" element={<MobileSection />} />
        <Route path="/tablet" element={<TabletSection />} />
        <Route path="/tv" element={<TvSection />} />
        <Route path="/appliances" element={<AppliancesSection />} />
        <Route path="/electronics" element={<ElectronicsSection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
