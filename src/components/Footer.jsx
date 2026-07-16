import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export function Footer({ shop, categories = [], className = '', style }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!shop) return null;

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    try {
      await api.subscribeNewsletter(email);
    } finally {
      setSubscribed(true);
    }
  }

  return (
    <footer className={className} style={style}>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-6 sm:pb-8">
        <div>
          <h3 className="font-semibold mb-3">{shop.name}</h3>
          {shop.branding?.address && <p className="text-sm opacity-70">{shop.branding.address}</p>}
          {shop.branding?.phone && <p className="text-sm opacity-70 mt-1">{shop.branding.phone}</p>}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </div>

        {categories.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-1.5 text-sm opacity-80">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-3">Newsletter</h3>
          {subscribed ? (
            <p className="text-sm opacity-80">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm outline-none focus:border-current/40 transition-colors"
              />
              <button type="submit" className="icon-btn-accent px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap shadow-soft">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-70">
        <p>
          &copy; {new Date().getFullYear()} {shop.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full border border-current/20 text-xs font-medium">Cash on Delivery</span>
          <span className="px-2.5 py-1 rounded-full border border-current/20 text-xs font-medium">Card Payment</span>
        </div>
      </div>
    </footer>
  );
}
