import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors';

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: user?.name ?? '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'cod',
    coupon_code: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-sm font-semibold underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.checkout(
        {
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_address: form.customer_address,
          payment_method: form.payment_method,
          coupon_code: form.coupon_code || undefined,
          return_url: window.location.origin + window.location.pathname,
        },
        token
      );

      if (response.redirect_url) {
        window.location.href = response.redirect_url;
        return;
      }

      clear();
      navigate(`/order-confirmation/${response.order_number}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      <form onSubmit={handleSubmit} className="order-2 md:order-1 space-y-4">
        <h1 className="text-xl font-bold mb-2">Checkout</h1>

        {user ? (
          <p className="text-sm text-gray-500">
            Ordering as <span className="font-semibold text-gray-900">{user.name}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            <Link to="/login" className="font-semibold underline">
              Sign in
            </Link>{' '}
            to track this order in your account, or continue as a guest below.
          </p>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input required value={form.customer_name} onChange={update('customer_name')} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input required value={form.customer_phone} onChange={update('customer_phone')} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <textarea required rows={3} value={form.customer_address} onChange={update('customer_address')} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Coupon Code (optional)</label>
          <input value={form.coupon_code} onChange={update('coupon_code')} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50 transition-colors">
              <input type="radio" name="payment_method" value="cod" checked={form.payment_method === 'cod'} onChange={update('payment_method')} />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment_method"
                value="sslcommerz"
                checked={form.payment_method === 'sslcommerz'}
                onChange={update('payment_method')}
              />
              Pay Online (Card / Mobile Banking)
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="icon-btn-accent w-full py-3 rounded-xl font-bold shadow-soft disabled:opacity-50 transition-all"
        >
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </form>

      <div className="order-1 md:order-2">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <div className="divide-y divide-gray-100 border-y border-gray-100">
          {items.map((item) => (
            <div key={item.slug} className="flex justify-between gap-3 py-3 text-sm">
              <span className="min-w-0">
                {item.name} × {item.quantity}
              </span>
              <span className="flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold mt-4">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
