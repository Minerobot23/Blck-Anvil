import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/ShopPage";

export const metadata: Metadata = { title: "Men", description: "BLK ANVL men's training apparel: heavyweight hoodies, oversized tees, compression and shorts." };

export default function Page() {
  return <ShopPage title={["Men"]} intro="Heavyweight layers, compression and training staples." preset={{ gender: "men" }} />;
}
