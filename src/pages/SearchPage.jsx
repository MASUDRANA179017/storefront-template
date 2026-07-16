import { useSearchParams } from 'react-router-dom';
import { ProductListPage } from './ProductListPage';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  return <ProductListPage title={q ? `Search: "${q}"` : 'Search'} filterParams={q ? { q } : {}} />;
}
