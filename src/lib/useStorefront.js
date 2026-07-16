import { useEffect, useState } from 'react';
import { api } from './api';

export function useStorefront() {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [flashSale, setFlashSale] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.getShop(),
      api.getProducts(),
      api.getProducts({ sort: 'best_selling', per_page: 8 }),
      api.getCategories(),
      api.getBanners(),
      api.getFlashSale(),
      api.getReviews({ limit: 6 }),
      api.getFaqs(),
    ])
      .then(([shopRes, productsRes, bestSellersRes, categoriesRes, bannersRes, flashSaleRes, reviewsRes, faqsRes]) => {
        if (cancelled) return;
        setShop(shopRes.data ?? shopRes);
        setProducts(productsRes.data ?? productsRes);
        setBestSellers(bestSellersRes.data ?? bestSellersRes);
        setCategories(categoriesRes);
        setBanners(bannersRes.data ?? bannersRes);
        setFlashSale(flashSaleRes.data ?? null);
        setReviews(reviewsRes.data ?? reviewsRes);
        setFaqs(faqsRes);
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

  return { shop, products, bestSellers, categories, banners, flashSale, reviews, faqs, loading, error };
}
