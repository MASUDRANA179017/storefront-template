function PhoneIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function TruckIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 16V6a1 1 0 011-1h9a1 1 0 011 1v10m-11 0a2 2 0 104 0m-4 0a2 2 0 114 0m7 0a2 2 0 104 0m-4 0a2 2 0 114 0m0 0h2a1 1 0 001-1v-3.5a1 1 0 00-.293-.707l-2.5-2.5A1 1 0 0016.5 8H14v8" />
    </svg>
  );
}

// The thin promo strip above Header — shop hotline + a "Cash on Delivery"
// trust badge, matching the top bar on the main marketplace's mobile view.
export function HotlineBar({ shop, className = '' }) {
  const phone = shop?.branding?.phone;
  if (!phone) return null;

  return (
    <div className={`flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] sm:text-xs font-medium text-white ${className}`} style={{ backgroundColor: 'var(--color-primary)' }}>
      <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity truncate">
        <PhoneIcon />
        <span className="truncate">{phone}</span>
      </a>
      <span className="flex items-center gap-1.5 opacity-90 flex-shrink-0">
        <TruckIcon />
        Cash on Delivery
      </span>
    </div>
  );
}
