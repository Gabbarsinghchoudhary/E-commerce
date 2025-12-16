export interface Product {
  id: string;
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
  averageRating?: number;
  totalRatings?: number;
  sortOrder?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Admin {
  email: string;
  addedBy?: string;
  dateAdded: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
