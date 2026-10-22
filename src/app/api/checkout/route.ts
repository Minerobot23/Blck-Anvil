import { NextResponse } from "next/server";
import { getProduct, stockFor, type ColorId } from "@/lib/products";

type Line = { slug: string; color: ColorId; size: string; qty: number };

/**
 * Checkout endpoint. Validates the bag server-side, then hands off to a
 * payment provider. No provider is configured yet, so it answers { demo: true } and
 * the storefront shows a labelled demo state. See src/lib/commerce.ts.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { lines?: Line[] } | null;
  const lines = body?.lines;
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }
  for (const l of lines) {
    const p = getProduct(l.slug);
    if (!p || !p.colors.includes(l.color) || !p.sizes.includes(l.size) || !(l.qty > 0 && l.qty <= 10)) {
      return NextResponse.json({ error: "One or more items in your bag are no longer available." }, { status: 400 });
    }
    if (stockFor(l.slug, l.color, l.size) === 0) {
      return NextResponse.json({ error: `${p.name} (${l.size}) is sold out.` }, { status: 409 });
    }
  }

  if (process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.STRIPE_SECRET_KEY) {
    // TODO: implement the configured provider adapter (see src/lib/commerce.ts).
    return NextResponse.json({ demo: true, message: "Payment provider credentials found, but the adapter is not implemented yet. No order was placed." });
  }
  return NextResponse.json({ demo: true, message: "No payment provider is configured. This is a demo checkout — no order has been placed and no payment taken." });
}
