/**
 * Commerce provider boundary.
 *
 * The storefront talks to checkout only through `startCheckout`. Today no
 * payment provider is configured, so /api/checkout answers { demo: true } and the UI
 * shows an explicitly labelled demo state. To go live, implement one of the
 * adapters in src/app/api/checkout/route.ts:
 *
 *  - Shopify Storefront API: create a cart with `cartCreate` (lines map to
 *    ProductVariant GIDs) and redirect to `cart.checkoutUrl`.
 *    Env: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN
 *  - Stripe Checkout: create a Checkout Session server-side with line items
 *    mapped to Stripe Price IDs and redirect to `session.url`.
 *    Env: STRIPE_SECRET_KEY
 *
 * Product variants will need provider IDs (variant GID / price ID) added to
 * src/data/catalog.ts or loaded from the provider at build time.
 */
import type { CartLine } from "@/store/cart";

export type CheckoutResult =
  | { status: "redirect"; url: string }
  | { status: "demo"; reason: string }
  | { status: "error"; message: string };

export async function startCheckout(lines: CartLine[], contact: Record<string, string>): Promise<CheckoutResult> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lines: lines.map(({ slug, color, size, qty }) => ({ slug, color, size, qty })), contact }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { status: "error", message: data.error ?? "Checkout failed. Please try again." };
    if (data.demo) return { status: "demo", reason: data.message ?? "No payment provider configured." };
    if (data.url) return { status: "redirect", url: data.url };
    return { status: "error", message: "Unexpected checkout response." };
  } catch {
    return { status: "error", message: "Network error. Please try again." };
  }
}

export const FREE_SHIPPING_THRESHOLD = 100; // PLACEHOLDER policy
export const FLAT_SHIPPING = 8; // PLACEHOLDER rate
