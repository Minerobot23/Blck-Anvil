import type { Metadata } from "next";
import { PageHeader } from "@/components/Page";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with BLK ANVL customer care." };

export default function Page() {
  return (
    <div className="pb-28">
      <PageHeader title={["Contact"]} intro="Questions about an order, sizing or a product. We aim to reply within one business day." />
      <div className="gutter grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6"><ContactForm /></div>
        <div className="space-y-8 text-sm text-fog lg:col-span-4 lg:col-start-9">
          <div><p className="eyebrow mb-3 text-mute">Customer care</p><p>support@blkanvl.com <span className="text-mute">(placeholder)</span></p></div>
          <div><p className="eyebrow mb-3 text-mute">Hours</p><p>Mon–Fri, 9:00–17:00 <span className="text-mute">(placeholder)</span></p></div>
          <div><p className="eyebrow mb-3 text-mute">Press &amp; wholesale</p><p>studio@blkanvl.com <span className="text-mute">(placeholder)</span></p></div>
        </div>
      </div>
    </div>
  );
}
