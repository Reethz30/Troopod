# Troopod — Purelane Shopify theme

Plant-based homecare homepage built on **Shopify Dawn**, ported from the Purelane HTML prototype.

## Quick links

| Path | Description |
| --- | --- |
| [`theme/`](./theme/) | Dawn theme with Purelane sections, snippets, CSS, JS |
| [`purelane-homepage.html`](./purelane-homepage.html) | Visual / markup prototype (source of truth) |
| [`docs/BUILD_NOTES.md`](./docs/BUILD_NOTES.md) | What shipped, gaps, editor notes |
| [`docs/METAFIELDS.md`](./docs/METAFIELDS.md) | Product metafield definitions |
| [`docs/STORE_SETUP.md`](./docs/STORE_SETUP.md) | Seed catalogue + wiring checklist |
| [`docs/AI_WORKFLOW.md`](./docs/AI_WORKFLOW.md) | How to extend the theme safely |

## Homepage sections

1. Atmosphere (fixed mint scenes)
2. Hero
3. Reviews marquee
4. Combos rail
5. Bundles tiers
6. Shop shelf

Visual system: **V2 light** (pale mint ground, purple ink) via `theme/assets/purelane.css`.

## Develop

```bash
cd theme
shopify theme dev
```

Then open the storefront preview. On the homepage, body gets `purelane-home` and Purelane fonts are preconnected from `layout/theme.liquid`.

## Note on Dawn chrome

Header and footer remain Dawn’s defaults. Purelane content lives in the main template only. See build notes for optional header polish.
