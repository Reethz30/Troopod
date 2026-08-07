# Store setup — Purelane seed catalogue

Use a development store with Dawn + this theme folder.

## 1. Install theme

```bash
cd theme
shopify theme push --unpublished
# or: shopify theme dev
```

Assign the theme preview and open the homepage — Purelane sections should already be in `index.json`.

## 2. Create metafield definitions

See [METAFIELDS.md](./METAFIELDS.md) for `custom.badge`, `custom.rating`, `custom.review_count`.

## 3. Seed products (8+)

Create these plant-based homecare products (INR example pricing). Include the edge cases called out.

| # | Title | Price | Compare at | Tags / badge | Rating | Reviews | Notes |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- |
| 1 | Tap cleaner & limescale remover | 200 | 299 | Best seller | 4.8 | 237 | Featured image |
| 2 | Kitchen cleaner, foaming | 200 | 299 | Best seller | 4.8 | 254 | Featured image |
| 3 | Copper, bronze & brass cleaner | 200 | 299 | Top rated | 4.8 | 231 | Featured image |
| 4 | Washing machine cleaner & descaler | 200 | 299 | New | 4.8 | 183 | Featured image |
| 5 | Natural herbal floor cleaner with neem | 249 | 349 | Best seller | 4.7 | 412 | Featured image |
| 6 | Organic dishwash liquid gel | 199 | 299 | — | 4.9 | 508 | Featured image |
| 7 | Non-toxic toilet cleaner — plant powered deep clean formula for hard water bowls | 220 | 320 | — | 4.6 | 91 | **Long title** (tests line-clamp) |
| 8 | Gentle hydrating liquid handwash | 179 | 249 | — | — | — | **No rating metafields** (rate row hidden) |
| 9 | Fabric conditioner concentrate | 299 | 399 | — | 4.5 | 64 | Set **Sold out** / 0 inventory |
| 10 | Magic eraser multipack | 149 | 199 | New | 4.4 | 33 | **No featured image** (placeholder box) |

Optional extras for combos / hero stage:

- Laundry detergent
- Machine cleaner powder
- Multipurpose bathroom spray

## 4. Wire the theme editor

1. **Purelane shop** — select products 1–8 (or 1–10) in the product list.
2. **Purelane hero** — assign products/images on each slide (1 / 2 / 3 bottle compositions).
3. **Purelane combos** — link item products so tray images appear; captions already seeded.
4. **Purelane bundles** — optionally assign decorative tier products for `.tierpix`.

## 5. Collections (optional)

Create a **Bestsellers** collection and set it as the shop section collection fallback.

## 6. Cart behaviour

Product cards use Dawn `product` forms posting to cart. With cart drawer enabled in Dawn settings, add-to-cart should open the drawer after a full page cycle or via Dawn’s existing cart JS. If drawer does not open on AJAX, keep the native form POST or extend `purelane.js` to call `/cart/add.js` and publish Dawn’s cart events.

## 7. Currency

Set store currency to INR for ₹ display via `| money`. Combo/bundle section prices are static text matching the prototype until you bind them to real variants.
