import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Product, CartItem } from '../types';

// Use shared types from types/index.ts

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loadCart: () => Promise<void>;
  getBulkDiscountPrice: (item: CartItem) => number;
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
          images: item.product.images,
          category: item.product.category,
          material: item.product.material,
          lightModes: item.product.lightModes,
          charging: item.product.charging,
          workingTime: item.product.workingTime,
          touchControl: item.product.touchControl,
          battery: item.product.battery,
          idealFor: item.product.idealFor,
          height: item.product.height,
          specifications: item.product.specifications || [],
          bulkDiscounts: item.product.bulkDiscounts || [],
          inStock: item.product.inStock,
          stock: item.product.stock || 0,
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

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartAPI.addToCart(product.id, quantity);
      if (response.success) {
        await loadCart(); // Reload cart from backend
        toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
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

  const getBulkDiscountPrice = (item: CartItem) => {
    const basePrice = (item as any).discountedPrice || item.price;
    const bulkDiscounts = (item as any).bulkDiscounts || [];
    
    if (bulkDiscounts.length === 0) {
      return basePrice;
    }

    // Find the applicable bulk discount based on quantity
    const applicableDiscount = bulkDiscounts
      .filter((bulk: any) => item.quantity >= bulk.minQuantity)
      .sort((a: any, b: any) => b.discount - a.discount)[0];

    if (applicableDiscount) {
      return basePrice * (1 - applicableDiscount.discount / 100);
    }

    return basePrice;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const pricePerItem = getBulkDiscountPrice(item);
      return total + pricePerItem * item.quantity;
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
        getBulkDiscountPrice,
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