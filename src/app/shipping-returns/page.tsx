import type { Metadata } from "next";
import { PageHeader, DraftNotice, Prose } from "@/components/Page";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default function Page() {
  return (
    <div className="pb-28">
      <PageHeader title={["Shipping", "& Returns"]} />
      <div className="gutter">
        <div className="max-w-2xl"><DraftNotice>Rates, timeframes and conditions below are placeholders and must be confirmed with fulfilment partners before launch.</DraftNotice></div>
        <Prose>
          <h2>Shipping</h2>
          <ul>
            <li><strong>Standard</strong> — 3–5 business days. $8, free on orders over $100.</li>
            <li><strong>Express</strong> — 1–2 business days. Rate shown at checkout.</li>
          </ul>
          <p>Orders placed before 1pm on business days are typically dispatched the same day. You will receive tracking by email once your order ships.</p>
          <h2>Returns</h2>
          <p>Return unworn, unwashed items with original tags within 30 days of delivery for a refund to your original payment method.</p>
          <p>Final sale items and underwear-style products (including sports bras) may not be eligible for return for hygiene reasons.</p>
          <h2>Exchanges</h2>
          <p>Need a different size? Start a return and place a new order to secure the size you want while stock is available.</p>
        </Prose>
      </div>
    </div>
  );
}
