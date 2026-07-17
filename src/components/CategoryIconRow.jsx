import { Link } from 'react-router-dom';

// Circular icon-bubble category shortcuts, mobile-only — distinct from the
// text CategoryPill row used inside the homepage section builder, matching
// the "Browse Categories" strip on the main marketplace's mobile view.
export function CategoryIconRow({ categories = [], className = '', style }) {
  if (categories.length === 0) return null;

  return (
    <div className={`md:hidden flex gap-4 overflow-x-auto px-4 py-4 ${className}`} style={{ scrollbarWidth: 'none', ...style }}>
      {categories.map((c) => (
        <Link key={c.slug} to={`/category/${c.slug}`} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16 group">
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border transition-transform group-active:scale-95"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)', color: 'var(--color-primary)' }}
          >
            {c.name?.[0]?.toUpperCase() ?? '?'}
          </span>
          <span className="text-[11px] text-center leading-tight truncate w-full opacity-80">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
