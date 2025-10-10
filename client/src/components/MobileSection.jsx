import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';

const API_URL = 'http://localhost:5001/api/products';

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

// MobileCard Component
function MobileCard({ mobile }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${mobile.product_id || mobile._id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={mobile.images?.[0] || '/placeholder.png'}
          alt={mobile.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
        />
        {mobile.discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            {mobile.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 h-14">
          {mobile.name}
        </h3>

        {/* RAM and Storage Specifications */}
        <div className="mb-3 space-y-1 text-sm text-gray-700">
          {/* RAM Options */}
          {mobile.ram && mobile.ram.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">RAM:</span>
              <span className="text-gray-600">
                {mobile.ram.slice(0, 3).join(', ')}
                {mobile.ram.length > 3 && '...'}
              </span>
            </div>
          )}

          {/* Storage Options */}
          {mobile.storage && mobile.storage.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">Storage:</span>
              <span className="text-gray-600">
                {mobile.storage.slice(0, 3).join(', ')}
                {mobile.storage.length > 3 && '...'}
              </span>
            </div>
          )}

          {/* Available Colors (Optional) */}
          {mobile.colors && mobile.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">Colors:</span>
              <span className="text-gray-600">
                {mobile.colors.slice(0, 2).join(', ')}
                {mobile.colors.length > 2 && ` +${mobile.colors.length - 2}`}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          {/* Pricing Section */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-orange-600">
              ₹{mobile.price?.toLocaleString()}
            </span>
            {mobile.original_price && mobile.original_price > mobile.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{mobile.original_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Savings Amount */}
          {mobile.discount > 0 && mobile.original_price && (
            <p className="text-xs text-green-600 font-semibold mb-3">
              Save ₹{(mobile.original_price - mobile.price).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// MobileListingPage Component
function MobileListingPage() {
  const { isLoggedIn } = useAuth(); // Use the auth context
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [allMobiles, setAllMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMobiles();
  }, []);

  const fetchMobiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?category=mobiles`);
      const data = await response.json();
      
      if (data.success) {
        setAllMobiles(data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching mobiles:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const brands = [...new Set(allMobiles.map(mobile => mobile.brand).filter(Boolean))];

  const filteredMobiles = allMobiles.filter((mobile) => {
    const brandMatch = selectedBrand === 'All' || mobile.brand === selectedBrand;
    const priceMatch = mobile.price <= maxPrice;
    return brandMatch && priceMatch;
  });

  const handleClearFilters = () => {
    setMaxPrice(150000);
    setSelectedBrand('All');
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-red-600">Error</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={fetchMobiles}
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
      <Navbar />
      
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
            {filteredMobiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMobiles.map((mobile) => (
                  <MobileCard key={mobile._id} mobile={mobile} />
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
