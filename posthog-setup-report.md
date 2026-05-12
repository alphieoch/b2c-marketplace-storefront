<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Mercur storefront (`apps/storefront`). PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. Nine events are tracked across six files, covering the full customer journey from registration to order placement. Users are identified on login and registration using their email as the distinct ID.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Customer successfully logs in | `src/components/molecules/LoginForm/LoginForm.tsx` |
| `user_registered` | New customer creates an account | `src/components/molecules/RegisterForm/RegisterForm.tsx` |
| `product_added_to_cart` | Customer adds a product variant to their cart | `src/components/cells/ProductDetailsHeader/ProductDetailsHeader.tsx` |
| `checkout_started` | Customer clicks "Go to checkout" from the cart | `src/components/sections/Cart/Cart.tsx` |
| `order_placed` | Customer successfully completes payment | `src/components/sections/CartReview/PaymentButton.tsx` |
| `payment_error_occurred` | Payment attempt fails during checkout | `src/components/sections/CartReview/PaymentButton.tsx` |
| `wishlist_item_added` | Customer adds a product to their wishlist | `src/components/cells/WishlistButton/WishlistButton.tsx` |
| `wishlist_item_removed` | Customer removes a product from their wishlist | `src/components/cells/WishlistButton/WishlistButton.tsx` |
| `seller_review_submitted` | Customer successfully submits a seller review | `src/components/molecules/ReviewForm/ReviewForm.tsx` |

**Other changes:**
- `instrumentation-client.ts` — PostHog client-side initialization (Next.js 15.3+ pattern)
- `next.config.ts` — reverse proxy rewrites for `/ingest` to avoid ad blockers
- `apps/storefront/.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` env vars

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1565091)
- [Purchase Conversion Funnel](/insights/WfhZo3tY) — Cart → Checkout → Order conversion rates
- [New Signups Over Time](/insights/bZ1qeAk8) — Daily new customer registrations
- [Orders Placed Over Time](/insights/pXGwRa6Z) — Daily order volume
- [Wishlist Engagement](/insights/w2Rn8cpJ) — Items added vs removed from wishlists
- [Payment Errors](/insights/SFnpAaKf) — Payment failures over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
