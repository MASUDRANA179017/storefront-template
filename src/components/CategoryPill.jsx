import { Link } from 'react-router-dom';

export function CategoryPill({ category, className = '', style }) {
  return (
    <Link to={`/category/${category.slug}`} className={className} style={style}>
      {category.name}
    </Link>
  );
}
