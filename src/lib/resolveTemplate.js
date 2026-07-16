// ?template=slug lets you preview any template in dev without restarting Vite;
// falls back to the build-time env var baked into the downloadable package.
export function resolveTemplateSlug() {
  const override = new URLSearchParams(window.location.search).get('template');
  return override || import.meta.env.VITE_TEMPLATE || 'modern-minimal';
}
