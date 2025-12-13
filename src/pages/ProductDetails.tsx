import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Zap, Lightbulb, Clock, Star, ChevronLeft, ChevronRight, Share2, Package } from 'lucide-react';
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

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to buy now');
      navigate('/login');
      return;
    }
    // Optionally add to cart or pass product info to checkout
    navigate('/checkout', { state: { product } });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
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
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
                <span className="text-gray-400 ml-2">(4.8/5)</span>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-cyan-400" />
                <span>Specifications</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Material</p>
                    <p className="text-white font-semibold">{product.material}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Light Modes</p>
                    <p className="text-white font-semibold">{product.lightModes}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Charging</p>
                    <p className="text-white font-semibold">{product.charging}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Working Time</p>
                    <p className="text-white font-semibold">{product.workingTime}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-amber-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Touch Control</p>
                    <p className="text-white font-semibold">{product.touchControl}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-rose-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Battery</p>
                    <p className="text-white font-semibold">{product.battery}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-indigo-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Ideal For</p>
                    <p className="text-white font-semibold">{product.idealFor}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-teal-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Height</p>
                    <p className="text-white font-semibold">{product.height}</p>
                  </div>
                </div>
                {product.specifications && product.specifications.length > 0 && 
                  product.specifications.map((spec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Package className="h-5 w-5 text-amber-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">{spec.key}</p>
                        <p className="text-white font-semibold">{spec.value}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Bulk Discount Section */}
            {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-400" />
                  <span>Bulk Purchase Discounts - Click to Add</span>
                </h3>
                <div className="space-y-3">
                  {product.bulkDiscounts
                    .sort((a, b) => a.minQuantity - b.minQuantity)
                    .map((bulk, index) => (
                      <button 
                        key={index} 
                        onClick={async () => {
                          if (!user) {
                            toast.error('Please login to add items to cart');
                            navigate('/login');
                            return;
                          }
                          // Add the product with the specific quantity in one call
                          await addToCart(product, bulk.minQuantity);
                          toast.success(`Added ${bulk.minQuantity} items to cart with ${bulk.discount}% discount!`);
                          navigate('/cart');
                        }}
                        className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-green-500/20 hover:bg-slate-700/50 hover:border-green-400/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors">
                            <span className="text-green-400 font-bold text-lg">{bulk.minQuantity}+</span>
                          </div>
                          <div className="text-left">
                            <p className="text-white font-semibold group-hover:text-green-400 transition-colors">Buy {bulk.minQuantity} or more</p>
                            <p className="text-sm text-gray-400">Get {bulk.discount}% off each item</p>
                          </div>
                        </div>
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold group-hover:scale-110 transition-transform">
                          -{bulk.discount}%
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-cyan-500/20 p-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Price</p>
                  <div className="flex items-center space-x-4">
                    {product.discountedPrice ? (
                      <>
                        <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          ₹ {product.discountedPrice}
                        </span>
                        <span className="text-2xl font-semibold text-gray-400 line-through">
                          ₹ {product.price}
                        </span>
                        <span className="text-lg font-semibold text-green-400">
                          {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ₹ {product.price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {user && user.isAdmin ? (
                <div className="w-full bg-slate-700/50 border border-cyan-500/30 text-cyan-400 font-semibold py-4 rounded-xl flex items-center justify-center space-x-3">
                  <Lightbulb className="h-6 w-6" />
                  <span className="text-lg">Admin View - Purchase Disabled</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-lg">Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="text-lg">Buy Now</span>
                  </button>
                </>
              )}
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/10 p-6">
                          <div className="flex justify-end mt-6">
                            <button
                              onClick={handleShare}
                              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
                            >
                              <Share2 className="h-5 w-5" />
                              <span>Share Product</span>
                            </button>
                          </div>
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
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
