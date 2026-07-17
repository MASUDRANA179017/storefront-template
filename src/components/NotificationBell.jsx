import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useNotifications } from '../lib/NotificationContext';
import { useDarkMode } from '../lib/DarkModeContext';

function BellIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { dark } = useDarkMode();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!isAuthenticated) return null;

  const panelBg = dark ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-gray-900 border-gray-100';
  const rowHover = dark ? 'hover:bg-white/10' : 'hover:bg-gray-50';
  const iconHover = dark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${iconHover}`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={`slide-fade-enter absolute right-0 mt-3 w-80 max-w-[90vw] max-h-96 overflow-y-auto rounded-2xl shadow-lifted border z-50 ${panelBg}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-current/10">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="text-xs font-medium opacity-60 hover:opacity-100">
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 && <p className="px-4 py-8 text-center text-sm opacity-50">You're all caught up.</p>}

          {notifications.map((n) => {
            const content = (
              <div
                onClick={() => !n.read_at && markRead(n.id)}
                className={`block px-4 py-3 border-b border-current/5 cursor-pointer transition-colors ${rowHover} ${!n.read_at ? 'bg-blue-500/5' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                  <p className="text-sm font-semibold truncate">{n.data.title}</p>
                </div>
                <p className="text-xs opacity-60 mt-0.5 line-clamp-2">{n.data.message}</p>
                <p className="text-[10px] opacity-40 mt-1">{timeAgo(n.created_at)}</p>
              </div>
            );

            return n.data.url ? (
              <Link key={n.id} to={n.data.url} onClick={() => setOpen(false)}>
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
