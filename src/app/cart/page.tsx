import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Bag", robots: { index: false } };

export default function Page() {
  return <CartView />;
}
