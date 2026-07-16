import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { resolveTheme } from '../lib/theme';

const TRUST_POINTS = [
  {
    title: 'Quality Products',
    description: 'Every item is checked before it reaches you.',
    icon: 'M5 13l4 4L19 7',
  },
  {
    title: 'Fast Delivery',
    description: 'Orders processed quickly and shipped with care.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Secure Payment',
    description: 'Pay safely with Cash on Delivery or online.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    title: 'Customer Support',
    description: "We're here to help before and after your purchase.",
    icon: 'M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z',
  },
];

export function AboutPage() {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    api.getShop().then((res) => setShop(res.data ?? res));
  }, []);

  if (!shop) return <div className="p-16 flex justify-center"><div className="spinner" /></div>;

  const theme = resolveTheme(shop);
  const { phone, email, address, about_text: aboutText } = shop.branding ?? {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center">
        {shop.branding?.logo_url && (
          <img src={shop.branding.logo_url} alt={shop.name} className="h-14 w-auto mx-auto mb-6" />
        )}
        <p className="uppercase tracking-[0.2em] text-xs opacity-50 mb-3">About Us</p>
        <h1 className="text-2xl sm:text-3xl font-bold">{shop.name}</h1>
        {shop.location && <p className="mt-2 text-sm opacity-60">{shop.location}</p>}
      </div>

      <div className="mt-10 max-w-2xl mx-auto text-center">
        <p className="opacity-80 whitespace-pre-line leading-relaxed">
          {aboutText ||
            `Welcome to ${shop.name}. We're committed to bringing you quality products, honest prices, and a shopping experience you can trust.`}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {TRUST_POINTS.map((point) => (
          <div key={point.title} className="text-center">
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.primary + '1a', color: theme.primary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={point.icon} />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">{point.title}</h3>
            <p className="text-xs opacity-60 mt-1">{point.description}</p>
          </div>
        ))}
      </div>

      {(phone || email || address) && (
        <div className="mt-14 pt-10 border-t border-current/10 text-center">
          <h2 className="text-lg font-bold mb-6">Contact Us</h2>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {phone && (
              <div>
                <p className="opacity-50 mb-1">Phone</p>
                <a href={`tel:${phone}`} className="font-semibold hover:opacity-70 transition-opacity">
                  {phone}
                </a>
              </div>
            )}
            {email && (
              <div>
                <p className="opacity-50 mb-1">Email</p>
                <a href={`mailto:${email}`} className="font-semibold hover:opacity-70 transition-opacity">
                  {email}
                </a>
              </div>
            )}
            {address && (
              <div>
                <p className="opacity-50 mb-1">Address</p>
                <p className="font-semibold">{address}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-14 text-center">
        <Link to="/" className="icon-btn-accent inline-block px-6 py-3 rounded-xl font-bold shadow-soft">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
