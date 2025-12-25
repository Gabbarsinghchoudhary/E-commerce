import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  // Calculate display price and original price
  const displayPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100)
    : 0;

  return (
    <div
      className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative h-64 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60"></div>

        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-orange-500 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm font-bold text-white">{discountPercentage}% OFF</span>
          </div>
        )}

        <button
          onClick={handleViewDetails}
          className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-500/80"
        >
          <Eye className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="relative p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-cyan-400 font-semibold">{product.material}</span>
          <span className="text-xs text-gray-500">|</span>
          <span className="text-xs text-gray-400">{product.height}</span>
        </div>

        <h3 className="text-sm sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 whitespace-pre-line">
          {product.description}
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Rs {displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-base font-semibold text-gray-400 line-through">
                  Rs {product.price}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            {user && isAdmin(user.email) ? (
            <button
              onClick={handleViewDetails}
              className="w-[90%] bg-slate-700 hover:bg-slate-600 text-gray-300 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-semibold">View</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-[90%] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-semibold">Add</span>
            </button>
            )}
          </div>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
            <span className="text-red-400 font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
    </div>
  );
};
