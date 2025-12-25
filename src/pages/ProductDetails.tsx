import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Zap, Lightbulb, Clock, Star, ChevronLeft, ChevronRight, Share2, Package, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { productAPI, handleAPIError, Product as APIProduct } from '../services/api';
import { Product } from '../types';
import toast from 'react-hot-toast';
import { RatingComponent } from '../components/RatingComponent';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      toast('Share not supported on this browser', { icon: 'ℹ️' });
    }
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedBulkIndex, setSelectedBulkIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      
      // Find the product by ID
      const foundProduct = response.products.find((p: any) => p._id === id);
      
      if (foundProduct) {
        setProduct({
          id: foundProduct._id,
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price,
          discountedPrice: foundProduct.discountedPrice,
          images: foundProduct.images,
          category: foundProduct.category,
          material: foundProduct.material,
          lightModes: foundProduct.lightModes,
          charging: foundProduct.charging,
          workingTime: foundProduct.workingTime,
          touchControl: foundProduct.touchControl,
          battery: foundProduct.battery,
          idealFor: foundProduct.idealFor,
          height: foundProduct.height,
          specifications: foundProduct.specifications,
          bulkDiscounts: foundProduct.bulkDiscounts || [],
          inStock: foundProduct.inStock,
          stock: (foundProduct as any).stock || 0,
          averageRating: foundProduct.averageRating,
          totalRatings: foundProduct.totalRatings,
        });

        // Get recommended products (same category, exclude current product)
        const recommended = response.products
          .filter((p: APIProduct) => p._id !== id && p.category === foundProduct.category && p.inStock)
          .slice(0, 4)
          .map((p: APIProduct) => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            discountedPrice: p.discountedPrice,
            images: p.images,
            category: p.category,
            material: p.material,
            lightModes: p.lightModes,
            charging: p.charging,
            workingTime: p.workingTime,
            touchControl: p.touchControl,
            battery: p.battery,
            idealFor: p.idealFor,
            height: p.height,
            specifications: p.specifications || [],
            bulkDiscounts: p.bulkDiscounts || [],
            inStock: p.inStock,
            stock: (p as any).stock || 0,
            averageRating: p.averageRating,
            totalRatings: p.totalRatings,
          }));
        setRecommendedProducts(recommended);
      }
    } catch (err) {
      const errorMessage = handleAPIError(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Go back to products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    await addToCart(product, selectedQuantity);
    toast.success(`Added ${selectedQuantity} item(s) to cart!`);
    navigate('/cart');
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to buy now');
      navigate('/login');
      return;
    }
    // Add to cart with selected quantity, then navigate to checkout
    await addToCart(product, selectedQuantity);
    navigate('/checkout');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative bg-slate-800 rounded-3xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500">
              <div className="relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="absolute top-6 right-6 bg-cyan-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-bold text-white">{product.category}</span>
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4 bg-slate-900/50">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-1 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-cyan-500 scale-105'
                          : 'border-slate-700 hover:border-cyan-500/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
                <span className="text-gray-400 ml-2">(4.8/5) 60 costumers</span>
              </div>
            </div>


            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-center text-white mb-6">Buy More. Save More.</h2>
              
              {product.bulkDiscounts && product.bulkDiscounts.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {product.bulkDiscounts
                    .sort((a, b) => a.minQuantity - b.minQuantity)
                    .map((bulk, index) => {
                      // Calculate homepage discount (if any)
                      const homepageDiscount = product.discountedPrice && product.price
                        ? ((product.price - product.discountedPrice) / product.price) * 100
                        : 0;
                      // Calculate total discount: homepage + bulk
                      const totalDiscount = homepageDiscount + bulk.discount;
                      // Calculate price per unit after both discounts
                      const basePrice = product.price;
                      // First apply homepage discount, then bulk discount
                      const afterHomepage = product.discountedPrice || product.price;
                      const pricePerUnit = afterHomepage * (1 - bulk.discount / 100);
                      const savings = basePrice - pricePerUnit;
                      const isSelected = selectedBulkIndex === index;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedBulkIndex(index);
                            setSelectedQuantity(bulk.minQuantity);
                          }}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-cyan-500 bg-slate-700/50 shadow-lg shadow-cyan-500/20'
                              : 'border-slate-600 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-700/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-500'
                              }`}>
                                {isSelected && (
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div className="text-left">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg font-bold text-white">Buy {bulk.minQuantity}</span>
                                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {totalDiscount.toFixed(0)}% OFF
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400 italic">{
                                  bulk.minQuantity === 1 ? 'Single Qty' :
                                  bulk.minQuantity === 2 ? 'Double Qty' :
                                  bulk.minQuantity === 3 ? 'Triple Qty' :
                                  `${bulk.minQuantity}x Qty`
                                }</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  Save ₹{(savings * bulk.minQuantity).toFixed(0)}
                                </span>
                              </div>
                              <div className="flex items-center justify-end space-x-2 mt-2">
                                <span className="text-2xl font-bold text-cyan-400">Rs. {(pricePerUnit * bulk.minQuantity).toFixed(0)}</span>
                              </div>
                              <div className="flex items-center justify-end space-x-2">
                                <span className="text-sm text-orange-400 line-through">Rs. {(basePrice * bulk.minQuantity).toFixed(0)}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-xl border-2 border-cyan-500 bg-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-500 bg-cyan-500 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-white">Buy 1</span>
                          {product.discountedPrice && (
                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 italic">Single Qty</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {product.discountedPrice && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Save ₹{(product.price - product.discountedPrice).toFixed(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-2xl font-bold text-cyan-400">Rs. {product.discountedPrice || product.price}</span>
                      </div>
                      {product.discountedPrice && (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-sm text-orange-400 line-through">Rs. {product.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-right mb-4">
                <p className={`text-sm font-semibold ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>

              {user && user.isAdmin ? (
                <div className="w-full bg-slate-700/50 border border-cyan-500/30 text-cyan-400 font-semibold py-4 rounded-xl flex items-center justify-center space-x-3">
                  <Lightbulb className="h-6 w-6" />
                  <span className="text-lg">Admin View - Purchase Disabled</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg font-semibold mb-2 justify-center">
                    <Tag className="h-5 w-5 text-yellow-600" />
                    <span>Special Offer: Pay Online &amp; Get Flat ₹50 OFF!</span>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white border-2 border-orange-500 font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-lg">Add to cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-r from-slate-900 to-black hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-slate-700"
                  >
                    <span className="text-lg">Buy it now</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/10 p-4 flex flex-col items-center justify-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-500" style={{ width: 36, height: 36 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package" viewBox="0 0 24 24"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7L12 12.4l8.7-5.4"/></svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-black dark:text-white">Easy</span>
                    <span className="text-sm text-black dark:text-white">Returns</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-500" style={{ width: 36, height: 36 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck" viewBox="0 0 24 24"><rect width="8" height="13" x="1" y="3" rx="2"/><path d="M16 8V3a1 1 0 0 1 1-1h2.14a2 2 0 0 1 1.72 1l2.14 3.57A2 2 0 0 1 23 8v6a2 2 0 0 1-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-black dark:text-white">Free</span>
                    <span className="text-sm text-black dark:text-white">Shipping</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-500" style={{ width: 36, height: 36 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-percent" viewBox="0 0 24 24"><path d="M7.5 7.5h.01"/><path d="M16.5 16.5h.01"/><path d="m8 16 8-8"/><circle cx="12" cy="12" r="10"/></svg>

                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-black dark:text-white">Money-back</span>
                    <span className="text-sm text-black dark:text-white">Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Description</h3>
              <div className="text-gray-300 leading-relaxed space-y-2 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/10 p-6">
                {product.description.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="text-base">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                <span>Specifications</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Material</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.material}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Light Modes</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.lightModes}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Charging</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.charging}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Working Time</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.workingTime}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Touch Control</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.touchControl}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Battery</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.battery}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Ideal For</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.idealFor}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Height</p>
                    <p className="text-sm sm:text-base text-white font-semibold break-words">{product.height}</p>
                  </div>
                </div>
                {product.specifications && product.specifications.length > 0 && 
                  product.specifications.map((spec, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-400">{spec.key}</p>
                        <p className="text-sm sm:text-base text-white font-semibold break-words">{spec.value}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/10 p-4 sm:p-6">
                          <div className="flex justify-end mb-4 sm:mb-6">
                            <button
                              onClick={handleShare}
                              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
                            >
                              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="text-sm sm:text-base">Share Prod</span>
                            </button>
                          </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-gray-300">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
                  <span>Advanced LED technology</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-300">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
                  <span>Energy efficient design</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-300">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
                  <span>Long-lasting performance</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-300">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
                  <span>Easy installation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-12">
          <RatingComponent productId={id!} />
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Recommended <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">For You</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recProduct) => (
                <ProductCard key={recProduct.id} product={recProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
