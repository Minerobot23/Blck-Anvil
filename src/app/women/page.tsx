import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/ShopPage";

export const metadata: Metadata = { title: "Women", description: "BLK ANVL women's training apparel: flared leggings and training shorts." };

export default function Page() {
  return <ShopPage title={["Women"]} intro="Flared leggings and training shorts." preset={{ gender: "women" }} />;
}
