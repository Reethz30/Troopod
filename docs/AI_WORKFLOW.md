# AI workflow notes

## What I delegated

- **CSS extraction + scoping** from the 148KB single-file prototype into `purelane.css` under `.purelane` (scripted; manual verification of `@media` nesting).
- **Section Liquid scaffolding** (schema defaults, presets, `index.json` seeds) so the homepage reads like the prototype before products are linked.
- **Docs pack** (metafields, store seed list, build notes) drafted from the brief in parallel with code.

## Where AI failed / needed correction

- First CSS scoper mangled `@media` into `.purelane @media {…}` — caught by grepping for the broken pattern and rewriting the brace walker.
- Initial hero/combo markup assumed uploaded images; without them the stage was empty. Fixed by wiring prototype bottle CSS classes (`p-kbtl`, `p-kitchen`, …) as merchant-selectable fallbacks.
- Nested Dawn `.git` inside the repo would have wrecked commit history if left alone — removed before committing.
- Translation filter misuse (`| t | default:`) is unreliable; hard-coded storefront strings for ATC / Sold out on the Purelane card.

## What I'd systematise for twenty more of these

1. **Prototype → token sheet.** One pass that dumps `:root`, type scale, breakpoints, and section inventory into a YAML spec agents must not invent against.
2. **Class-preserving port checklist.** “Same class names, Liquid for data” as a hard rule; fail CI if a section introduces unused BEM.
3. **Fallback media map.** Every decorative product slot gets `{ product | image | asset_class }` with priority — stops empty shelves in theme editor.
4. **Theme-editor harness.** Snippet + JS bootstrap that always binds `shopify:section:*` for carousels/marquees.
5. **Pixel QA pack.** 375 / 768 / 1200 screenshots vs prototype, plus reduced-motion and keyboard-only passes, as a repeatable agent prompt.
6. **Metafield bootstrap JSON.** Ship Admin definitions + sample product CSV so store seeding isn't reinvented each brief.
