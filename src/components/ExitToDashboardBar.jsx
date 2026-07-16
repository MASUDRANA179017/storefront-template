export function ExitToDashboardBar() {
  const isDashboardPreview = new URLSearchParams(window.location.search).get('dashboard') === '1';

  if (!isDashboardPreview) return null;

  return (
    <a
      href="/shop-owner/storefront"
      className="fixed top-3 left-3 z-[100] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/80 text-white text-xs font-semibold shadow-lg backdrop-blur-sm hover:bg-black transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Exit to Dashboard
    </a>
  );
}
