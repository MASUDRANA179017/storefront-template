import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

export function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="icon-btn-accent inline-block px-6 py-2.5 rounded-xl font-bold text-sm shadow-soft">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl font-bold mb-6">Your Cart</h1>
      <div className="divide-y divide-gray-100 border-y border-gray-100">
        {items.map((item) => (
          <div key={item.slug} className="flex gap-3 sm:gap-4 py-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              {item.image_url && <img src={item.image_url} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base line-clamp-1">{item.name}</p>
              <p className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  className="w-7 h-7 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                  className="w-7 h-7 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
                <button type="button" onClick={() => removeItem(item.slug)} className="ml-3 sm:ml-4 text-sm text-red-500 hover:text-red-600">
                  Remove
                </button>
              </div>
            </div>
            <div className="font-semibold text-sm sm:text-base flex-shrink-0 whitespace-nowrap">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold">Subtotal</span>
        <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
      </div>

      <Link
        to="/checkout"
        className="icon-btn-accent mt-6 block text-center py-3 rounded-xl font-bold shadow-soft active:scale-[0.99] transition-all"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
