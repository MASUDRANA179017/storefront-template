import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

function GridIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h6v6H4V5zM14 5h6v6h-6V5zM4 15h6v6H4v-6zM14 15h6v6h-6v-6z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
];

export function ProductListPage({ title, filterParams }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [view, setView] = useState('grid');

  const allParams = {
    ...filterParams,
    ...(sort ? { sort } : {}),
    ...(minPrice ? { min_price: minPrice } : {}),
    ...(maxPrice ? { max_price: maxPrice } : {}),
  };

  useEffect(() => {
    setLoading(true);
    api
      .getProducts(allParams)
      .then((res) => setProducts(res.data ?? res))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterParams), sort, minPrice, maxPrice]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl font-bold mb-6 capitalize">{title}</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6 pb-5 border-b border-current/10">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm outline-none focus:border-current/40 transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-gray-900">
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min $"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-24 px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm outline-none focus:border-current/40 transition-colors"
        />
        <span className="opacity-50">–</span>
        <input
          type="number"
          min="0"
          placeholder="Max $"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24 px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm outline-none focus:border-current/40 transition-colors"
        />

        <div className="ml-auto flex items-center gap-1 border border-current/20 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setView('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-current/10' : ''}`}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-current/10' : ''}`}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton rounded-2xl aspect-square" />
              <div className="skeleton rounded-lg h-4 mt-3 w-3/4" />
              <div className="skeleton rounded-lg h-4 mt-2 w-1/3" />
            </div>
          ))}
        </div>
      )}
      {!loading && products.length === 0 && <p className="text-gray-400 text-sm">No products found.</p>}

      {!loading && view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
      {!loading && view === 'list' && (
        <div className="space-y-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
