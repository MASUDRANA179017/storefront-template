// Resolves a shop's configured homepage section order/visibility (set from
// the shop-owner dashboard's "Homepage Layout" panel) against a template's
// own styled JSX for each section type. Falls back to every key in
// `sectionMap`, in declaration order, when the shop hasn't customized it.
export function orderedSections(shop, sectionMap) {
  const config = shop?.homepage_sections?.length
    ? shop.homepage_sections
    : Object.keys(sectionMap).map((type) => ({ type, enabled: true }));

  return config.filter((s) => s.enabled && sectionMap[s.type]).map((s) => sectionMap[s.type]);
}
