import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ProductPage } from './pages/ProductPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { CartDrawer } from './components/CartDrawer';
import { ExitToDashboardBar } from './components/ExitToDashboardBar';
import { BottomTabBar } from './components/BottomTabBar';
import { ChatWidget } from './components/ChatWidget';
import { StorefrontLayout } from './components/StorefrontLayout';
import { MobileMenuProvider } from './lib/MobileMenuContext';
import { resolveTemplateSlug } from './lib/resolveTemplate';
import { TEMPLATE_CHROME } from './lib/templateChrome';
import { resolveTheme } from './lib/theme';
import { api } from './lib/api';

// CartDrawer/BottomTabBar/ChatWidget/the mobile menu's portal all render
// outside the per-page wrapper div that carries theme.style, so without this
// their var(--color-primary)-based styling has no ancestor to inherit from.
// Setting the vars on <html> makes them available everywhere, portals included.
function useGlobalThemeVars() {
  useEffect(() => {
    let cancelled = false;
    api
      .getShop()
      .then((res) => {
        if (cancelled) return;
        const theme = resolveTheme(res.data ?? res);
        Object.entries(theme.style).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
}

import { Home as ModernMinimal } from './templates/modern-minimal/Home';
import { Home as BoldBoutique } from './templates/bold-boutique/Home';
import { Home as GroceryFresh } from './templates/grocery-fresh/Home';
import { Home as FashionEditorial } from './templates/fashion-editorial/Home';
import { Home as ElectronicsTech } from './templates/electronics-tech/Home';

const TEMPLATES = {
  'modern-minimal': ModernMinimal,
  'bold-boutique': BoldBoutique,
  'grocery-fresh': GroceryFresh,
  'fashion-editorial': FashionEditorial,
  'electronics-tech': ElectronicsTech,
};

function resolveTemplate() {
  return TEMPLATES[resolveTemplateSlug()] ?? ModernMinimal;
}

export default function App() {
  const HomeComponent = resolveTemplate();
  const isDark = !!TEMPLATE_CHROME[resolveTemplateSlug()]?.dark;
  useGlobalThemeVars();

  return (
    <HashRouter>
      <MobileMenuProvider>
        <ExitToDashboardBar />
        <CartDrawer dark={isDark} />
        <ChatWidget dark={isDark} />
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route element={<StorefrontLayout />}>
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
        <BottomTabBar dark={isDark} />
      </MobileMenuProvider>
    </HashRouter>
  );
}
