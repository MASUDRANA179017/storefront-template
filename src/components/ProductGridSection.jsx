import { ProductCard } from './ProductCard';

export function ProductGridSection({ title, subtitle, products = [], theme, className = '' }) {
  if (products.length === 0) return null;

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-6xl mx-auto ${className}`}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm opacity-60 mt-1">{subtitle}</p>}
        </div>
        {theme && <div className="w-10 h-1 rounded-full hidden sm:block" style={{ backgroundColor: theme.primary }} />}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
