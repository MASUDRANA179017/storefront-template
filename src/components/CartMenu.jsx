import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useDarkMode } from '../lib/DarkModeContext';

function CartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

const CLOSE_DELAY_MS = 200;

// Hover shows a quick mini-preview; clicking still opens the full CartDrawer
// (unchanged behavior) — the two are complementary, not a replacement.
export function CartMenu() {
  const { items, itemCount, subtotal, setDrawerOpen } = useCart();
  const { dark } = useDarkMode();
  const [hovering, setHovering] = useState(false);
  const closeTimer = useRef(null);

  function open() {
    clearTimeout(closeTimer.current);
    setHovering(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setHovering(false), CLOSE_DELAY_MS);
  }

  const panelBg = dark ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-gray-900 border-gray-100';
  const iconHover = dark ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const imageBg = dark ? 'bg-white/10' : 'bg-gray-100';

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Cart"
        className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${iconHover}`}
      >
        <CartIcon />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center text-[10px] font-bold rounded-full icon-btn-accent px-1">
            {itemCount}
          </span>
        )}
      </button>

      {hovering && items.length > 0 && (
        <div className={`slide-fade-enter absolute right-0 mt-3 w-72 rounded-2xl shadow-lifted border z-50 overflow-hidden ${panelBg}`}>
          <div className="max-h-72 overflow-y-auto p-3 space-y-3">
            {items.slice(0, 4).map((item) => (
              <div key={item.slug} className="flex gap-2.5 items-center">
                <div className={`w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 ${imageBg}`}>
                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs opacity-60">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {items.length > 4 && <p className="text-xs opacity-50 text-center">+{items.length - 4} more item(s)</p>}
          </div>
          <div className="border-t border-current/10 p-3 space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="icon-btn-accent block text-center py-2 rounded-xl text-sm font-bold shadow-soft"
              onClick={() => setHovering(false)}
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
