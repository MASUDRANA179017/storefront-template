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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="spinner" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-sm">Failed to load storefront.</div>;

  const theme = resolveTheme(shop);

  const fallbackHero = (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-y border-white/10">
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{shop.name}</h1>
      <p className="mt-6 max-w-md text-white/60">{shop.branding?.address || 'Bold looks. No compromises.'}</p>
      <div className="mt-6 w-16 h-1.5" style={{ backgroundColor: theme.secondary }} />
    </section>
  );

  const sections = orderedSections(shop, {
    categories: categories.length > 0 && (
      <div key="categories" className="flex flex-wrap gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white/5">
        {categories.map((c) => (
          <CategoryPill
            key={c.slug}
            category={c}
            className="text-sm uppercase tracking-wide text-white/70 hover:text-[var(--color-primary)] transition-colors"
          />
        ))}
      </div>
    ),
    flash_sale: <FlashSaleSection key="flash_sale" flashSale={flashSale} theme={theme} />,
    best_sellers: <ProductGridSection key="best_sellers" title="Best Sellers" products={bestSellers} theme={theme} />,
    new_arrivals: (
      <section key="new_arrivals" className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.slug}
              product={product}
              className={i === 0 ? 'col-span-2 sm:row-span-2' : ''}
            />
          ))}
        </div>
      </section>
    ),
    reviews: <ReviewsSection key="reviews" reviews={reviews} className="border-t border-white/10" />,
    faq: <FaqSection key="faq" faqs={faqs} />,
    newsletter: <NewsletterSection key="newsletter" theme={theme} className="bg-white/5" />,
    contact: <ContactSection key="contact" shop={shop} className="border-t border-white/10" />,
  });

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-16 md:pb-0" style={theme.style}>
      <HotlineBar shop={shop} />
      <Header shop={shop} categories={categories} logoClassName="uppercase tracking-widest text-sm" />
      <CategoryIconRow categories={categories} />

      <HeroSlider banners={banners} theme={theme} fallback={fallbackHero} />

      {sections}

      <Footer
        shop={shop}
        categories={categories}
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-white/10 text-sm text-white/40"
      />
    </div>
  );
}
