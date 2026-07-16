import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';

export function AccountPage() {
  const { user, token, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .getMyOrders(token)
      .then((res) => setOrders(res.data ?? res))
      .finally(() => setOrdersLoading(false));
  }, [token]);

  if (loading) return <div className="p-16 flex justify-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-8 bg-white rounded-2xl shadow-soft border border-gray-100 p-5 sm:p-6">
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Log Out
        </button>
      </div>

      <h2 className="font-semibold mb-4">Order History</h2>

      {ordersLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-20" />
          ))}
        </div>
      )}
      {!ordersLoading && orders.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <p className="text-gray-400 text-sm mb-3">No orders yet with this shop.</p>
          <Link to="/" className="text-sm font-semibold text-gray-900 underline">
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.order_number}
            to={`/order-confirmation/${order.order_number}`}
            className="block bg-white border border-gray-100 rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{order.order_number}</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
              <span className="capitalize px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium">{order.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
