import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

// Wishlist is login-gated (matches the main marketplace's wishlist), so
// there's no localStorage/guest fallback here like CartContext has — the
// slug set is simply empty until a customer signs in.
export function WishlistProvider({ children }) {
  const { token } = useAuth();
  const [slugs, setSlugs] = useState(() => new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!token) {
      setSlugs(new Set());
      return;
    }
    setLoading(true);
    api
      .getWishlist(token)
      .then((res) => setSlugs(new Set((res.data ?? res).map((p) => p.slug))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggle(product) {
    if (!token) return null;
    const res = await api.toggleWishlist(product.slug, token);
    setSlugs((prev) => {
      const next = new Set(prev);
      if (res.in_wishlist) {
        next.add(product.slug);
      } else {
        next.delete(product.slug);
      }
      return next;
    });
    return res.in_wishlist;
  }

  function isWishlisted(slug) {
    return slugs.has(slug);
  }

  return (
    <WishlistContext.Provider value={{ count: slugs.size, loading, toggle, isWishlisted, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
