import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';

function useCountdown(endsAt) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(endsAt).getTime() - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, new Date(endsAt).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: remaining <= 0,
  };
}

export function FlashSaleSection({ flashSale, theme, className = '' }) {
  const countdown = useCountdown(flashSale?.ends_at ?? Date.now());

  if (!flashSale || countdown.expired) return null;

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-6xl mx-auto ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
            <span className="gradient-text">⚡ {flashSale.name}</span>
          </h2>
          <p className="text-sm opacity-60 mt-1">Limited time only</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          {[
            ['D', countdown.days],
            ['H', countdown.hours],
            ['M', countdown.minutes],
            ['S', countdown.seconds],
          ].map(([label, value]) => (
            <div key={label} className="icon-btn-accent px-3 py-2 rounded-xl text-center min-w-[2.75rem] shadow-soft">
              <div className="font-bold">{String(value).padStart(2, '0')}</div>
              <div className="text-[10px] opacity-80">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {flashSale.products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
