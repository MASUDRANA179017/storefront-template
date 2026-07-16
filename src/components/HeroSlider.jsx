import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ChevronIcon({ direction }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  );
}

export function HeroSlider({ banners = [], fallback, theme, className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return fallback ?? null;
  }

  function goTo(i) {
    setIndex((i + banners.length) % banners.length);
  }

  return (
    <div className={`relative overflow-hidden aspect-[4/3] sm:aspect-[21/9] lg:aspect-[3/1] ${className}`}>
      {banners.map((banner, i) => {
        const Wrapper = banner.link_url ? Link : 'div';
        const wrapperProps = banner.link_url ? { to: banner.link_url } : {};

        return (
          <Wrapper
            key={i}
            {...wrapperProps}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
          >
            <img
              src={banner.image_url}
              alt={banner.headline || ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${i === index ? 'scale-105' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-end pb-10 sm:pb-16 text-center text-white px-4 sm:px-6">
              {banner.headline && <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-lg max-w-2xl">{banner.headline}</h2>}
              {banner.subheadline && <p className="mt-3 text-sm sm:text-lg opacity-90 drop-shadow max-w-lg">{banner.subheadline}</p>}
              {banner.link_url && (
                <span className="icon-btn-accent mt-5 inline-block px-6 py-2.5 rounded-full font-bold text-sm shadow-lifted">
                  Shop Now
                </span>
              )}
            </div>
          </Wrapper>
        );
      })}

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            <ChevronIcon direction="right" />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-7 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
