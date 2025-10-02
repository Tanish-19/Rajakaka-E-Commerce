import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import MobileSection from "./components/MobileSection";
import TabletSection from "./components/TabletSection";
import TvSection from "./components/TvSection";
import AppliancesSection from "./components/AppliancesSection";
import ElectronicsSection from "./components/ElectronicsSection";

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
      </Routes>
    </Router>
  );
}

export default App;
