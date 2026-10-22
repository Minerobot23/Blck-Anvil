import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/ShopPage";

export const metadata: Metadata = { title: "New Arrivals", description: "The latest BLK ANVL releases." };

export default function Page() {
  return <ShopPage title={["New", "Arrivals"]} intro="The latest releases, newest first." preset={{ newOnly: true }} />;
}
