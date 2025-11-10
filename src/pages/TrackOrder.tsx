import { useState, useEffect } from 'react';
import { Package, Search, AlertCircle, MapPin, Truck, Calendar, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { orderAPI, Order } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface OrderDetails {
  orderId: string;
  status: string;
  statusHistory: {
    status: string;
    description: string;
    date: string;
    location?: string;
  }[];
  trackingDetails?: {
    currentLocation?: string;
    estimatedDelivery?: string;
    carrier?: string;
    trackingNumber?: string;
  };
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
  };
}

export const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    description: '',
    location: '',
    carrier: '',
    trackingNumber: '',
    currentLocation: '',
    estimatedDelivery: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        fetchAllOrders();
      } else {
        fetchUserOrders();
      }
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setUserOrders(response.orders || []);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    }
  };

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getAllOrders();
      setAllOrders(response.orders || []);
    } catch (err) {
      console.error('Failed to fetch all orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string) => {
    if (!statusUpdate.status || !statusUpdate.description) {
      toast.error('Please provide status and description');
      return;
    }

    try {
      await orderAPI.updateOrderStatus(orderId, {
        status: statusUpdate.status as Order['status'],
        description: statusUpdate.description,
        location: statusUpdate.location || undefined,
        trackingDetails: {
          carrier: statusUpdate.carrier || undefined,
          trackingNumber: statusUpdate.trackingNumber || undefined,
          currentLocation: statusUpdate.currentLocation || undefined,
          estimatedDelivery: statusUpdate.estimatedDelivery || undefined,
        },
      });

      toast.success('Order status updated successfully!');
      setEditingOrder(null);
      setStatusUpdate({
        status: '',
        description: '',
        location: '',
        carrier: '',
        trackingNumber: '',
        currentLocation: '',
        estimatedDelivery: '',
      });
      
      // Refresh orders list
      if (user?.isAdmin) {
        fetchAllOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackOrderById(orderId);
  };

  const trackOrderById = async (id: string) => {
    setIsLoading(true);
    setError('');
    setOrderDetails(null);
    
    try {
      const response = await orderAPI.trackOrder(id);
      
      if (response.order) {
        // Map the Order response to OrderDetails
        const order = response.order;
        setOrderDetails({
          orderId: order.orderId || order._id,
          status: order.status,
          statusHistory: order.statusHistory,
          trackingDetails: order.trackingDetails,
          shippingAddress: order.shippingAddress,
        });
      } else {
        setError('Unable to fetch order details');
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Invalid Order ID. Please check and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to track order. Please try again.');
      }
      toast.error(err.response?.data?.message || 'Failed to track order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {user?.isAdmin ? 'Track All Orders' : 'Track Your Order'}
          </h1>
          <p className="text-gray-400">
            {user?.isAdmin ? 'View and manage all customer orders' : 'Enter your order ID to track your package'}
          </p>
        </div>

        {/* Admin View: All Orders List */}
        {user?.isAdmin ? (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              </div>
            ) : allOrders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {allOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          Order: {order.orderId || order._id}
                        </h3>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Customer: {order.shippingAddress.fullName}</p>
                          <p>Email: {order.shippingAddress.email}</p>
                          <p>Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                          <p>Items: {order.items.length}</p>
                          <p>Total: ${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <p className="text-sm text-gray-400 mb-2">Current Status</p>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'Out for Delivery' ? 'bg-purple-500/20 text-purple-400' :
                          order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Update Status Form */}
                    {editingOrder === order._id ? (
                      <div className="mt-6 pt-6 border-t border-cyan-500/20">
                        <h4 className="text-lg font-semibold text-white mb-4">Update Order Status</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Status *</label>
                            <select
                              value={statusUpdate.status}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white"
                            >
                              <option value="">Select Status</option>
                              <option value="Order Placed">Order Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Description *</label>
                            <input
                              type="text"
                              value={statusUpdate.description}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, description: e.target.value })}
                              placeholder="Status description"
                              className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Current Location</label>
                            <input
                              type="text"
                              value={statusUpdate.location}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, location: e.target.value })}
                              placeholder="e.g., Mumbai Warehouse"
                              className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Carrier</label>
                            <input
                              type="text"
                              value={statusUpdate.carrier}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, carrier: e.target.value })}
                              placeholder="e.g., FedEx, DHL"
                              className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Tracking Number</label>
                            <input
                              type="text"
                              value={statusUpdate.trackingNumber}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                              placeholder="Tracking number"
                              className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Estimated Delivery</label>
                            <input
                              type="date"
                              value={statusUpdate.estimatedDelivery}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, estimatedDelivery: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={() => handleStatusUpdate(order._id)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save Update</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrder(null);
                              setStatusUpdate({
                                status: '',
                                description: '',
                                location: '',
                                carrier: '',
                                trackingNumber: '',
                                currentLocation: '',
                                estimatedDelivery: '',
                              });
                            }}
                            className="flex items-center space-x-2 bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-all"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingOrder(order._id);
                          setStatusUpdate({
                            status: order.status,
                            description: '',
                            location: order.trackingDetails?.currentLocation || '',
                            carrier: order.trackingDetails?.carrier || '',
                            trackingNumber: order.trackingDetails?.trackingNumber || '',
                            currentLocation: order.trackingDetails?.currentLocation || '',
                            estimatedDelivery: order.trackingDetails?.estimatedDelivery || '',
                          });
                        }}
                        className="mt-4 flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Update Status</span>
                      </button>
                    )}

                    {/* Order History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-cyan-500/20">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Status History</h4>
                        <div className="space-y-2">
                          {order.statusHistory.map((history, idx) => (
                            <div key={idx} className="flex items-start space-x-3 text-sm">
                              <Calendar className="h-4 w-4 text-cyan-400 mt-0.5" />
                              <div>
                                <p className="text-white font-medium">{history.status}</p>
                                <p className="text-gray-400">{history.description}</p>
                                {history.location && <p className="text-gray-500">Location: {history.location}</p>}
                                <p className="text-gray-500 text-xs">{new Date(history.date).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Regular User View */
          <>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., OD1234567890)"
              className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {orderDetails && (
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => {
                setOrderDetails(null);
                setOrderId('');
                setError('');
              }}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to My Orders</span>
            </button>

            {/* Order Header */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Order ID: {orderDetails.orderId}</h2>
                  <p className="text-gray-400">Status: <span className="text-cyan-400 font-semibold">{orderDetails.status}</span></p>
                </div>
                {orderDetails.trackingDetails?.trackingNumber && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Tracking Number</p>
                    <p className="text-white font-semibold">{orderDetails.trackingDetails.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Details */}
            {orderDetails.trackingDetails && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Truck className="h-5 w-5 text-cyan-400 mr-2" />
                  Tracking Information
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {orderDetails.trackingDetails.currentLocation && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Current Location</p>
                        <p className="text-white font-medium">{orderDetails.trackingDetails.currentLocation}</p>
                      </div>
                    </div>
                  )}
                  {orderDetails.trackingDetails.estimatedDelivery && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Estimated Delivery</p>
                        <p className="text-white font-medium">
                          {new Date(orderDetails.trackingDetails.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {orderDetails.trackingDetails.carrier && (
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Carrier</p>
                        <p className="text-white font-medium">{orderDetails.trackingDetails.carrier}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status History */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Order Timeline</h3>
              <div className="relative">
                {orderDetails.statusHistory && orderDetails.statusHistory.length > 0 ? (
                  orderDetails.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-start mb-8 last:mb-0">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        {index !== orderDetails.statusHistory.length - 1 && (
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-cyan-500/30"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-lg font-semibold text-white">{status.status}</h4>
                        <p className="text-gray-400 text-sm mb-1">{status.description}</p>
                        {status.location && (
                          <p className="text-cyan-400 text-sm mb-1 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {status.location}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm">{new Date(status.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Order is being processed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User's Recent Orders */}
        {user && userOrders.length > 0 && !orderDetails && !error && (
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Recent Orders</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {userOrders.slice(0, 6).map((order) => (
                <div
                  key={order._id}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4 hover:border-cyan-500/50 transition-all cursor-pointer"
                  onClick={() => trackOrderById(order.orderId || order._id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">{order.orderId}</p>
                      <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    ${order.totalAmount.toFixed(2)} • {order.items.length} item(s)
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};