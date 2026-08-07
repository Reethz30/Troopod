# Purelane metafields

Namespace: `custom` (product metafields used by Purelane sections).

## Product metafields

| Key | Type | Example | Used by |
| --- | --- | --- | --- |
| `custom.badge` | Single line text | `Best seller` | `purelane-product-card` pill |
| `custom.rating` | Decimal / Number | `4.8` | Product card `.rate` |
| `custom.review_count` | Integer | `237` | Product card review count |

### Create in Admin

**Settings → Custom data → Products → Add definition**

1. **Badge**
   - Name: Badge
   - Namespace and key: `custom.badge`
   - Type: Single line text
   - Storefront access: Read

2. **Rating**
   - Name: Rating
   - Namespace and key: `custom.rating`
   - Type: Decimal (or Number)
   - Storefront access: Read

3. **Review count**
   - Name: Review count
   - Namespace and key: `custom.review_count`
   - Type: Integer
   - Storefront access: Read

### Fallback behaviour

If `custom.badge` is empty, the card looks for product tags (case-insensitive):

- `Best seller`
- `Top rated`
- `New`

If rating and review count are both empty, the rate row is hidden.

## Optional metaobject: `purelane_review`

Use if you later want reviews managed as metaobjects instead of section blocks.

| Field | Type |
| --- | --- |
| `stars` | Integer (1–5) |
| `title` | Single line text |
| `body` | Multi-line text |
| `author` | Single line text |
| `product_label` | Single line text |

Current homepage reviews ship as **section blocks** in `purelane-reviews` (see `index.json` defaults). Metaobjects are optional for a future content model.

## Liquid access examples

```liquid
{{ product.metafields.custom.badge.value }}
{{ product.metafields.custom.rating.value }}
{{ product.metafields.custom.review_count.value }}
```
