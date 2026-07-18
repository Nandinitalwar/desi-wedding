# Catalog and retrieval system

The product grid must be backed by retailer inventory, not generated recommendations. An LLM interprets intent; it never invents a product, price, image, attribution, or URL.

## Target corpus

- 10,000–20,000 active women’s wedding styles across roughly 60 approved sources.
- A balanced mix of couture, luxury, premium and accessible inventory.
- Every record resolves to one canonical product-detail page, not a homepage or editorial article.
- Every image has an explicit feed/API source and usage basis.
- Price, stock and canonical URL are refreshed daily; unavailable products are removed from retrieval quickly.

A practical first target is 40 retailers or labels averaging 250 active styles each. Multi-brand partners supply most of the early breadth; direct designer feeds preserve attribution and improve the high-taste layer.

## Acquisition boundary

Use sources in this order:

1. Merchant-provided CSV, XML, JSON or SFTP catalog feed.
2. Affiliate-network product feed containing exact product URLs and image permission.
3. Official Storefront/Commerce API with merchant approval.
4. Permissioned site adapter documented in the source registry.

Do not build the corpus by bypassing bot protection, reusing private cookies, or copying images from editorial publications. A source is not activated until its acquisition method and image rights are recorded.

## Ingestion pipeline

```text
approved source
  → source adapter
  → raw immutable snapshot
  → schema validation
  → URL/image normalization
  → duplicate and variant grouping
  → fashion attribute enrichment
  → human QA sample
  → keyword + vector indexes
  → searchable catalog
```

Each adapter emits the same product contract. Variants remain nested under a style so a five-size lehenga is one result, not five. Deduplication uses retailer ID, canonical URL, normalized title/brand and perceptual image hashes.

## Enrichment

Deterministic parsers should extract price, currency, stock and sizes. A vision/text enrichment job can add normalized attributes:

- garment and silhouette;
- normalized colour family plus raw colour name;
- occasion suitability;
- embroidery and embellishment;
- fabric, neckline, sleeves and coverage;
- perceived formality, movement and visual weight;
- bridal versus wedding-guest suitability.

Machine-generated attributes carry confidence and model version. Low-confidence designer attribution or garment classification enters a review queue.

## Search request

The conversational layer converts “pastel, easy to dance in, for a daytime mehendi under ₹30k” into validated JSON:

```json
{
  "hard_filters": {
    "currency": "INR",
    "price_max": 30000,
    "availability": "in_stock",
    "occasion": ["mehendi"],
    "colour_family": ["pastel"]
  },
  "soft_preferences": ["lightweight", "movement", "daytime"],
  "negative_preferences": [],
  "anchor_product_id": null
}
```

Hard constraints run as database filters. Candidate retrieval combines lexical search and image/text embeddings. A reranker then considers query fit, saved taste, retailer quality, freshness and catalog diversity. Price and availability are never inferred by the LLM.

“More blue” or “less work” uses the selected product as an anchor. The system adjusts colour/embellishment preferences, retrieves neighbours from the full corpus and reranks them; it does not merely shuffle the current page.

## Storage and serving

- PostgreSQL is the source of truth for products, variants, merchants, permissions and freshness.
- PostgreSQL full-text search or OpenSearch handles lexical retrieval and facets.
- `pgvector` or an equivalent vector index handles semantic and visual similarity.
- Object storage retains permitted raw feed snapshots and normalized images where licensing permits.
- `/api/search` returns 48 results, facets, a stable cursor and the interpreted query plan.
- The browser never downloads all 10,000 records.

## Quality controls

- Reject homepage URLs where a product-detail URL is required.
- Run daily broken-link, price and availability checks.
- Suppress products older than their source freshness SLA.
- Measure zero-result rate, exact-link success, save rate, refinement success and retailer coverage.
- Enforce brand diversity so one marketplace cannot occupy the entire first page.
- Keep affiliate commission out of relevance scoring, or expose sponsored placement explicitly.

## Build sequence

1. Sign or approve three high-volume feeds and reach 2,000 real SKUs.
2. Validate retrieval quality and exact-link freshness.
3. Expand to 10,000 active SKUs across at least 25 distinct labels.
4. Add image-to-product similarity and selected-item refinements.
5. Add personal photo recommendations only after consent, retention and sensitive-image policies are designed.
