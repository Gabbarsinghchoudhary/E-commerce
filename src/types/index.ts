export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  tax: number;
  images: string[];
  category: string;
  wattage: string;
  lumens: number;
  colorTemp: string;
  lifespan: string;
  specifications: Array<{ key: string; value: string }>;
  inStock: boolean;
  stock: number;
  averageRating?: number;
  totalRatings?: number;
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
