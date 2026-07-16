import { useParams } from 'react-router-dom';
import { ProductListPage } from './ProductListPage';

export function CategoryPage() {
  const { slug } = useParams();

  return <ProductListPage title={slug.replace(/-/g, ' ')} filterParams={{ category: slug }} />;
}
