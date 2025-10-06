import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, TrendingUp, User } from 'lucide-react';
import { getProductById, getSimilarProducts } from '../data/products';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    reviewText: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const productData = getProductById(id);
    if (productData) {
      setProduct(productData);
      setSelectedColor(productData.colors[0] || '');
      setSelectedRam(productData.ram[0] || '');
      setSelectedStorage(productData.storage[0] || '');

      const similar = getSimilarProducts(id, productData.category, 4);
      setSimilarProducts(similar);

      const storedReviews = localStorage.getItem(`reviews_${id}`);
      if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        setReviews(parsedReviews);
        calculateAverageRating(parsedReviews);
      }
    }
  }, [id]);

  const calculateAverageRating = (reviewsList) => {
    if (reviewsList.length === 0) {
      setAverageRating(0);
      return;
    }
    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    const avg = (sum / reviewsList.length).toFixed(1);
    setAverageRating(parseFloat(avg));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!reviewForm.userName.trim() || !reviewForm.reviewText.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newReview = {
      id: Date.now(),
      ...reviewForm,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    calculateAverageRating(updatedReviews);

    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));

    setReviewForm({
      userName: '',
      rating: 5,
      reviewText: ''
    });
    setShowReviewForm(false);
  };

  const renderStars = (rating, size = 16, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:fill-yellow-300 hover:text-yellow-300' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center" style={{ height: '500px' }}>
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index ? 'border-orange-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 shadow-md">
                  <ShoppingCart size={20} />
                  ADD TO CART
                </button>
                <button className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md">
                  <TrendingUp size={20} />
                  BUY NOW
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg">
                  <span className="font-semibold">
                    {reviews.length > 0 ? averageRating : product.rating}
                  </span>
                  <Star size={16} fill="white" />
                </div>
                <span className="text-gray-600">
                  {reviews.length > 0 ? `${reviews.length} Reviews` : `${product.reviewsCount.toLocaleString()} Ratings & Reviews`}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-green-600 font-semibold text-lg">
                    Extra ₹{(product.originalPrice - product.price).toLocaleString()} off
                  </span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-green-600 font-semibold">
                    {product.discount}% off
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Available Offers</h3>
                <div className="space-y-2">
                  {product.offers.map((offer, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <p className="text-gray-700 text-sm">{offer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.storage.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Storage</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.storage.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedStorage === storage
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.ram.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">RAM</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.ram.map((ram) => (
                      <button
                        key={ram}
                        onClick={() => setSelectedRam(ram)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedRam === ram
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {ram}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Ratings & Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all font-semibold"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Rating
                  </label>
                  {renderStars(reviewForm.rating, 24, true, (rating) =>
                    setReviewForm({ ...reviewForm, rating })
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-32"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">{averageRating}</div>
                    <div className="flex items-center justify-center mt-1">
                      {renderStars(Math.round(averageRating), 16)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </div>
                  </div>
                </div>
              </div>

              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        {renderStars(review.rating, 14)}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>

        {similarProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <div
                  key={similarProduct.id}
                  onClick={() => handleProductClick(similarProduct.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={similarProduct.images[0]}
                      alt={similarProduct.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                      {similarProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{similarProduct.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{similarProduct.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                        <span>{similarProduct.rating}</span>
                        <Star size={10} fill="white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600">
                        {similarProduct.discount}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
