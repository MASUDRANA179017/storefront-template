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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="spinner" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400 text-sm">Failed to load storefront.</div>;

  const theme = resolveTheme(shop);
  const accentBorder = { borderColor: theme.primary + '33' };

  const fallbackHero = (
    <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b" style={accentBorder}>
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.primary }}>
        // {shop.name}
      </p>
      <h1 className="text-2xl sm:text-4xl font-bold">Specs that speak for themselves.</h1>
      <p className="mt-3 text-slate-400 max-w-lg">{shop.branding?.address || 'Curated tech, tested and verified.'}</p>
    </section>
  );

  const sections = orderedSections(shop, {
    categories: categories.length > 0 && (
      <div key="categories" className="flex flex-wrap gap-3 px-4 sm:px-6 lg:px-8 py-6 border-b" style={accentBorder}>
        {categories.map((c) => (
          <CategoryPill
            key={c.slug}
            category={c}
            className="px-3 py-1 text-xs border rounded text-[var(--color-primary)]"
            style={accentBorder}
          />
        ))}
      </div>
    ),
    flash_sale: <FlashSaleSection key="flash_sale" flashSale={flashSale} theme={theme} className="border-b" />,
    best_sellers: <ProductGridSection key="best_sellers" title="Best Sellers" products={bestSellers} theme={theme} className="border-b" />,
    new_arrivals: (
      <section key="new_arrivals" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <div key={product.slug} className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 hover:border-[var(--color-primary)]/40 transition-colors">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    ),
    reviews: <ReviewsSection key="reviews" reviews={reviews} className="border-t" />,
    faq: <FaqSection key="faq" faqs={faqs} />,
    newsletter: <NewsletterSection key="newsletter" theme={theme} className="bg-white/5" />,
    contact: <ContactSection key="contact" shop={shop} className="border-t" />,
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-mono pb-16 md:pb-0" style={theme.style}>
      <HotlineBar shop={shop} />
      <Header
        shop={shop}
        categories={categories}
        className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b"
        logoClassName="text-[var(--color-primary)]"
        style={accentBorder}
        dark
      />
      <CategoryIconRow categories={categories} className="border-b" style={accentBorder} />

      <HeroSlider banners={banners} theme={theme} fallback={fallbackHero} />

      {sections}

      <Footer
        shop={shop}
        categories={categories}
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t text-xs text-slate-500"
        style={accentBorder}
      />
    </div>
  );
}
