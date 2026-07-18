# Shade matching and taste roadmap

## Product promise

A shopper photographs a sari or fabric, taps the shade she wants to match, and receives purchasable blouses in three useful modes:

1. **Closest match** — the nearest perceptual colour.
2. **Tonal match** — a lighter or darker version of the same hue.
3. **Intentional contrast** — complementary options that still suit the sari.

The result must show the retailer, current price, availability, colour confidence, and an exact product link. Search and explicit filters always outrank remembered taste.

## Phase 0: build the right inventory

The current catalogue is outfit-heavy and does not contain enough standalone blouses. Before building image search:

- Add a `blouse` product type and ingest standalone blouses from multiple trusted retailers.
- Store each colour/size variant as a separate purchasable SKU when the retailer exposes variants.
- Keep source URL, canonical product URL, image URL, price, availability, sizes, fabric, embellishment and last-checked timestamp.
- Require brand diversity in every result page and remove products with broken images or non-product URLs.
- Start with 2,000–5,000 good blouse SKUs; quality matters more than claiming 10,000 weak records.

## Phase 1: reliable colour matching MVP

### Capture experience

- Let the user take a photo or upload one.
- Ask her to photograph in indirect daylight without flash.
- Let her crop the sari and tap the exact fabric area.
- Display 3–5 extracted swatches so she can correct the selected shade.
- Offer `exact`, `tonal`, and `contrast` matching before search.

### Colour pipeline

1. Correct EXIF orientation and downscale the image locally.
2. Apply conservative white-balance/colour-constancy correction.
3. Sample an area around the user's tap rather than one pixel.
4. Remove highlights, deep shadows, skin and background pixels.
5. Cluster the remaining pixels and show the dominant fabric swatches.
6. Convert selected sRGB colour to CIELAB/LCH or OKLab.
7. Compare against catalogue swatches using perceptual colour distance (`Delta E 2000`), not RGB distance.

For genuinely accurate matching across different cameras and lighting, optionally ask the user to include a small neutral grey/white reference card. Without calibration, label results `close visual match`, not `exact colour match`.

### Catalogue enrichment

For every product image:

- Segment the blouse/garment from model, skin and background.
- Extract dominant and accent colours from the garment region.
- Store LAB/LCH values, colour coverage, extraction confidence and source image ID.
- Run a human review queue for low-confidence, metallic, sheer, multicolour or heavily shadowed images.

### Retrieval

1. Hard-filter to blouse, availability, budget, size and shipping region.
2. Retrieve nearest catalogue swatches by perceptual colour distance.
3. Apply the selected mode: exact, tonal or contrast.
4. Diversify brands.
5. Re-rank gently using taste and style similarity.

An LLM can explain results and parse requests, but it should not calculate the colour match.

## Phase 2: “same vibe” visual search

- Generate image embeddings for product crops with a fashion-capable vision encoder.
- Combine colour distance with silhouette, neckline, sleeve, fabric and embellishment similarity.
- Add `more like this` and `not for me` to every card.
- Let refinements alter one axis at a time: `same pink, simpler`, `same work, square neck`, or `slightly warmer`.

A first scoring model can be explicit and inspectable:

```text
final_score =
  45% colour match
  25% visual/style similarity
  15% explicit query and filters
  10% personal taste
   5% availability and catalogue quality
```

Exact weights should be tuned with evaluation data, not guessed permanently.

## Phase 3: durable taste

Record user-controlled events rather than a prose memory blob:

- `save`
- `not_for_me`
- `more_like_this`
- `clicked_retailer`
- `refined_from_product`
- explicit colour, budget, detail and brand preferences

Keep session intent separate from durable taste. A current request for a red bridal blouse must not be suppressed because the user usually saves pastel guestwear.

Start with a transparent weighted profile over brand, colour, garment type, detail and embedding centroid. Train a personalized ranker only after there is enough real feedback. Every learned signal should be visible, removable and exportable.

## Suggested data model

```text
products(id, brand, title, canonical_url, price, currency, available, updated_at)
variants(id, product_id, colour_name, size, sku, available)
images(id, product_id, url, width, height, quality_score)
colour_swatches(id, image_id, region, lab_l, lab_a, lab_b, coverage, confidence)
image_embeddings(image_id, model, vector)
taste_events(user_id, session_id, product_id, event, context, created_at)
taste_profiles(user_id, explicit_preferences, learned_features, updated_at)
```

Postgres is sufficient for product metadata and colour vectors. `pgvector` can store image embeddings; a separate vector database is unnecessary for the first version.

## API shape

- `POST /shade/extract` — image/crop/tap in; candidate swatches out.
- `POST /search/by-shade` — selected LAB colour, mode and filters in; ranked products out.
- `POST /search/similar` — source product/image plus refinements in; ranked products out.
- `POST /taste/events` — explicit feedback event.
- `GET /taste/profile` — editable explanation of learned preferences.

## Evaluation before launch

- Assemble at least 200 photographed fabrics under varied lighting with human-approved blouse matches.
- Measure top-5 and top-20 acceptable-match rate, not only numerical colour distance.
- Track brand diversity, broken links, in-stock accuracy and result latency.
- Test dark fabric, metallic thread, sheer organza, prints and mixed indoor lighting separately.
- Never claim an exact match when extraction confidence or lighting quality is low.

## Delivery sequence

1. Standalone blouse ingestion and data-quality dashboard.
2. Upload, crop, tap and swatch-confirmation UI.
3. LAB extraction and nearest-colour retrieval.
4. Exact/tonal/contrast result modes with existing filters.
5. Human evaluation and threshold tuning.
6. Image embeddings and `more like this` / `not for me`.
7. Account-backed taste events and cross-device profiles.

