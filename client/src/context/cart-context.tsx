import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@shared/schema";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("moony_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Save to localStorage whenever items change
  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("moony_cart", JSON.stringify(newItems));
    } catch {}
  };

  const addToCart = useCallback((product: Product, size: string, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      let newItems;
      if (existing) {
        newItems = prev.map(i =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [...prev, { product, size, quantity }];
      }
      try { localStorage.setItem("moony_cart", JSON.stringify(newItems)); } catch {}
      return newItems;
    });
    setIsOpen(true); // Auto-open cart on add
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => !(i.product.id === productId && i.size === size));
      try { localStorage.setItem("moony_cart", JSON.stringify(newItems)); } catch {}
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setItems(prev => {
      let newItems;
      if (quantity <= 0) {
        newItems = prev.filter(i => !(i.product.id === productId && i.size === size));
      } else {
        newItems = prev.map(i =>
          i.product.id === productId && i.size === size ? { ...i, quantity } : i
        );
      }
      try { localStorage.setItem("moony_cart", JSON.stringify(newItems)); } catch {}
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem("moony_cart"); } catch {}
  }, []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isOpen, openCart, closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
