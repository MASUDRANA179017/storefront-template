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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="spinner" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">Failed to load storefront.</div>;

  const theme = resolveTheme(shop);

  const fallbackHero = (
    <section className="px-4 sm:px-6 py-8 sm:py-10 text-white text-center" style={{ backgroundColor: theme.primary }}>
      <h1 className="text-2xl sm:text-3xl font-bold">{shop.name}</h1>
      <p className="mt-2 text-white/80">{shop.branding?.address || 'Fresh picks, delivered fast.'}</p>
    </section>
  );

  const sections = orderedSections(shop, {
    flash_sale: <FlashSaleSection key="flash_sale" flashSale={flashSale} theme={theme} className="max-w-7xl" />,
    best_sellers: <ProductGridSection key="best_sellers" title="Best Sellers" products={bestSellers} theme={theme} className="max-w-7xl" />,
    new_arrivals: (
      <section key="new_arrivals" className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold mb-4" style={{ color: theme.secondary }}>Today's Picks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <div key={product.slug} className="bg-white rounded-2xl p-2.5 shadow-soft hover:shadow-elevated transition-shadow">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    ),
    reviews: <ReviewsSection key="reviews" reviews={reviews} className="max-w-7xl border-t border-gray-200" />,
    faq: <FaqSection key="faq" faqs={faqs} />,
    newsletter: <NewsletterSection key="newsletter" theme={theme} className="bg-white" />,
    contact: <ContactSection key="contact" shop={shop} className="border-t border-gray-200" />,
  });

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans pb-16 md:pb-0" style={theme.style}>
      <HotlineBar shop={shop} />
      <Header shop={shop} categories={categories} />
      <CategoryIconRow categories={categories} className="bg-white border-b border-gray-100" />

      {categories.length > 0 && (
        <div className="hidden md:flex gap-2 overflow-x-auto px-4 sm:px-6 py-3 bg-white border-b border-gray-100">
          {categories.map((c) => (
            <CategoryPill
              key={c.slug}
              category={c}
              className="hover-theme-bg flex-shrink-0 px-4 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-full hover:text-white transition-colors"
            />
          ))}
        </div>
      )}

      <HeroSlider banners={banners} theme={theme} fallback={fallbackHero} />

      {sections}

      <Footer
        shop={shop}
        categories={categories}
        className="px-4 sm:px-6 py-6 sm:py-8 text-sm text-white/80"
        style={{ backgroundColor: theme.primary }}
      />
    </div>
  );
}
