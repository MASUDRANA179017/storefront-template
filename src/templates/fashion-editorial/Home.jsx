import { useStorefront } from '../../lib/useStorefront';
import { resolveTheme } from '../../lib/theme';
import { orderedSections } from '../../lib/homepageSections';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HotlineBar } from '../../components/HotlineBar';
import { CategoryIconRow } from '../../components/CategoryIconRow';
import { HeroSlider } from '../../components/HeroSlider';
import { FlashSaleSection } from '../../components/FlashSaleSection';
import { ProductGridSection } from '../../components/ProductGridSection';
import { ReviewsSection } from '../../components/ReviewsSection';
import { FaqSection } from '../../components/FaqSection';
import { NewsletterSection } from '../../components/NewsletterSection';
import { ContactSection } from '../../components/ContactSection';
import { ProductCard } from '../../components/ProductCard';
import { CategoryPill } from '../../components/CategoryPill';

export function Home() {
  const { shop, products, bestSellers, categories, banners, flashSale, reviews, faqs, loading, error } = useStorefront();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f6f2]"><div className="spinner" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">Failed to load storefront.</div>;

  const theme = resolveTheme(shop);
  const [feature, ...rest] = products;

  const fallbackHero = (
    <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center max-w-xl mx-auto">
      <p className="uppercase tracking-[0.3em] text-xs mb-3" style={{ color: theme.primary }}>
        New Collection
      </p>
      <h1 className="text-3xl sm:text-4xl italic">{shop.name}</h1>
    </section>
  );

  const sections = orderedSections(shop, {
    categories: categories.length > 0 && (
      <div key="categories" className="flex flex-wrap justify-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
        {categories.map((c) => (
          <CategoryPill
            key={c.slug}
            category={c}
            className="uppercase tracking-widest text-xs text-gray-600 hover:text-[var(--color-primary)] border-b border-transparent hover:border-[var(--color-primary)] pb-1"
          />
        ))}
      </div>
    ),
    flash_sale: <FlashSaleSection key="flash_sale" flashSale={flashSale} theme={theme} />,
    new_arrivals: (
      <section key="new_arrivals" className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 max-w-6xl mx-auto">
        <h2 className="text-lg sm:text-xl italic mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-10">
          {rest.map((product) => (
            <ProductCard key={product.slug} product={product} imageClassName="aspect-[3/4]" />
          ))}
        </div>
      </section>
    ),
    best_sellers: <ProductGridSection key="best_sellers" title="Best Sellers" products={bestSellers} theme={theme} className="border-t border-gray-200" />,
    reviews: <ReviewsSection key="reviews" reviews={reviews} className="border-t border-gray-200" />,
    faq: <FaqSection key="faq" faqs={faqs} />,
    newsletter: <NewsletterSection key="newsletter" theme={theme} className="bg-white" />,
    contact: <ContactSection key="contact" shop={shop} className="border-t border-gray-200" />,
  });

  return (
    <div className="bg-[#f8f6f2] text-gray-900 min-h-screen font-serif pb-16 md:pb-0" style={theme.style}>
      <HotlineBar shop={shop} />
      <Header shop={shop} categories={categories} logoClassName="text-2xl italic tracking-wide" />
      <CategoryIconRow categories={categories} />

      <HeroSlider banners={banners} theme={theme} fallback={fallbackHero} />

      {feature && (
        <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-5xl mx-auto">
          <ProductCard product={feature} imageClassName="aspect-[16/9]" />
        </section>
      )}

      {sections}

      <Footer
        shop={shop}
        categories={categories}
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-gray-200 text-sm text-gray-500"
      />
    </div>
  );
}
