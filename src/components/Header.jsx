import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { useMobileMenu } from '../lib/MobileMenuContext';
import { useDarkMode } from '../lib/DarkModeContext';
import { NotificationBell } from './NotificationBell';
import { WishlistLink } from './WishlistLink';
import { CartMenu } from './CartMenu';
import { AccountMenu } from './AccountMenu';
import { DarkModeToggle } from './DarkModeToggle';

const SpeechRecognitionApi = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

function SearchIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  );
}

function MicIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
  );
}

function CartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function AccountIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function useVoiceSearch(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  function start() {
    if (!SpeechRecognitionApi) return;
    const recognition = new SpeechRecognitionApi();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  return { supported: !!SpeechRecognitionApi, listening, start };
}

export function Header({ shop, categories = [], logoClassName = '' }) {
  const { itemCount, setDrawerOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const { mobileOpen, setMobileOpen } = useMobileMenu();
  const { dark } = useDarkMode();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [query, setQuery] = useState('');
  const categoriesRef = useRef(null);
  const navigate = useNavigate();

  const voice = useVoiceSearch((transcript) => {
    setQuery(transcript);
    setMobileOpen(false);
    navigate(`/search?q=${encodeURIComponent(transcript)}`);
  });

  useEffect(() => {
    if (!categoriesOpen) return undefined;
    function onClickOutside(e) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [categoriesOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  if (!shop) return null;

  function handleSearchSubmit(e) {
    e.preventDefault();
    setMobileOpen(false);
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  const accountHref = isAuthenticated ? '/account' : '/login';

  const headerBg = dark ? 'bg-slate-950/90 border-white/10 text-white' : 'bg-white/90 border-gray-100 text-gray-900';
  const panelBg = dark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900';
  const panelBorder = dark ? 'border-white/10' : 'border-gray-100';
  const panelHover = dark ? 'hover:bg-white/10' : 'hover:bg-gray-50';
  const closeBtnHover = dark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900';
  const iconHover = dark ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const inputStyle = dark
    ? 'border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-white/40'
    : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-300';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b shadow-[0_1px_16px_rgba(0,0,0,0.06)] transition-colors duration-300 ${headerBg}`}>
      <div className="h-[55px] sm:h-[60px] flex items-center gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Mobile hamburger — left */}
        <button type="button" className="md:hidden flex-shrink-0 w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <MenuIcon />
        </button>

        {/* Logo — left on desktop, centered on mobile */}
        <Link to="/" className={`font-bold text-lg sm:text-xl truncate flex-1 md:flex-initial text-center md:text-left ${logoClassName}`}>
          {shop.branding?.logo_url ? (
            <img src={shop.branding.logo_url} alt={shop.name} className="h-7 sm:h-8 w-auto mx-auto md:mx-0" />
          ) : (
            shop.name
          )}
        </Link>

        {categories.length > 0 && (
          <div className="relative hidden lg:block flex-shrink-0" ref={categoriesRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              Categories
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {categoriesOpen && (
              <div className={`slide-fade-enter absolute left-0 mt-3 w-64 max-h-96 overflow-y-auto rounded-2xl shadow-lifted border p-2 z-50 ${panelBg} ${panelBorder}`}>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/category/${c.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                    className={`block px-3.5 py-2.5 text-sm rounded-xl transition-colors ${panelHover}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop search bar — center, fills remaining space */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-auto relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className={`w-full pl-11 pr-11 py-2.5 rounded-full border text-sm outline-none transition-all ${inputStyle}`}
          />
          {voice.supported && (
            <button
              type="button"
              onClick={voice.start}
              aria-label="Voice search"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${voice.listening ? 'bg-red-500 text-white' : `opacity-50 hover:opacity-100 ${iconHover}`}`}
            >
              <MicIcon />
            </button>
          )}
        </form>

        {/* Desktop right icon cluster */}
        <div className="hidden md:flex items-center gap-0.5 flex-shrink-0 ml-auto">
          <DarkModeToggle />
          <NotificationBell />
          <WishlistLink />
          <CartMenu />
          <span className="w-px h-6 bg-current/10 mx-1" />
          <AccountMenu />
        </div>

        {/* Mobile right icons: notifications + cart */}
        <div className="flex md:hidden items-center gap-0.5 flex-shrink-0">
          <NotificationBell />
          <button type="button" onClick={() => setDrawerOpen(true)} className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${iconHover}`} aria-label="Cart">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center text-[10px] font-bold rounded-full icon-btn-accent px-1">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Persistent mobile search bar — always visible, not tucked inside the drawer */}
      <form onSubmit={handleSearchSubmit} className="md:hidden px-3 pb-3 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className={`w-full pl-11 pr-11 py-2.5 rounded-full border text-sm outline-none transition-all ${inputStyle}`}
          />
          {voice.supported && (
            <button
              type="button"
              onClick={voice.start}
              aria-label="Voice search"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${voice.listening ? 'bg-red-500 text-white' : `opacity-50 ${iconHover}`}`}
            >
              <MicIcon />
            </button>
          )}
        </div>
        <button type="submit" className="icon-btn-accent px-4 py-2.5 rounded-full text-sm font-bold shadow-soft flex-shrink-0">
          Search
        </button>
      </form>

      {mobileOpen && createPortal(
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className={`drawer-panel-left relative w-full max-w-xs h-full shadow-lifted flex flex-col mr-auto ${panelBg}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${panelBorder}`}>
              <span className="font-bold flex items-center gap-2">
                {shop.branding?.logo_url && <img src={shop.branding.logo_url} alt={shop.name} className="h-6 w-auto" />}
                {shop.name}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${closeBtnHover}`}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              <Link
                to={accountHref}
                onClick={() => setMobileOpen(false)}
                className="icon-btn-accent flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl shadow-soft"
              >
                <AccountIcon className="w-4 h-4" />
                {isAuthenticated ? 'My Account' : 'Sign In / Register'}
              </Link>

              {categories.length > 0 && (
                <nav className="flex flex-col gap-1 text-sm font-medium">
                  <p className="text-xs uppercase tracking-wide opacity-50 mb-2">Categories</p>
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/category/${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-2.5 rounded-xl transition-colors ${panelHover}`}
                    >
                      {c.name}
                    </Link>
                  ))}
                </nav>
              )}

              <nav className={`flex flex-col gap-1 text-sm font-medium border-t pt-4 ${panelBorder}`}>
                {isAuthenticated && (
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className={`px-3 py-2.5 rounded-xl transition-colors ${panelHover}`}>
                    Wishlist
                  </Link>
                )}
                <Link to="/coupons" onClick={() => setMobileOpen(false)} className={`px-3 py-2.5 rounded-xl transition-colors ${panelHover}`}>
                  Coupons
                </Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className={`px-3 py-2.5 rounded-xl transition-colors ${panelHover}`}>
                  About Us
                </Link>
              </nav>

              {(shop.branding?.phone || shop.branding?.email) && (
                <div className={`text-xs opacity-60 border-t pt-4 space-y-1 ${panelBorder}`}>
                  {shop.branding?.phone && <p>{shop.branding.phone}</p>}
                  {shop.branding?.email && <p>{shop.branding.email}</p>}
                </div>
              )}
            </div>

            <div className={`border-t px-5 py-4 ${panelBorder}`}>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setDrawerOpen(true);
                }}
                className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border transition-colors relative ${panelBorder} ${panelHover}`}
              >
                <CartIcon className="w-4 h-4" />
                Cart{itemCount > 0 ? ` (${itemCount})` : ''}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
