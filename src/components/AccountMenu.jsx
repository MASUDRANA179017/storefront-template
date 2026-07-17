import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useDarkMode } from '../lib/DarkModeContext';

function ChevronDownIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const LINKS = [
  { label: 'My Account', href: '/account' },
  { label: 'My Orders', href: '/account' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Coupons', href: '/coupons' },
  { label: 'Settings', href: '/account' },
];

// Initials avatar — there's no avatar-upload feature anywhere in the app,
// so a generated initials badge (gradient-accented, matching the brand
// colors) stands in for a real image rather than faking one.
function Avatar({ name, className = 'w-8 h-8 text-xs' }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span
      className={`icon-btn-accent rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
    >
      {initials}
    </span>
  );
}

export function AccountMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { dark } = useDarkMode();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="icon-btn-accent px-4 py-2 rounded-full text-sm font-bold shadow-soft flex-shrink-0 whitespace-nowrap">
        Login
      </Link>
    );
  }

  const panelBg = dark ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-gray-900 border-gray-100';
  const rowHover = dark ? 'hover:bg-white/10' : 'hover:bg-gray-50';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full transition-colors ${rowHover}`}
      >
        <span className="relative">
          <Avatar name={user.name} />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white" style={dark ? { borderColor: '#0f172a' } : undefined} />
        </span>
        <span className="hidden lg:inline text-sm font-semibold max-w-[8rem] truncate">{user.name}</span>
        <ChevronDownIcon className={`hidden lg:block w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`slide-fade-enter absolute right-0 mt-3 w-56 rounded-2xl shadow-lifted border z-50 overflow-hidden ${panelBg}`}>
          <div className="px-4 py-3 border-b border-current/10">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs opacity-60 truncate">{user.email}</p>
          </div>
          <div className="py-1.5">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm transition-colors ${rowHover}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-current/10 py-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
                navigate('/');
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 transition-colors ${rowHover}`}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
