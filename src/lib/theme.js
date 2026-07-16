const queryParams = new URLSearchParams(window.location.search);

const DEFAULT_PRIMARY = '#3B82F6';
const DEFAULT_SECONDARY = '#8B5CF6';

// ?primary=/&secondary= let the dashboard's live preview reflect color picker
// changes instantly, before the shop owner saves them.
export function resolveTheme(shop) {
  const primary = queryParams.get('primary') || shop?.template_colors?.primary || DEFAULT_PRIMARY;
  const secondary = queryParams.get('secondary') || shop?.template_colors?.secondary || DEFAULT_SECONDARY;

  return {
    primary,
    secondary,
    style: {
      '--color-primary': primary,
      '--color-secondary': secondary,
    },
  };
}
