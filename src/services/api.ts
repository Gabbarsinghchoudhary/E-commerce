import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      // Unauthorized - clear token and redirect to login
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page to prevent loop
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
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
  images: string[];
  category: string;
  wattage: string;
  lumens: number;
  colorTemp: string;
  lifespan: string;
  inStock: boolean;
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
  productPrice: number;
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
    paymentInfo: Order['paymentInfo'];
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

// Error handler helper
export const handleAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

export default api;
