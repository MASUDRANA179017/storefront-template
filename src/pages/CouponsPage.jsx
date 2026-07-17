import { useEffect, useState } from 'react';
import { api } from '../lib/api';

function CopyIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);
  const discount = coupon.type === 'percent' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`;

  function copy() {
    navigator.clipboard?.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-stretch rounded-2xl border border-dashed border-gray-300 overflow-hidden">
      <div className="icon-btn-accent flex flex-col items-center justify-center px-5 py-4 text-center flex-shrink-0 w-28">
        <span className="font-black text-lg leading-tight">{discount}</span>
      </div>
      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
        <p className="font-mono font-bold text-sm tracking-wide">{coupon.code}</p>
        {coupon.min_order && <p className="text-xs text-gray-500 mt-0.5">Min. order ${Number(coupon.min_order).toFixed(2)}</p>}
        {coupon.expires_at && <p className="text-xs text-gray-400 mt-0.5">Expires {new Date(coupon.expires_at).toLocaleDateString()}</p>}
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 border-l border-dashed border-gray-300 flex-shrink-0"
      >
        {copied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <CopyIcon />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCoupons()
      .then((res) => setCoupons(res.data ?? res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl font-bold mb-1">Coupons & Offers</h1>
      <p className="text-sm text-gray-500 mb-6">Apply any of these codes at checkout.</p>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-20" />
          ))}
        </div>
      )}

      {!loading && coupons.length === 0 && <p className="text-center text-gray-500 py-16">No active coupons right now — check back soon.</p>}

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.code} coupon={coupon} />
        ))}
      </div>
    </div>
  );
}
