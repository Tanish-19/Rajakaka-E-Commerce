import { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5001/api/products';

function ProductManagement() {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: 'mobiles',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    images: [''],
    offers: [''],
    colors: [''],
    ram: [''],
    storage: [''],
    brand: '',
    stock: '',
    isBestSeller: false,
    isNewArrival: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const categories = [
    { value: 'mobiles', label: 'Mobiles' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'tvs', label: 'TVs' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'electronics', label: 'Electronics' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length > 0 ? newArray : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      
      const productData = {
        product_id: formData.productId,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseInt(formData.price),
        original_price: parseInt(formData.originalPrice),
        discount: formData.discount ? parseInt(formData.discount) : undefined,
        images: formData.images.filter(img => img.trim() !== ''),
        offers: formData.offers.filter(offer => offer.trim() !== ''),
        colors: formData.colors.filter(color => color.trim() !== ''),
        ram: formData.ram.filter(r => r.trim() !== ''),
        storage: formData.storage.filter(s => s.trim() !== ''),
        brand: formData.brand,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        is_best_seller: formData.isBestSeller,
        is_new_arrival: formData.isNewArrival
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage('Product added successfully!');
        setFormData({
          productId: '',
          name: '',
          category: 'mobiles',
          description: '',
          price: '',
          originalPrice: '',
          discount: '',
          images: [''],
          offers: [''],
          colors: [''],
          ram: [''],
          storage: [''],
          brand: '',
          stock: '',
          isBestSeller: false,
          isNewArrival: false
        });
        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage(data.message || 'Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

      {submitMessage && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          submitMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {submitMessage.includes('success') && <CheckCircle size={20} />}
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product ID (Optional)
              </label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Auto-generated if left empty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., iPhone 15 Pro Max"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Apple, Samsung"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed product description"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Pricing & Stock</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="₹"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price *
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="₹"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount %
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Auto-calculated"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Arrays */}
        {['images', 'offers', 'colors', 'ram', 'storage'].map(field => (
          <div key={field} className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700 capitalize">{field}</h3>
              <button
                type="button"
                onClick={() => addArrayField(field)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} /> Add {field.slice(0, -1)}
              </button>
            </div>

            {formData[field].map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field, index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={field === 'images' ? 'Image URL' : `${field.slice(0, -1)} ${index + 1}`}
                />
                {formData[field].length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(field, index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Flags */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Product Tags</h3>
          
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">New Arrival</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductManagement;
