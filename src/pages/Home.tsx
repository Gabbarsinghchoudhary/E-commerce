import { useState, useEffect } from 'react';
import { Zap, Star, TrendingUp, Sparkles, Truck, CreditCard, RefreshCw, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductCard } from '../components/ProductCard';
import { productAPI, Product as APIProduct, handleAPIError } from '../services/api';
import { Product } from '../types';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Smart', 'RGB', 'Energy Efficient', 'Industrial', 'Standard', 'Wellness', 'Outdoor', 'Dimmable'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();

      // Convert backend products to frontend format
      const convertedProducts: Product[] = response.products.map((p: APIProduct) => ({
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
        specifications: p.specifications,
        bulkDiscounts: p.bulkDiscounts || [],
        inStock: p.inStock,
        stock: (p as any).stock || 0,
        sortOrder: (p as any).sortOrder || 0,
        averageRating: p.averageRating,
        totalRatings: p.totalRatings,
      }));

      // Products are already sorted by backend (sortOrder, then createdAt)

      setProducts(convertedProducts);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Promotional Banner */}
        <div className="mb-12 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl" style={{ position: 'relative' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-500/20 to-amber-500/20 backdrop-blur-sm"></div>
            <img
              src="images/promo.webp"
              alt="Decorative background"
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
              style={{ borderRadius: '1rem', pointerEvents: 'none' }}
            />
          <div className="relative z-10">
            <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-4 py-1 rounded-full mb-4 shadow-lg">
              <span className="text-black text-sm font-bold uppercase tracking-wider drop-shadow">Limited Time Only</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-pulse bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
              FINAL SEASON-END SALE
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-3 py-1 rounded-lg text-black shadow-lg">up to <span className="text-5xl md:text-6xl font-extrabold">60% OFF</span></span>
            </p>
            <p className="text-xl md:text-2xl font-semibold mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-3 py-1 rounded-lg text-black shadow-lg inline-block">
              Limited Stock Only
            </p>
            <p className="text-lg md:text-xl italic bg-black/70 text-yellow-300 px-3 py-1 rounded-lg mt-2 inline-block shadow-lg">
              Once it's gone, it's gone.
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="text-gray-400 mt-4">Loading products...</p>
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No products found in this category</p>
              </div>
            )}
          </>
        )}

        {/* Why Us Section */}
        <div className="mt-20 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're committed to providing the best products and services to our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2">
              <div className="bg-cyan-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Free Express Shipping</h3>
              <p className="text-gray-400">
                Fast Pan-India delivery in 5 – 7 working days with tracking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pay Online, Get Faster Delivery</h3>
              <p className="text-gray-400">
                Secure payments with UPI & Cards. Priority processing on prepaid orders.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2">
              <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">7-Day Easy Replacement</h3>
              <p className="text-gray-400">
                Received damaged? We replace it—no questions asked.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Always-On WhatsApp Support</h3>
              <p className="text-gray-400">
                Real support, real people. We're here 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Testimonials Section */}
        <div className="mt-20 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
              What our customers say about us…
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real experiences from real customers who trust DecorMitra for their lighting needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Rajesh Kumar</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "Excellent quality! The RGB lamp exceeded my expectations. Fast delivery and great customer service. Highly recommend DecorMitra for home décor!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Priya Sharma</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "Beautiful products and amazing packaging! The smart lamp features are incredible. Love the touch control and multiple light modes. Worth every penny!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Amit Patel</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "Fantastic experience! Quick delivery, excellent quality, and the WhatsApp support team was very helpful. The discounts made it even better!"
              </p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Sneha Verma</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "Transformed my living room! The energy-efficient lamps are perfect. Great quality at affordable prices. Will definitely order again!"
              </p>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  V
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Vikram Singh</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "Professional service and premium quality products. The bulk discount offer was perfect for my office setup. Highly satisfied customer!"
              </p>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Meera Joshi</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "Simply amazing! The lamps are beautiful and functional. Free shipping and easy replacement policy made shopping stress-free. Thank you DecorMitra!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
