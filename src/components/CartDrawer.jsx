import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useDarkMode } from '../lib/DarkModeContext';

export function CartDrawer() {
  const { items, updateQuantity, removeItem, subtotal, isDrawerOpen, setDrawerOpen } = useCart();
  const { dark } = useDarkMode();

  useEffect(() => {
    if (!isDrawerOpen) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  if (!isDrawerOpen) return null;

  const panelBg = dark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900';
  const panelBorder = dark ? 'border-white/10' : 'border-gray-100';
  const closeBtnHover = dark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900';
  const qtyBtn = dark
    ? 'border-white/20 text-gray-300 hover:bg-white/10'
    : 'border-gray-300 text-gray-600 hover:bg-gray-50';
  const imageBg = dark ? 'bg-white/10' : 'bg-gray-100';
  const itemName = dark ? 'text-white' : 'text-gray-900';
  const itemPrice = dark ? 'text-gray-400' : 'text-gray-500';
  const viewCartBtn = dark
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-gray-900 text-gray-900 hover:bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
      <div className={`drawer-panel relative w-full sm:max-w-md h-full shadow-lifted flex flex-col ${panelBg}`}>
        <div className={`flex items-center justify-between px-4 sm:px-5 py-4 border-b ${panelBorder}`}>
          <h2 className="font-semibold">Your Cart {items.length > 0 && `(${items.length})`}</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className={`w-9 h-9 flex items-center justify-center rounded-full text-xl leading-none transition-colors ${closeBtnHover}`}
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
          {items.length === 0 && <p className="text-gray-400 text-sm">Your cart is empty.</p>}
          {items.map((item) => (
            <div key={item.slug} className="flex gap-3">
              <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${imageBg}`}>
                {item.image_url && <img src={item.image_url} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium line-clamp-1 ${itemName}`}>{item.name}</p>
                <p className={`text-sm ${itemPrice}`}>${item.price.toFixed(2)}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    className={`w-7 h-7 border rounded-lg transition-colors ${qtyBtn}`}
                  >
                    −
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    className={`w-7 h-7 border rounded-lg transition-colors ${qtyBtn}`}
                  >
                    +
                  </button>
                  <button type="button" onClick={() => removeItem(item.slug)} className="ml-auto text-xs text-red-500 hover:text-red-600">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className={`border-t px-4 sm:px-5 py-4 space-y-3 ${panelBorder}`}>
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              onClick={() => setDrawerOpen(false)}
              className={`block text-center py-2.5 rounded-xl border text-sm font-semibold transition-colors ${viewCartBtn}`}
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="icon-btn-accent block text-center py-2.5 rounded-xl text-sm font-bold active:scale-[0.99] transition-all shadow-soft"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
