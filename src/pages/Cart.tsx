import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getBulkDiscountPrice } = useCart();

  // Get applicable bulk discount for an item
  const getApplicableBulkDiscount = (item: any) => {
    const bulkDiscounts = item.bulkDiscounts || [];
    if (bulkDiscounts.length === 0) return null;

    const applicable = bulkDiscounts
      .filter((bulk: any) => item.quantity >= bulk.minQuantity)
      .sort((a: any, b: any) => b.discount - a.discount)[0];

    return applicable || null;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some lighting products to get started</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors duration-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-white font-semibold text-lg w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors duration-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        {(() => {
                          const bulkDiscount = getApplicableBulkDiscount(item);
                          // Homepage discount (if any)
                          const homepageDiscount = item.discountedPrice && item.price
                            ? ((item.price - item.discountedPrice) / item.price) * 100
                            : 0;
                          // Total discount: homepage + bulk
                          const totalDiscount = homepageDiscount + (bulkDiscount ? bulkDiscount.discount : 0);
                          // Base price is item.price
                          const afterHomepage = item.discountedPrice || item.price;
                          const pricePerItem = getBulkDiscountPrice(item);
                          const totalPrice = pricePerItem * item.quantity;
                          const originalPrice = item.price;
                          return (
                            <>
                              <div className="flex items-center justify-end space-x-2 mb-1">
                                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                  ₹ {totalPrice.toFixed(2)}
                                </p>
                                {bulkDiscount && (
                                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {totalDiscount.toFixed(0)}% OFF
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">
                                ₹ {pricePerItem.toFixed(2)} each
                                {bulkDiscount && (
                                  <span className="ml-2 text-orange-400 line-through">
                                    (was ₹{(originalPrice).toFixed(2)})
                                  </span>
                                )}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-cyan-500/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      ₹ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
