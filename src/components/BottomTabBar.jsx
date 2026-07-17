import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useMobileMenu } from '../lib/MobileMenuContext';

function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10" />
    </svg>
  );
}

function GridIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  );
}

function CartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// Fixed bottom mobile tab bar, mounted once globally so it persists across
// every page. The "Menu" tab opens the same drawer as Header's hamburger via
// MobileMenuContext, since they're separate component instances.
export function BottomTabBar({ dark = false }) {
  const { pathname } = useLocation();
  const { itemCount, setDrawerOpen } = useCart();
  const { setMobileOpen } = useMobileMenu();

  const barBg = dark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200';
  const inactiveColor = dark ? 'text-gray-400' : 'text-gray-500';

  const tabs = [
    { key: 'home', label: 'Home', Icon: HomeIcon, href: '/', active: pathname === '/' },
    { key: 'categories', label: 'Categories', Icon: GridIcon, href: '/search', active: pathname === '/search' || pathname.startsWith('/category') },
    { key: 'cart', label: 'Cart', Icon: CartIcon, href: '/cart', active: pathname === '/cart', badge: itemCount },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)] ${barBg}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(({ key, label, Icon, href, active, badge }) => (
        <Link
          key={key}
          to={href}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${active ? '' : inactiveColor}`}
          style={active ? { color: 'var(--color-primary)' } : undefined}
        >
          <span className="relative">
            <Icon className="w-5 h-5" />
            {badge > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[1rem] h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-red-500 text-white px-1">
                {badge}
              </span>
            )}
          </span>
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${inactiveColor}`}
      >
        <MenuIcon className="w-5 h-5" />
        Menu
      </button>
    </nav>
  );
}
