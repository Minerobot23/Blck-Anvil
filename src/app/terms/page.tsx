import type { Metadata } from "next";
import { PageHeader, DraftNotice, Prose } from "@/components/Page";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function Page() {
  return (
    <div className="pb-28">
      <PageHeader title={["Terms"]} intro="Draft — last updated: not yet published." />
      <div className="gutter">
        <div className="max-w-2xl"><DraftNotice /></div>
        <Prose>
          <h2>Use of this site</h2>
          <p>By using this website you agree to these terms. Content, imagery and the BLK ANVL name and marks are the property of BLK ANVL and may not be reproduced without permission.</p>
          <h2>Products and pricing</h2>
          <p>We aim to display products and prices accurately. Colours may vary slightly by screen. We reserve the right to correct pricing errors and to cancel orders affected by them.</p>
          <h2>Orders</h2>
          <p>An order is accepted when we send a dispatch confirmation. We may refuse or cancel orders at our discretion, including where stock is unavailable.</p>
          <h2>Liability</h2>
          <p>To the extent permitted by law, BLK ANVL is not liable for indirect or consequential losses arising from use of this website or our products.</p>
        </Prose>
      </div>
    </div>
  );
}
