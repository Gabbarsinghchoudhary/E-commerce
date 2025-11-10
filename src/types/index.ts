export interface Product {
  id: string;
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
