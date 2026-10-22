import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/ShopPage";

export const metadata: Metadata = { title: "Women", description: "BLK ANVL women's training apparel: sculpt leggings, seamless sports bras, oversized hoodies and more." };

export default function Page() {
  return <ShopPage title={["Women"]} intro="Sculpted knits, seamless support and oversized layers." preset={{ gender: "women" }} />;
}
