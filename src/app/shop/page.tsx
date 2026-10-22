import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/ShopPage";

export const metadata: Metadata = { title: "Shop All", description: "Every BLK ANVL piece — training apparel and lifestyle essentials for men and women." };

export default function Page() {
  return <ShopPage title={["Shop", "All"]} intro="Every piece, men's and women's. Filter by fit, colour and size." />;
}
