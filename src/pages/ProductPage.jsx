import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';

function ZoomableImage({ src, alt }) {
  const [zoomStyle, setZoomStyle] = useState({});
  const [zoomed, setZoomed] = useState(false);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  }

  return (
    <div
      className="aspect-square bg-gray-100 overflow-hidden rounded-2xl cursor-zoom-in"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-200 ${zoomed ? 'scale-[2]' : 'scale-100'}`}
          style={zoomStyle}
        />
      )}
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    api.getProduct(slug).then((res) => setProduct(res.data ?? res));
    api.getReviews({ product: slug, limit: 20 }).then((res) => setReviews(res.data ?? res));
  }, [slug]);

  useEffect(() => {
    if (!product?.category) {
      setRelated([]);
      return;
    }
    api.getProducts({ category: product.category.slug }).then((res) => {
      const list = (res.data ?? res).filter((p) => p.slug !== product.slug).slice(0, 4);
      setRelated(list);
    });
  }, [product?.category, product?.slug]);

  useEffect(() => {
    if (!addToCartRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(addToCartRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (!product) return <div className="p-16 flex justify-center"><div className="spinner" /></div>;

  const outOfStock = product.stock_quantity <= 0;
  const gallery = [product.image_url, ...(product.images || [])].filter(Boolean);

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/category/${product.category.slug}`} className="hover:text-gray-900 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <ZoomableImage src={gallery[activeImage]} alt={product.name} />
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImage ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>
          <StarRating rating={product.average_rating} className="mt-2" />
          <p className="mt-2 text-xl font-semibold">${product.effective_price.toFixed(2)}</p>
          <p className="mt-4 text-gray-600 whitespace-pre-line">{product.description}</p>

          {outOfStock ? (
            <p className="mt-6 text-sm font-semibold text-red-500">Out of stock</p>
          ) : (
            <div ref={addToCartRef} className="mt-6 flex items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl flex-shrink-0">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2.5 hover:bg-gray-50 rounded-l-xl">
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-2.5 hover:bg-gray-50 rounded-r-xl"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="icon-btn-accent flex-1 py-3 rounded-xl font-bold shadow-soft active:scale-[0.99] transition-all"
              >
                {added ? 'Added ✓' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-14">
        <h2 className="text-lg font-bold mb-5">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {reviews.map((review, i) => (
              <div key={i} className="py-4">
                <StarRating rating={review.rating} />
                {review.comment && <p className="mt-2 text-sm text-gray-600">{review.comment}</p>}
                <p className="mt-2 text-xs text-gray-400">
                  {review.reviewer_name} · {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {!outOfStock && showStickyBar && (
        <div className="slide-fade-enter fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 hidden sm:block">
            {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
            <p className="text-sm font-semibold">${product.effective_price.toFixed(2)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="icon-btn-accent px-6 py-2.5 rounded-xl font-bold shadow-soft active:scale-[0.99] transition-all flex-shrink-0"
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}
