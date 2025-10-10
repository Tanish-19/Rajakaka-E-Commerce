import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';

const API_URL = 'http://localhost:5001/api/products';

function BestSellers() {
  const { isLoggedIn } = useAuth(); // Access auth state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'mobiles', label: 'Mobiles' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'tvs', label: 'TVs' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'electronics', label: 'Electronics' }
  ];

  useEffect(() => {
    fetchBestSellers();
  }, [selectedCategory]);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      
      // Build query params
      let queryParams = 'bestSeller=true';
      if (selectedCategory !== 'all') {
        queryParams += `&category=${selectedCategory}`;
      }
      
      const response = await fetch(`${API_URL}?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-orange-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Best Sellers</h1>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading best sellers...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No best sellers found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product._id || product.product_id}
                onClick={() => navigate(`/product/${product.product_id || product._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.discount}% OFF
                    </span>
                  )}
                  <span className="absolute top-2 left-2 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="fill-white" size={12} />
                    BEST SELLER
                  </span>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="fill-yellow-400 text-yellow-400" size={16} />
                      <span className="text-sm ml-1 font-medium">{product.rating || 4.5}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews_count || 0} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {product.discount > 0 && product.original_price && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Save ₹{(product.original_price - product.price).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BestSellers;
