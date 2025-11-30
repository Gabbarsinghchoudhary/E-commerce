import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Convert backend Product to frontend format
interface Product {
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

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from backend when user is authenticated
  const loadCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const response = await cartAPI.getCart();
      if (response.success && response.cart) {
        // Transform backend cart format to frontend format
        const transformedCart = response.cart.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          discountedPrice: item.product.discountedPrice,
          tax: item.product.tax || 10,
          images: item.product.images,
          category: item.product.category,
          wattage: item.product.wattage,
          lumens: item.product.lumens,
          colorTemp: item.product.colorTemp,
          lifespan: item.product.lifespan,
          specifications: item.product.specifications || [],
          inStock: item.product.inStock,
          averageRating: item.product.averageRating,
          totalRatings: item.product.totalRatings,
          quantity: item.quantity,
        }));
        setCart(transformedCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  // Initialize cart when component mounts or user changes
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    if (user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartAPI.addToCart(product.id, 1);
      if (response.success) {
        await loadCart(); // Reload cart from backend
        toast.success('Added to cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      return;
    }

    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.success) {
        await loadCart(); // Reload cart from backend
        toast.success('Removed from cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      if (response.success) {
        await loadCart(); // Reload cart from backend
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await cartAPI.clearCart();
      if (response.success) {
        setCart([]);
        toast.success('Cart cleared');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = (item as any).discountedPrice || item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};