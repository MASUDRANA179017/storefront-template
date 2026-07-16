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
import { StorefrontLayout } from './components/StorefrontLayout';
import { resolveTemplateSlug } from './lib/resolveTemplate';
import { TEMPLATE_CHROME } from './lib/templateChrome';

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

  return (
    <HashRouter>
      <ExitToDashboardBar />
      <CartDrawer dark={isDark} />
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
    </HashRouter>
  );
}
