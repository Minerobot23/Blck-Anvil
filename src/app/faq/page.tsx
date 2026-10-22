import type { Metadata } from "next";
import { PageHeader, DraftNotice } from "@/components/Page";
import { FaqList } from "@/components/FaqList";

export const metadata: Metadata = { title: "FAQ", description: "Answers to common questions about BLK ANVL orders, sizing, shipping and returns." };

const FAQ = [
  { q: "How do your pieces fit?", a: "Each product page lists its fit — oversized, relaxed, regular, athletic or compression. Our size guide gives body measurements for every size." },
  { q: "How long does shipping take?", a: "Standard shipping is typically 3–5 business days and express 1–2 business days once your order has been dispatched." },
  { q: "What is your returns policy?", a: "Unworn items with tags attached can be returned within 30 days of delivery. See Shipping & Returns for the full policy." },
  { q: "Can I change or cancel my order?", a: "Contact us as soon as possible. We can usually amend orders that have not yet been dispatched." },
  { q: "How should I wash garment-washed pieces?", a: "Wash cold, inside out, with similar colours. Garment-washed items are pre-washed, but slight tonal variation between pieces is part of the finish." },
  { q: "Do you ship internationally?", a: "International shipping destinations and duties will be confirmed before launch." },
];

export default function Page() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <div className="pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader title={["FAQ"]} />
      <div className="gutter max-w-4xl">
        <DraftNotice>Answers reflect placeholder policies and must be confirmed before launch.</DraftNotice>
        <FaqList items={FAQ} />
      </div>
    </div>
  );
}
