import { useState, useEffect } from 'react';
import { Zap, Star, TrendingUp, Sparkles, Shield, Truck, HeadphonesIcon, Award } from 'lucide-react';
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
        averageRating: p.averageRating,
        totalRatings: p.totalRatings,
      }));
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Illuminate Your Future
            </h1>
            <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of smart lighting technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20">
            <Zap className="h-12 w-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Energy Efficient</h3>
            <p className="text-gray-400">Save up to 80% on energy costs</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <Star className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Smart Control</h3>
            <p className="text-gray-400">Control from anywhere, anytime</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <TrendingUp className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Long Lasting</h3>
            <p className="text-gray-400">Up to 50,000 hours lifespan</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-cyan-500/20'
                }`}
              >
                {category}
              </button>
            ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <Shield className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Guarantee</h3>
              <p className="text-gray-400">
                All products come with manufacturer warranty and quality assurance
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
              <p className="text-gray-400">
                Free shipping on all orders with quick and reliable delivery
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2">
              <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
              <p className="text-gray-400">
                Our customer service team is always ready to help you
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Best Prices</h3>
              <p className="text-gray-400">
                Competitive pricing with regular discounts and special offers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
