import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/components/shop/ShopPage";
import { COLLECTIONS, type CollectionId } from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COLLECTIONS[slug as CollectionId];
  return c ? { title: c.title, description: c.blurb } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COLLECTIONS[slug as CollectionId];
  if (!c) notFound();
  return <ShopPage title={c.title.split(" ")} intro={c.blurb} preset={{ collection: slug as CollectionId }} />;
}
