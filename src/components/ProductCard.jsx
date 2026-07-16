import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { StarRating } from './StarRating';

function CartPlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export function ProductCard({ product, className = '', imageClassName = 'aspect-square', layout = 'grid' }) {
  const { addItem } = useCart();
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.effective_price;
  const outOfStock = product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 5;

  const badge = outOfStock ? (
    <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/75 text-white backdrop-blur-sm">Out of stock</span>
  ) : product.discount_percent > 0 ? (
    <span className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white shadow-soft">
      -{product.discount_percent}%
    </span>
  ) : null;

  const ratingRow = product.average_rating ? (
    <div className="mt-1.5 flex items-center gap-1.5">
      <StarRating rating={product.average_rating} className="[&>span]:hidden" />
      <span className="text-xs text-gray-500">
        {product.average_rating.toFixed(1)}
        {product.reviews_count > 0 && <span className="opacity-70"> ({product.reviews_count})</span>}
      </span>
    </div>
  ) : null;

  const priceRow = (
    <div className="mt-1 flex items-center gap-2 flex-wrap">
      <span className="font-bold">${product.effective_price.toFixed(2)}</span>
      {hasDiscount && <span className="text-sm text-gray-400 line-through">${product.compare_at_price.toFixed(2)}</span>}
      {lowStock && <span className="text-xs text-red-500 font-medium">Only {product.stock_quantity} left</span>}
    </div>
  );

  const addToCartIconButton = (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => addItem(product, 1)}
      aria-label="Add to cart"
      className="icon-btn-accent flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full shadow-soft disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
    >
      <CartPlusIcon />
    </button>
  );

  const addToCartFullButton = (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => addItem(product, 1)}
      className="icon-btn-accent w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl shadow-soft disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
    >
      <CartPlusIcon className="w-4 h-4" />
      {outOfStock ? 'Out of stock' : 'Add to cart'}
    </button>
  );

  if (layout === 'list') {
    return (
      <div className={`flex gap-4 ${className}`}>
        <Link to={`/product/${product.slug}`} className="block relative flex-shrink-0">
          <div className={`card-hover overflow-hidden bg-gray-100 relative rounded-2xl w-28 h-28 sm:w-36 sm:h-36 ${imageClassName}`}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
            {badge}
          </div>
        </Link>
        <div className="flex-1 min-w-0 flex flex-col">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-semibold line-clamp-1">{product.name}</h3>
            {ratingRow}
            {product.description && <p className="text-sm opacity-60 line-clamp-2 mt-1">{product.description}</p>}
            {priceRow}
          </Link>
          <div className="mt-auto pt-2.5 flex items-center gap-2 w-full sm:w-48">
            {addToCartIconButton}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group ${className}`}>
      <Link to={`/product/${product.slug}`} className="block relative">
        <div className={`card-hover overflow-hidden bg-gray-100 relative rounded-2xl ${imageClassName}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
          )}
          {badge}
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
          {ratingRow}
          {priceRow}
        </div>
      </Link>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1">{addToCartFullButton}</div>
      </div>
    </div>
  );
}
