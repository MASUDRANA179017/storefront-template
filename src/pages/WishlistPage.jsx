import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

export function WishlistPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .getWishlist(token)
      .then((res) => setProducts(res.data ?? res))
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading) return <div className="p-16 flex justify-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl font-bold mb-6">Your Wishlist</h1>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl aspect-square" />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">You haven't saved anything yet.</p>
          <Link to="/" className="icon-btn-accent inline-block px-6 py-2.5 rounded-xl font-bold text-sm shadow-soft">
            Continue shopping
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
