# Purelane build notes

## What was built

Shopify Dawn theme sections under `theme/` that recreate the Purelane homepage prototype (`purelane-homepage.html`) using the **V2 light** palette (the second `<style>` block in the prototype — pale mint ground, purple ink, leaf accent).

## Section order (`templates/index.json`)

Matches prototype order among the five required sections:

1. `purelane-atmosphere` — fixed gradient scenes (no document flow height)
2. `purelane-hero` — badges, headline, CTAs, 1→2→3 product stage
3. `purelane-reviews` — marquee (track duplicated for seamless loop)
4. `purelane-combos` — horizontal combo rail
5. `purelane-bundles` — tier pricing cards
6. `purelane-shop` — product shelf via `product_list` (collection fallback)

## What I'd flag in the original file

- **Two palettes stacked.** Dark V1 then light V2 overrides. The live look is V2; shipping both without scoping would thrash tokens.
- **Inline SVG product art as CSS data-URIs.** Fine for a prototype; on Shopify, real product media should win, with the SVG bottles as editor fallbacks only.
- **Duplicated review cards in markup** for the marquee. We keep the double-track pattern but generate it from one set of blocks.
- **Hard-coded ₹ prices** in combos/bundles/hero tags. Marketing copy in the prototype; product shelf uses live Shopify money.
- **`backdrop-filter` + large blur** everywhere. Pretty, expensive on low-end mobile — we kept it for pixel match but would audit with Lighthouse if optimizing.
- **Non-semantic density** (div soup, `h5` in cards). We kept class names for CSS fidelity; tightened a11y where cheap (button types, aria-labels, reduced motion).

## What we changed in the code (and why)

| Change | Why |
| --- | --- |
| Scoped all CSS under `.purelane` | Dawn must not inherit prototype `body`/`a`/`button` rules |
| Applied V2 light tokens as the final visual | Matches the prototype's shipped look, not the abandoned dark draft |
| Section settings + blocks for all copy | Marketing team can edit without a developer |
| Product list / product pickers for shop, hero, combos | Prices and media come from Shopify |
| Metafields for badge / rating / review count | Native fields don't cover marketing badges + star copy |
| Bottle asset selects as fallbacks (`p-kitchen`, `p-kbtl`, …) | Pixel-complete trays before product photography is uploaded |
| Theme-editor JS (`section:load` / `unload`) | Adding/removing/reordering must not break the carousel |
| `prefers-reduced-motion` short-circuits reveal + autoplay | Accessibility requirement |
| Line-clamp on product titles | Long-title edge case from the brief |
| Simplified water layers (gradients, not 40KB SVG filters) | Performance; geometry and motion intent preserved |

## Known gaps

1. **Shop shelf** needs products selected in the theme editor (placeholders until then).
2. **Atmosphere water** is simplified vs the full SVG turbulence in the prototype.
3. **Dawn header/footer** remain stock — closer pixel match would restyle or hide them on `.purelane-home`.
4. **Combo/bundle prices** are editable text (prototype marketing), not live variant totals — proper Shopify bundles need an app or draft-order flow.
5. **Bonus prototype sections** (ingredients, pillars, proof, range, why-bundles, signup, sticky CTA) were intentionally cut per the brief.

## With more time

- Port remaining bonus sections with the same pattern
- Wire combo “Shop bundle” into a real cart builder (line items preselected)
- Replace bottle SVG fallbacks with CDN product photography once seeded
- Lighthouse pass: defer non-critical CSS, reduce blur on mobile, subset fonts
- Optional `purelane_review` metaobject list instead of section blocks
- Hide Dawn header on homepage or rebuild Purelane nav as a section

## Theme editor survival

`purelane.js` listens for `shopify:section:load` / `unload` / `reorder`, keys hero carousels by `data-section-id`, and drives scroll scene depth via `[data-scene]` zones.
