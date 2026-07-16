# Your Storefront Website

This is a ready-to-build frontend for your shop, pre-configured to pull products, categories, and branding from your shop's API.

## 1. Configure

If `.env.production` isn't already present (it's added automatically when you download this from your shop dashboard), copy `.env.example` to `.env` and fill in:

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

## Maintainers: rebuilding the in-dashboard live preview

The shop-owner "Storefront Template" page embeds this same build (served from the main app's `public/storefront-preview/`) so template/color changes can be previewed live before a shop owner downloads their own copy. It reads `?shop=`, `?template=`, `?primary=`, `?secondary=` from the URL at runtime instead of baked env vars. Rebuild it after changing any template:

```
npm run build
rm -rf ../public/storefront-preview && mkdir ../public/storefront-preview
cp -r dist/* ../public/storefront-preview/
```
