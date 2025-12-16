import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor - No longer needed to manually add token
// Token is now sent automatically via httpOnly cookies
api.interceptors.request.use(
  (config) => {
    // Keep for backward compatibility if needed, but cookie will be primary
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page to prevent loop
      if (currentPath !== '/login') {
        // Token is in httpOnly cookie, just clear user data
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
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
  specifications: Array<{ key: string; value: string }>;
  bulkDiscounts: Array<{ minQuantity: number; discount: number }>;
  inStock: boolean;
  stock: number;
  sortOrder?: number;
  averageRating?: number;
  totalRatings?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  isAdmin: boolean;
}

export interface OrderItem {
  product: string;
  productName: string;
  productPrice?: number; // Optional - backend calculates for security
  quantity: number;
}

export interface Order {
  _id: string;
  orderId?: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  tax: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentInfo: {
    cardLastFour: string;
  };
  status: 'Order Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
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
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  _id?: string;
  email: string;
  addedBy?: string | null;
  dateAdded: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  createdAt: string;
}

// ============ Auth APIs ============
export const authAPI = {
  sendOtp: async (email: string) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// ============ Product APIs ============
export const productAPI = {
  getAllProducts: async (): Promise<{ products: Product[] }> => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: string): Promise<{ product: Product }> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: Omit<Product, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<{ products: Product[] }> => {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  },
};

// ============ Cart APIs ============
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId: string, quantity: number) => {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// ============ Order APIs ============
export const orderAPI = {
  createOrder: async (orderData: {
    items: OrderItem[];
    shippingAddress: Order['shippingAddress'];
    paymentInfo?: any;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  trackOrder: async (orderId: string): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/${orderId}/track`);
    return response.data;
  },

  // Admin only
  getAllOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders/all');
    return response.data;
  },

  updateOrderStatus: async (orderId: string, statusData: { status: Order['status']; description: string; location?: string; trackingDetails?: any }) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },
};

// ============ Profile APIs ============
export const profileAPI = {
  getProfile: async (): Promise<{ profile: User }> => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData: { name?: string; phone?: string; address?: string; city?: string; zipCode?: string }) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
};

// ============ Admin APIs ============
export const adminAPI = {
  getAllAdmins: async (): Promise<{ admins: Admin[] }> => {
    const response = await api.get('/admin/admins');
    return response.data;
  },

  addAdmin: async (email: string) => {
    const response = await api.post('/admin/admins', { email });
    return response.data;
  },

  removeAdmin: async (email: string) => {
    const response = await api.delete(`/admin/admins/${email}`);
    return response.data;
  },

  getAllUsers: async (): Promise<{ users: AdminUser[] }> => {
    const response = await api.get('/admin/users');
    return response.data;
  },
};

// ============ Contact APIs ============
export const contactAPI = {
  submitContact: async (contactData: { name: string; email: string; subject: string; message: string }) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  getAllMessages: async () => {
    const response = await api.get('/admin/contact/messages');
    return response.data;
  },
};

// ============ Rating APIs ============
export interface Rating {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export const ratingAPI = {
  submitRating: async (ratingData: { productId: string; rating: number; review?: string }) => {
    const response = await api.post('/ratings/submit', ratingData);
    return response.data;
  },

  getProductRatings: async (productId: string): Promise<{ ratings: Rating[]; averageRating: number; totalRatings: number }> => {
    const response = await api.get(`/ratings/product/${productId}`);
    return response.data;
  },

  getUserRating: async (productId: string): Promise<{ rating: Rating | null }> => {
    const response = await api.get(`/ratings/user/${productId}`);
    return response.data;
  },
};

// ============ Payment APIs ============
export const paymentAPI = {
  getRazorpayKey: async (): Promise<{ keyId: string }> => {
    const response = await api.get('/payment/key');
    return response.data;
  },

  createRazorpayOrder: async (amount: number): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  },
};

// Error handler helper
export const handleAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

export default api;
