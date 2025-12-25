import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Product } from '../types';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, loadCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Handle Buy Now - single product checkout
  const buyNowProduct = location.state?.product as Product | undefined;
  const isBuyNow = !!buyNowProduct;
  
  // Use buyNow product or cart items
  const checkoutItems = isBuyNow && buyNowProduct ? [{ ...buyNowProduct, quantity: 1 }] : cart;

  // Get bulk discount price for an item
  const getBulkDiscountPriceForCheckout = (item: any) => {
    const basePrice = item.discountedPrice || item.price;
    const bulkDiscounts = item.bulkDiscounts || [];
    
    if (bulkDiscounts.length === 0) {
      return basePrice;
    }

    const applicableDiscount = bulkDiscounts
      .filter((bulk: any) => item.quantity >= bulk.minQuantity)
      .sort((a: any, b: any) => b.discount - a.discount)[0];

    if (applicableDiscount) {
      return basePrice * (1 - applicableDiscount.discount / 100);
    }

    return basePrice;
  };

  // Calculate total price with bulk discounts
  const getTotalPriceForCheckout = () => {
    return checkoutItems.reduce((total, item) => {
      const pricePerItem = getBulkDiscountPriceForCheckout(item);
      return total + (pricePerItem * item.quantity);
    }, 0);
  };

  // Calculate grand total (before online discount)
  const getGrandTotal = () => {
    return getTotalPriceForCheckout();
  };

  // Calculate online payment total (₹50 OFF)
  const getOnlinePaymentTotal = () => {
    const total = getGrandTotal();
    return total > 50 ? total - 50 : 0;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    houseNo: '',
    roadArea: '',
    landmark: '',
    address: '', // Will be composed for backend
    city: '',
    state: '',
    zipCode: '',
    fullAddress: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Online payment handler (Razorpay)
  const handleOnlinePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const onlineTotal = getOnlinePaymentTotal();

      // Compose full address for backend (if fullAddress provided, use it, else compose)
      const composedAddress = formData.fullAddress.trim()
        ? formData.fullAddress.trim()
        : `${formData.houseNo}, ${formData.roadArea}, ${formData.city}, ${formData.state} - ${formData.zipCode}${formData.landmark ? ', Landmark: ' + formData.landmark : ''}`;

      // Create Razorpay order
      const paymentOrderResponse = await paymentAPI.createRazorpayOrder(onlineTotal);

      // Initialize Razorpay checkout
      const options = {
        key: paymentOrderResponse.keyId,
        amount: paymentOrderResponse.amount,
        currency: paymentOrderResponse.currency,
        name: 'DecorMitra',
        description: 'Order Payment',
        order_id: paymentOrderResponse.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create order after successful payment
            const orderData = {
              items: checkoutItems.map(item => ({
                product: item.id,
                productName: item.name,
                quantity: item.quantity,
              })),
              shippingAddress: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                houseNo: formData.houseNo,
                roadArea: formData.roadArea,
                landmark: formData.landmark,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                address: composedAddress,
                fullAddress: formData.fullAddress,
              },
              paymentInfo: {},
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              paymentType: 'Online',
              onlineDiscount: 50,
            };

            const orderResponse = await orderAPI.createOrder(orderData);

            setIsComplete(true);
            setOrderId(orderResponse.order.orderId);

            if (!isBuyNow) {
              await loadCart();
            }

            setTimeout(() => {
              navigate('/track-order');
            }, 3000);
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to place order');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
        theme: {
          color: '#06b6d4',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  // Cash on Delivery handler
  const handleCOD = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const grandTotal = getGrandTotal();
      const composedAddress = formData.fullAddress.trim()
        ? formData.fullAddress.trim()
        : `${formData.houseNo}, ${formData.roadArea}, ${formData.city}, ${formData.state} - ${formData.zipCode}${formData.landmark ? ', Landmark: ' + formData.landmark : ''}`;
      const orderData = {
        items: checkoutItems.map(item => ({
          product: item.id,
          productName: item.name,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          houseNo: formData.houseNo,
          roadArea: formData.roadArea,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          address: composedAddress,
          fullAddress: formData.fullAddress,
        },
        paymentInfo: {},
        paymentType: 'COD',
      };
      const orderResponse = await orderAPI.createOrder(orderData);
      setIsComplete(true);
      setOrderId(orderResponse.order.orderId);
      if (!isBuyNow) {
        await loadCart();
      }
      setTimeout(() => {
        navigate('/track-order');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsProcessing(false);
    }
  };

  if (checkoutItems.length === 0 && !isComplete && !isBuyNow) {
    navigate('/cart');
    return null;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 relative">
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto animate-bounce" />
            <div className="absolute inset-0 h-24 w-24 mx-auto text-green-400 blur-2xl opacity-50"></div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-400 mb-4">Thank you for your purchase.</p>
          
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 mb-6">
            <p className="text-gray-400 text-sm mb-2">Your Order ID</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {orderId}
            </p>
            <p className="text-gray-400 text-xs mt-2">Save this ID to track your order</p>
          </div>
          
          <p className="text-gray-400 mb-4">Redirecting to track order page...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      House No. / Flat No. / Building *
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      value={formData.houseNo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="A-101, Green Apartments"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Address (Optional)
                    </label>
                    <input
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="Enter complete address if different from above"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Road / Colony / Area *
                    </label>
                    <input
                      type="text"
                      name="roadArea"
                      value={formData.roadArea}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="MG Road, Sector 21"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="Near City Mall"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="Delhi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Payment Method</h2>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/30">
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-semibold text-cyan-400">Secure Payment via Razorpay</span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    All transactions are encrypted and secured. We accept UPI, Cards, Net Banking, and Wallets.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOnlinePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Pay ₹ {getOnlinePaymentTotal().toFixed(2)} (Online - ₹50 OFF)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCOD}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Cash on Delivery (₹{getGrandTotal().toFixed(2)})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => {
                  const pricePerItem = getBulkDiscountPriceForCheckout(item);
                  const totalItemPrice = pricePerItem * item.quantity;
                  const bulkDiscounts = (item as any).bulkDiscounts || [];
                  const applicableBulk = bulkDiscounts
                    .filter((bulk: any) => item.quantity >= bulk.minQuantity)
                    .sort((a: any, b: any) => b.discount - a.discount)[0];
                  // Homepage discount (if any)
                  const homepageDiscount = item.discountedPrice && item.price
                    ? ((item.price - item.discountedPrice) / item.price) * 100
                    : 0;
                  // Total discount: homepage + bulk
                  const totalDiscount = homepageDiscount + (applicableBulk ? applicableBulk.discount : 0);
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {item.name} x {item.quantity}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">
                            ₹ {totalItemPrice.toFixed(2)}
                          </span>
                          {applicableBulk && (
                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {totalDiscount.toFixed(0)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      {applicableBulk && (
                        <p className="text-xs text-green-400">
                          You saved with more piece pricing: ₹{pricePerItem.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-cyan-500/20 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹ {getTotalPriceForCheckout().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-cyan-500/20 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      ₹ {getGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
