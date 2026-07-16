import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getOrder(orderNumber)
      .then((res) => setOrder(res.data ?? res))
      .catch(() => setError('Order not found.'));
  }, [orderNumber]);

  if (error) return <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 text-center text-red-500">{error}</div>;
  if (!order) return <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 flex justify-center"><div className="spinner" /></div>;

  const isPaid = order.payment_status === 'paid' || order.payment_status === 'cod';

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
      {isPaid ? (
        <>
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl">
            ✓
          </div>
          <h1 className="text-xl font-bold">Thank you for your order!</h1>
        </>
      ) : (
        <h1 className="text-xl font-bold text-amber-600">Payment not completed</h1>
      )}

      <p className="text-gray-500 mt-2">
        Order <span className="font-mono">{order.order_number}</span>
      </p>

      <div className="mt-8 text-left bg-white border border-gray-100 rounded-2xl shadow-soft divide-y divide-gray-100">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between gap-3 px-4 py-3 text-sm">
            <span className="min-w-0">
              {item.product_name} × {item.quantity}
            </span>
            <span className="flex-shrink-0">${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between font-semibold px-1">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Status: <span className="font-semibold capitalize px-2 py-0.5 rounded-full bg-gray-100">{order.status}</span> · Payment:{' '}
        <span className="font-semibold capitalize px-2 py-0.5 rounded-full bg-gray-100">{order.payment_status}</span>
      </p>

      <Link to="/" className="icon-btn-accent mt-8 inline-block px-6 py-2.5 rounded-xl font-bold text-sm shadow-soft">
        Continue shopping
      </Link>
    </div>
  );
}
