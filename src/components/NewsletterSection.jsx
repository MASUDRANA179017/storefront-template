import { useState } from 'react';
import { api } from '../lib/api';

export function NewsletterSection({ theme, className = '' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.subscribeNewsletter(email);
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  }

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ${className}`}>
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-lg sm:text-xl font-bold">Join Our Newsletter</h2>
        <p className="text-sm opacity-60 mt-2">Get updates on new arrivals, sales, and exclusive offers.</p>

        {status === 'done' ? (
          <p className="mt-5 text-sm font-semibold">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm outline-none focus:border-current/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="icon-btn-accent px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-60 shadow-soft transition-opacity"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
