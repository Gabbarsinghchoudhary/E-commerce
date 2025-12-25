import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Upload, Trash2, ImagePlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { productAPI, handleAPIError } from '../services/api';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  images: string[];
  category: string;
  material: string;
  lightModes: string;
  charging: string;
  workingTime: string;
  touchControl: string;
  battery: string;
  idealFor: string;
  height: string;
  specifications: { key: string; value: string }[];
  bulkDiscounts: { minQuantity: number; discount: number }[];
  stock: number;
  sortOrder: number;
}

export const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    discountedPrice: 0,
    images: [],
    category: '',
    material: '',
    lightModes: '',
    charging: '',
    workingTime: '',
    touchControl: '',
    battery: '',
    idealFor: '',
    height: '',
    specifications: [],
    bulkDiscounts: [],
    stock: 0,
    sortOrder: 0,
  });

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setIsLoading(true);

    try {
      // Call the actual API to create product
      await productAPI.createProduct({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        discountedPrice: formData.discountedPrice || undefined,
        images: formData.images,
        category: formData.category,
        material: formData.material,
        lightModes: formData.lightModes,
        charging: formData.charging,
        workingTime: formData.workingTime,
        touchControl: formData.touchControl,
        battery: formData.battery,
        idealFor: formData.idealFor,
        height: formData.height,
        specifications: formData.specifications,
        bulkDiscounts: formData.bulkDiscounts,
        inStock: true,
        stock: formData.stock || 0,
        sortOrder: formData.sortOrder || 0,
      });
      
      // Clear form on success
      setFormData({
        name: '',
        description: '',
        price: 0,
        discountedPrice: 0,
        images: [],
        category: '',
        material: '',
        lightModes: '',
        charging: '',
        workingTime: '',
        touchControl: '',
        battery: '',
        idealFor: '',
        height: '',
        specifications: [],
        bulkDiscounts: [],
        stock: 0,
        sortOrder: 0,
      });

      toast.success('Product added successfully!');
      
      // Navigate to manage products page after a short delay
      setTimeout(() => {
        navigate('/manage-products');
      }, 1500);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      toast.error(errorMessage || 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discountedPrice' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64String],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleAddSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const handleRemoveSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleAddBulkDiscount = () => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: [...prev.bulkDiscounts, { minQuantity: 1, discount: 0 }],
    }));
  };

  const handleBulkDiscountChange = (index: number, field: 'minQuantity' | 'discount', value: string) => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.map((bulk, i) =>
        i === index ? { ...bulk, [field]: parseFloat(value) || 0 } : bulk
      ),
    }));
  };

  const handleRemoveBulkDiscount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Package className="h-5 w-5 text-cyan-400 mr-2" />
              Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Price (Rs)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Discounted Price (Rs) - Optional
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">
                  Product Images
                </label>
                
                {/* Image URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL or upload from computer"
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Add URL</span>
                  </button>
                </div>

                {/* File Upload Button */}
                <div className="flex items-center justify-center">
                  <div className="text-gray-500 text-sm">OR</div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={handleBrowseFiles}
                  className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/50 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span>Upload Images from Computer</span>
                </button>
                
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF, WebP (Max 5MB per image)
                </p>

                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-cyan-500/30"
                        />
                        
                        {/* Reorder buttons */}
                        <div className="absolute top-2 left-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              if (index === 0) return;
                              const newImages = [...formData.images];
                              [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
                              setFormData({ ...formData, images: newImages });
                            }}
                            disabled={index === 0}
                            className="p-1 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (index === formData.images.length - 1) return;
                              const newImages = [...formData.images];
                              [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
                              setFormData({ ...formData, images: newImages });
                            }}
                            disabled={index === formData.images.length - 1}
                            className="p-1 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-white">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Use arrows to reorder images. First image will be the main display image.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Select category</option>
                  <option value="Smart">Smart</option>
                  <option value="RGB">RGB</option>
                  <option value="Energy Efficient">Energy Efficient</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Standard">Standard</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Dimmable">Dimmable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., Plastic, Metal"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Light Modes
                </label>
                <input
                  type="text"
                  name="lightModes"
                  value={formData.lightModes}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., 3 Modes"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Charging
                </label>
                <input
                  type="text"
                  name="charging"
                  value={formData.charging}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., USB Type-C"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Working Time
                </label>
                <input
                  type="text"
                  name="workingTime"
                  value={formData.workingTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., 8-10 hours"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Touch Control
                </label>
                <input
                  type="text"
                  name="touchControl"
                  value={formData.touchControl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., Yes, No"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Battery
                </label>
                <input
                  type="text"
                  name="battery"
                  value={formData.battery}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., 2000mAh"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Ideal For
                </label>
                <input
                  type="text"
                  name="idealFor"
                  value={formData.idealFor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., Study, Reading"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Height
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., 40cm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter available quantity"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Display Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="0 (lower numbers appear first)"
                />
                <p className="text-xs text-gray-400">
                  Set product display order. Lower numbers show first on homepage.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Specifications Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Additional Specifications
              </h2>
              <button
                type="button"
                onClick={handleAddSpecification}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Specification</span>
              </button>
            </div>

            {formData.specifications.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No additional specifications yet. Click "Add Specification" to add some.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      placeholder="Specification name (e.g., Warranty)"
                      className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., 2 years)"
                      className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Discounts Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Bulk Purchase Discounts
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Set discounts for customers buying multiple quantities
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBulkDiscount}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Discount</span>
              </button>
            </div>

            {formData.bulkDiscounts.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No bulk discounts set. Click "Add Discount" to create quantity-based discounts.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.bulkDiscounts.map((bulk, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="text-sm text-gray-400 mb-1 block">Minimum Quantity</label>
                      <input
                        type="number"
                        value={bulk.minQuantity}
                        onChange={(e) => handleBulkDiscountChange(index, 'minQuantity', e.target.value)}
                        min="1"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-400 mb-1 block">Discount (%)</label>
                      <input
                        type="number"
                        value={bulk.discount}
                        onChange={(e) => handleBulkDiscountChange(index, 'discount', e.target.value)}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="e.g., 5"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBulkDiscount(index)}
                      className="mt-7 p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400">
                    💡 Example: Set "Min Qty: 3, Discount: 5%" to give 5% off when buying 3 or more items
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};