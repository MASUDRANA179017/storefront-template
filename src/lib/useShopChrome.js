import { useEffect, useState } from 'react';
import { api } from './api';

// Lighter than useStorefront() — fetches only what the shared Header/Footer
// need (shop + categories), for pages that aren't the homepage and don't
// need products/banners/flash-sale/reviews/faqs too.
export function useShopChrome() {
  const [shop, setShop] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.getShop(), api.getCategories()])
      .then(([shopRes, categoriesRes]) => {
        if (cancelled) return;
        setShop(shopRes.data ?? shopRes);
        setCategories(categoriesRes);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { shop, categories, loading, error };
}
