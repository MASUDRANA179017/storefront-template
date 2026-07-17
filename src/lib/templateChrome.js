// Header/Footer styling per template, extracted from each template's own
// Home.jsx so secondary pages (product, cart, checkout, account, etc.) can
// share the exact same chrome instead of rendering bare/unstyled.
export const TEMPLATE_CHROME = {
  'modern-minimal': {
    wrapperClassName: 'bg-white text-gray-900 min-h-screen font-sans flex flex-col',
    logoClassName: '',
    footerClassName: 'px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-gray-100 text-sm text-gray-400',
  },
  'bold-boutique': {
    wrapperClassName: 'bg-black text-white min-h-screen font-sans flex flex-col',
    logoClassName: 'uppercase tracking-widest text-sm',
    footerClassName: 'px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-white/10 text-sm text-white/40',
    dark: true,
  },
  'grocery-fresh': {
    wrapperClassName: 'bg-gray-50 text-gray-900 min-h-screen font-sans flex flex-col',
    logoClassName: '',
    footerClassName: 'px-4 sm:px-6 py-6 sm:py-8 text-sm text-white/80',
    accentBackground: true,
  },
  'fashion-editorial': {
    wrapperClassName: "bg-[#f8f6f2] text-gray-900 min-h-screen font-serif flex flex-col",
    logoClassName: 'text-2xl italic tracking-wide',
    footerClassName: 'px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-gray-200 text-sm text-gray-500',
  },
  'electronics-tech': {
    wrapperClassName: 'bg-slate-950 text-slate-100 min-h-screen font-mono flex flex-col',
    logoClassName: 'text-[var(--color-primary)]',
    footerClassName: 'px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t text-xs text-slate-500',
    accentBorder: true,
    dark: true,
  },
};
