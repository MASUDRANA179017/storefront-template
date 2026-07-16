# Storefront Templates

A ready-to-build React (Vite + Tailwind) storefront for shops on the marketplace platform, pre-configured to pull products, categories, banners, and branding from your shop's API.

## Branches

This repo ships one branch per template, so you can start from whichever look fits your shop. Every branch contains the **full, identical codebase** — all 5 templates are always available and switchable via `VITE_TEMPLATE` — branches only differ in which template is the default.

| Branch | Default template | Best for |
|---|---|---|
| `main` / `modern-minimal` | Modern Minimal | Clean, whitespace-driven, general retail |
| `bold-boutique` | Bold Boutique | High-contrast, dark, fashion/boutique |
| `grocery-fresh` | Grocery Fresh | Dense grid, many SKUs, grocery/convenience |
| `fashion-editorial` | Fashion Editorial | Lookbook-style, apparel/lifestyle |
| `electronics-tech` | Electronics Tech | Dark technical palette, spec-driven |

Pick a branch, or just clone `main` and set `VITE_TEMPLATE` yourself — nothing is removed on any branch.

## Customizing

- **Colors**: your shop's primary/secondary accent colors are pulled live from the API and applied via CSS variables — no code changes needed.
- **Homepage layout**: which sections appear on the homepage (flash sale, best sellers, reviews, FAQ, etc.) and their order is configurable per shop from the shop-owner dashboard's "Homepage Layout" panel, not hardcoded here.
- **Template-specific look**: each template's visual identity (fonts, spacing, header/footer style) lives in `src/templates/<template>/Home.jsx` and `src/lib/templateChrome.js` (shared header/footer chrome for non-homepage pages) — edit these directly for deeper customization.

## 1. Configure

Copy `.env.example` to `.env` and fill in:

- `VITE_API_BASE_URL` — your marketplace's API URL
- `VITE_SHOP_SLUG` — your shop's slug
- `VITE_TEMPLATE` — one of: `modern-minimal`, `bold-boutique`, `grocery-fresh`, `fashion-editorial`, `electronics-tech`

## 2. Build

```
npm install
npm run build
```

This produces a static `dist/` folder.

## 3. Deploy

Upload the contents of `dist/` to any static host — your own hosting account, Vercel, Netlify, Cloudflare Pages, etc. Then point your custom domain's DNS (A/CNAME record, per your host's instructions) at that deployment.

## 4. Develop locally

```
npm install
npm run dev
```
