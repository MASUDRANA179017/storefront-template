import { useStorefront } from '../../lib/useStorefront';
import { resolveTheme } from '../../lib/theme';
import { orderedSections } from '../../lib/homepageSections';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HeroSlider } from '../../components/HeroSlider';
import { FlashSaleSection } from '../../components/FlashSaleSection';
import { ProductGridSection } from '../../components/ProductGridSection';
import { ReviewsSection } from '../../components/ReviewsSection';
import { FaqSection } from '../../components/FaqSection';
import { NewsletterSection } from '../../components/NewsletterSection';
import { ContactSection } from '../../components/ContactSection';
import { CategoryPill } from '../../components/CategoryPill';

export function Home() {
  const { shop, products, bestSellers, categories, banners, flashSale, reviews, faqs, loading, error } = useStorefront();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="spinner" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">Failed to load storefront.</div>;

  const theme = resolveTheme(shop);

  const fallbackHero = (
    <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 text-center max-w-2xl mx-auto">
      <div className="w-10 h-1 mx-auto mb-6 rounded-full" style={{ backgroundColor: theme.primary }} />
      <h1 className="text-3xl sm:text-4xl font-light tracking-tight">{shop.name}</h1>
      <p className="mt-4 text-gray-500">{shop.branding?.address || 'Quality products, simply presented.'}</p>
    </section>
  );

  const sections = orderedSections(shop, {
    categories: categories.length > 0 && (
      <div key="categories" className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {categories.map((c) => (
          <CategoryPill
            key={c.slug}
            category={c}
            className="px-3 sm:px-4 py-1.5 text-sm border border-gray-200 rounded-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          />
        ))}
      </div>
    ),
    flash_sale: <FlashSaleSection key="flash_sale" flashSale={flashSale} theme={theme} />,
    best_sellers: (
      <ProductGridSection key="best_sellers" title="Best Sellers" subtitle="Our customers' favorites" products={bestSellers} theme={theme} />
    ),
    new_arrivals: <ProductGridSection key="new_arrivals" title="New Arrivals" subtitle="Fresh in the shop" products={products} theme={theme} />,
    reviews: <ReviewsSection key="reviews" reviews={reviews} className="border-t border-gray-100" />,
    faq: <FaqSection key="faq" faqs={faqs} />,
    newsletter: <NewsletterSection key="newsletter" theme={theme} className="bg-gray-50" />,
    contact: <ContactSection key="contact" shop={shop} className="border-t border-gray-100" />,
  });

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans" style={theme.style}>
      <Header
        shop={shop}
        categories={categories}
        className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100"
      />

      <HeroSlider banners={banners} theme={theme} fallback={fallbackHero} />

      {sections}

      <Footer
        shop={shop}
        categories={categories}
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-gray-100 text-sm text-gray-400"
      />
    </div>
  );
}
