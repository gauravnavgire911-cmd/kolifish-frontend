import React, { createContext, useEffect, useMemo, useState } from "react";

/**
 * Usage:
 *  - Wrap <CartProvider> around your <App />
 *  - In components: const { cartItems, addToCart, ... } = useCart();
 */

export const CartContext = createContext(null);

const STORAGE_KEY = "kolifish_cart_v1";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // [{ _id, name, price, qty, image, ... }]

  // Load cart from localStorage on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch (e) {
      // ignore corrupted storage
      setCartItems([]);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      // ignore storage quota errors
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    if (!product) return;

    const id = product._id || product.id || product.productId || product.slug;
    if (!id) {
      console.warn("addToCart: product has no id/_id", product);
      return;
    }

    const safeQty = Number.isFinite(Number(qty)) ? Math.max(1, Number(qty)) : 1;

    setCartItems((prev) => {
      const existing = prev.find((x) => (x._id || x.id) === id);
      if (existing) {
        return prev.map((x) =>
          (x._id || x.id) === id ? { ...x, qty: (x.qty || 1) + safeQty } : x
        );
      }
      return [
        ...prev,
        {
          ...product,
          _id: product._id ?? id, // normalize key
          qty: safeQty,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    if (!id) return;
    setCartItems((prev) => prev.filter((x) => (x._id || x.id) !== id));
  };

  const updateQty = (id, qty) => {
    if (!id) return;
    const q = Number(qty);
    if (!Number.isFinite(q)) return;

    setCartItems((prev) => {
      if (q <= 0) return prev.filter((x) => (x._id || x.id) !== id);
      return prev.map((x) =>
        (x._id || x.id) === id ? { ...x, qty: q } : x
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        return sum + price * qty;
      }, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [cartItems, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}