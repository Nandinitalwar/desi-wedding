# Desi Wedding partner checkout pilot

## Product promise

Desi Wedding may show products from many retailers, but it only offers `add to bag`
and native checkout for inventory supplied by an approved partner. Everything else
keeps its exact-item retailer link and is labelled `buy from brand`.

This separation prevents scraped catalogue data from being mistaken for live,
purchasable inventory.

## Pilot shape

- Start with 3–5 India-based designers that agree to the pilot.
- Prefer operational readiness over prestige: a reliable product feed, stable SKU and
  variant identifiers, an order-creation process, and a named returns contact are
  mandatory.
- Use Razorpay Route linked accounts for partner onboarding and split settlement.
- Use a hosted payment surface so Desi Wedding never handles raw card data.
- One customer payment can create multiple brand sub-orders, but the first launch
  should limit each order to one partner. Multi-brand checkout follows after the
  single-partner flow is proven.

Potential outreach candidates from the current catalogue are Abhinav Mishra,
Devnaagri, Payal Singhal, Seema Gujral, and Torani. Inclusion here is not a claim of
partnership; final pilot brands must explicitly opt in and pass the readiness check.

## Partner readiness checklist

Each partner must provide:

- signed commercial, fulfilment, cancellation, return, refund, and data-use terms;
- legal business, GST, bank, and Razorpay linked-account onboarding information;
- stable product, SKU, size, price, inventory, image, and canonical URL data;
- an inventory update mechanism with timestamps;
- an authenticated order endpoint or an agreed operational handoff;
- shipping service levels and tracking updates;
- a returns address and support escalation contact.

## Customer flow

1. A product card shows either `add to bag` or `buy from brand`.
2. Adding an item requires a valid size/variant and a recent inventory confirmation.
3. The bag identifies the fulfilling designer and shows delivery and returns before
   payment.
4. The server rechecks price and stock immediately before creating the payment.
5. Payment success is provisional until a verified webhook is received.
6. Desi Wedding creates one internal order and one partner sub-order.
7. The customer receives confirmation only after partner acceptance. If acceptance
   fails, the system automatically begins a full refund.
8. Tracking, cancellation, return, and refund status remain visible in the account.

## Architecture

The existing static catalogue remains the discovery frontend. Native checkout adds:

- an application API with authenticated users and server-side authorization;
- PostgreSQL for partners, products, variants, inventory snapshots, carts, orders,
  sub-orders, payments, refunds, fulfilments, and an append-only event log;
- one adapter per partner for catalogue, inventory, order, and fulfilment operations;
- Razorpay order creation, hosted checkout, Route transfers, signed webhooks, refunds,
  and reconciliation;
- object storage for partner feed imports and audit snapshots;
- a job queue for feed ingestion, retries, order handoff, webhooks, and reconciliation;
- transactional email/SMS for order events;
- error monitoring, structured logs, uptime checks, and operator alerts.

Secrets stay server-side. Prices, settlement amounts, stock decisions, and payment
status are never trusted from browser input.

## Reliability rules

- Every native-checkout variant has a source timestamp and inventory expiry time.
- Stale or unreachable inventory automatically falls back to `buy from brand`.
- Checkout performs a final atomic inventory reservation or partner confirmation.
- Order creation, payment webhooks, transfers, refunds, and emails are idempotent.
- Webhook signatures are verified and raw events are retained for replay.
- A reconciliation job compares payment, transfer, refund, and internal order state.
- Failed partner handoffs enter a visible operations queue; they never disappear.
- Catalogue imports are schema-validated, deduplicated, and rejected on anomalous
  price, availability, or record-count changes.
- Broken images and exact-item links are checked continuously.
- Checkout has a kill switch per product, partner, and globally.
- Backups and restoration are tested, not merely configured.

Initial service targets:

- 99.9% availability for browsing and account/order history;
- 99.95% availability for checkout APIs;
- partner inventory no more than 15 minutes stale, unless the partner supports live
  reservation;
- payment/order mismatch alert within 5 minutes;
- no customer charged without a recoverable internal order record;
- full audit history for every order-state change.

## Delivery sequence

### Phase 0 — partner and policy validation (2–4 weeks, business-led)

- approach 8–10 designers to secure 3–5 launch partners;
- agree commission, settlement, shipping, returns, cancellations, and support;
- confirm Razorpay Route eligibility and complete linked-account onboarding;
- collect sample feeds and exercise each partner's order workflow.

### Phase 1 — reliable commerce foundation (3–5 weeks)

- introduce the API, database, authentication, partner product model, and event log;
- build ingestion validation, freshness controls, link/image monitoring, and the
  partner operations dashboard;
- visibly distinguish verified partner inventory from discovery listings.

### Phase 2 — single-partner checkout (3–4 weeks)

- build variant selection, bag, address, delivery quote, Razorpay test checkout,
  signed webhooks, order handoff, confirmation, cancellation, and refunds;
- run automated tests and failure drills using test payments;
- launch internally, then to a small invited cohort with one partner.

### Phase 3 — expand the pilot (3–6 weeks)

- add the remaining partners one at a time;
- add multi-brand order splitting only after each partner meets fulfilment targets;
- introduce returns self-service, support tooling, payout reconciliation, and weekly
  partner scorecards.

## Release gates

Real payments remain disabled until all of these are true:

- at least one signed and fully onboarded partner;
- legal/accounting review of marketplace, GST/TCS, privacy, and consumer terms;
- production Razorpay approval and webhook secrets;
- end-to-end test of success, decline, timeout, duplicate webhook, out-of-stock,
  partner rejection, cancellation, partial failure, and refund paths;
- a human owner for fulfilment and customer-support exceptions;
- monitoring, reconciliation, backups, and checkout kill switches tested in production.

## Immediate build milestone

Build the commerce foundation against a fake `Demo Designer` adapter and Razorpay test
mode. This makes the complete flow testable without implying that any real designer
has partnered with Desi Wedding. Replace the demo adapter only after a partner passes
the readiness checklist.
