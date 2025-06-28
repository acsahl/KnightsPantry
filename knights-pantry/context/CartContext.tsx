import React, { createContext, useContext, useState } from 'react';

export type CartItem = {
  title: string;
  description: string;
  category: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  showNotificationOverlay: boolean;
  setShowNotificationOverlay: (show: boolean) => void;
  selectedPickupTime: string;
  setSelectedPickupTime: (time: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
  const [selectedPickupTime, setSelectedPickupTime] = useState('ASAP');

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      showNotificationOverlay, 
      setShowNotificationOverlay,
      selectedPickupTime,
      setSelectedPickupTime
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
} 