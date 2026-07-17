import { Outlet } from 'react-router-dom';
import { useShopChrome } from '../lib/useShopChrome';
import { resolveTheme } from '../lib/theme';
import { resolveTemplateSlug } from '../lib/resolveTemplate';
import { TEMPLATE_CHROME } from '../lib/templateChrome';
import { Header } from './Header';
import { Footer } from './Footer';
import { HotlineBar } from './HotlineBar';
import { CategoryIconRow } from './CategoryIconRow';

// Shared Header + Footer chrome for every page that isn't the homepage
// (the homepage templates render their own, matching their unique layout).
// Without this, navigating to /product, /cart, /checkout, /account, etc.
// left customers with no logo, menu, search, or cart access at all.
export function StorefrontLayout() {
  const { shop, categories, loading, error } = useShopChrome();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="spinner" /></div>;
  if (error || !shop) return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">Failed to load storefront.</div>;

  const templateSlug = resolveTemplateSlug();
  const chrome = TEMPLATE_CHROME[templateSlug] ?? TEMPLATE_CHROME['modern-minimal'];
  const theme = resolveTheme(shop);

  let footerStyle;
  if (chrome.accentBackground) {
    footerStyle = { backgroundColor: theme.primary };
  } else if (chrome.accentBorder) {
    footerStyle = { borderColor: theme.primary + '33' };
  }

  return (
    <div className={`${chrome.wrapperClassName} pb-16 md:pb-0`} style={theme.style}>
      <HotlineBar shop={shop} />
      <Header shop={shop} categories={categories} logoClassName={chrome.logoClassName} />
      <CategoryIconRow categories={categories} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer shop={shop} categories={categories} className={chrome.footerClassName} style={footerStyle} />
    </div>
  );
}
