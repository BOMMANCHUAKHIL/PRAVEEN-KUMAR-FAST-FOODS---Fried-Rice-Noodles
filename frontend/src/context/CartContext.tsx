import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  productId: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.variant === newItem.variant
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        toast.success(`Updated ${newItem.name} quantity`);
        return updated;
      }
      toast.success(`${newItem.name} added to cart!`);
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId && i.variant === variant);
      if (item) toast.success(`Removed ${item.name} from cart`);
      return prev.filter((i) => !(i.productId === productId && i.variant === variant));
    });
  };

  const updateQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variant === variant ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

  const getTotalItems = () => items.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};