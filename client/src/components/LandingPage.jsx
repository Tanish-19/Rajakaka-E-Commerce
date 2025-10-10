import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Tablet, Tv, Refrigerator, Cpu } from 'lucide-react';
import Navbar from './Navbar';

const API_URL = 'http://localhost:5001/api/products';

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
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-xl p-4 shadow-md">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="bg-gray-50 rounded-b-xl p-6 shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                onClick={() => navigate(`/product/${product.product_id || product._id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-4 flex flex-col group cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-orange-600">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
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
  const [mobileDeals, setMobileDeals] = useState([]);
  const [tabletDeals, setTabletDeals] = useState([]);
  const [tvDeals, setTvDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestDeals();
  }, []);

  const fetchBestDeals = async () => {
    try {
      setLoading(true);
      
      const [mobilesRes, tabletsRes, tvsRes] = await Promise.all([
        fetch(`${API_URL}?category=mobiles&min_discount=10`),
        fetch(`${API_URL}?category=tablets&min_discount=10`),
        fetch(`${API_URL}?category=tvs&min_discount=10`)
      ]);

      const mobilesData = await mobilesRes.json();
      const tabletsData = await tabletsRes.json();
      const tvsData = await tvsRes.json();

      if (mobilesData.success) {
        const filteredMobiles = mobilesData.data
          .filter(product => product.discount > 10)
          .slice(0, 5);
        setMobileDeals(filteredMobiles);
      }

      if (tabletsData.success) {
        const filteredTablets = tabletsData.data
          .filter(product => product.discount > 10)
          .slice(0, 5);
        setTabletDeals(filteredTablets);
      }

      if (tvsData.success) {
        const filteredTvs = tvsData.data
          .filter(product => product.discount > 10)
          .slice(0, 5);
        setTvDeals(filteredTvs);
      }
    } catch (error) {
      console.error('Error fetching best deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CategorySection />
      <div className="space-y-8 pb-12">
        <ProductSection title="Best Deals on Smartphones" products={mobileDeals} />
        <ProductSection title="Best Deals on Tablets" products={tabletDeals} />
        <ProductSection title="Best Deals on TVs" products={tvDeals} />
      </div>
    </div>
  );
}

export default LandingPage;
