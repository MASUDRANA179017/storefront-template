import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useNotifications } from '../lib/NotificationContext';

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  if (authLoading) return <div className="p-16 flex justify-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} className="text-sm font-semibold text-gray-500 hover:text-gray-900">
            Mark all read
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-20" />
          ))}
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Nothing here yet.</p>
          <Link to="/" className="icon-btn-accent inline-block px-6 py-2.5 rounded-xl font-bold text-sm shadow-soft">
            Continue shopping
          </Link>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => {
          const body = (
            <div
              onClick={() => !n.read_at && markRead(n.id)}
              className={`rounded-2xl border p-4 cursor-pointer transition-colors ${!n.read_at ? 'border-blue-200 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                <p className="font-semibold text-sm">{n.data.title}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.data.message}</p>
              <p className="text-xs text-gray-400 mt-2">{timeAgo(n.created_at)}</p>
            </div>
          );

          return n.data.url ? (
            <Link key={n.id} to={n.data.url} className="block">
              {body}
            </Link>
          ) : (
            <div key={n.id}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
