import { StarRating } from './StarRating';

export function ReviewsSection({ reviews = [], className = '' }) {
  if (reviews.length === 0) return null;

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-6xl mx-auto ${className}`}>
      <h2 className="text-lg sm:text-xl font-bold mb-6">What Customers Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reviews.map((review, i) => (
          <div key={i} className="card-hover border border-current/10 rounded-2xl p-5 bg-current/[0.02]">
            <StarRating rating={review.rating} />
            {review.comment && <p className="mt-3 text-sm opacity-80 line-clamp-4">{review.comment}</p>}
            <p className="mt-4 text-sm font-semibold">{review.reviewer_name}</p>
            <p className="text-xs opacity-50">on {review.product_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
