import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const queryParams = new URLSearchParams(window.location.search);
const SHOP_SLUG = queryParams.get('shop') || import.meta.env.VITE_SHOP_SLUG;
const STORAGE_KEY = `cart:${SHOP_SLUG}`;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      const maxQty = product.stock_quantity ?? Infinity;

      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, quantity: Math.min(i.quantity + quantity, maxQty) } : i
        );
      }

      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.effective_price,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          quantity: Math.min(quantity, maxQty),
        },
      ];
    });
    setDrawerOpen(true);
  }

  function updateQuantity(slug, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock_quantity ?? Infinity)) } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(slug) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, subtotal, itemCount, isDrawerOpen, setDrawerOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
