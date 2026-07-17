import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useWishlist } from '../lib/WishlistContext';
import { useDarkMode } from '../lib/DarkModeContext';

function HeartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" />
    </svg>
  );
}

export function WishlistLink() {
  const { isAuthenticated } = useAuth();
  const { count } = useWishlist();
  const { dark } = useDarkMode();

  if (!isAuthenticated) return null;

  const iconHover = dark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  return (
    <Link
      to="/wishlist"
      aria-label="Wishlist"
      className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${iconHover}`}
    >
      <HeartIcon />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white px-1">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
