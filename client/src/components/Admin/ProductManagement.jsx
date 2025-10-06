import { useState } from 'react';
import { Plus, Trash2, CircleCheck as CheckCircle } from 'lucide-react';

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

  const generateProductId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const productId = formData.productId || generateProductId(formData.name);
      const discount = formData.discount || Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);

      const productData = {
        product_id: productId,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseInt(formData.price),
        original_price: parseInt(formData.originalPrice),
        discount: parseInt(discount),
        images: formData.images.filter(img => img.trim() !== ''),
        offers: formData.offers.filter(offer => offer.trim() !== ''),
        colors: formData.colors.filter(color => color.trim() !== ''),
        ram: formData.ram.filter(r => r.trim() !== ''),
        storage: formData.storage.filter(s => s.trim() !== ''),
        is_best_seller: formData.isBestSeller,
        is_new_arrival: formData.isNewArrival,
        rating: 0,
        reviews_count: 0
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) {
        if (error.code === '23505') {
          setSubmitMessage('Product ID already exists. Please use a different name or product ID.');
        } else {
          throw error;
        }
      } else {
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
          isBestSeller: false,
          isNewArrival: false
        });

        setTimeout(() => setSubmitMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setSubmitMessage('Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          submitMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {submitMessage.includes('success') && <CheckCircle size={20} />}
          <span>{submitMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., iPhone 15 Pro"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Product ID (optional)</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-generated if left empty"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Original Price *</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 134999"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Discounted Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 124999"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Discount % (optional)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-calculated if empty"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
            placeholder="Enter product description..."
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Image URLs (Cloudinary) *</label>
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleArrayChange('images', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://res.cloudinary.com/..."
                required={index === 0}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('images', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('images')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
          >
            <Plus size={18} />
            Add Image
          </button>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Available Offers</label>
          {formData.offers.map((offer, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={offer}
                onChange={(e) => handleArrayChange('offers', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Bank Offer: 10% Off on HDFC Cards"
              />
              {formData.offers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('offers', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('offers')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
          >
            <Plus size={18} />
            Add Offer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Colors</label>
            {formData.colors.map((color, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Black"
                />
                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('colors', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('colors')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">RAM Options</label>
            {formData.ram.map((ramOption, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ramOption}
                  onChange={(e) => handleArrayChange('ram', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8 GB"
                />
                {formData.ram.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('ram', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('ram')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Storage Options</label>
            {formData.storage.map((storageOption, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={storageOption}
                  onChange={(e) => handleArrayChange('storage', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 256 GB"
                />
                {formData.storage.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('storage', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('storage')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">New Arrival</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductManagement;
