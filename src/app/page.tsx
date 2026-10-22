import { Hero } from "@/components/home/Hero";
import { CategoryRail, ProductRail } from "@/components/home/Rails";
import { Uniform } from "@/components/home/Uniform";
import { Engineered } from "@/components/home/Engineered";
import { Everyday, GenderSplit } from "@/components/home/Everyday";
import { TheMark } from "@/components/home/TheMark";
import { PRODUCTS, newArrivals } from "@/lib/products";

export default function Home() {
  const fresh = newArrivals().slice(0, 8);
  const women = PRODUCTS.filter((p) => p.gender === "women");
  return (
    <>
      <Hero />
      <CategoryRail />
      <ProductRail eyebrow="Just landed" title={["New", "Arrivals"]} products={fresh} href="/new" />
      <Uniform />
      <Engineered />
      <GenderSplit />
      <Everyday />
      <ProductRail eyebrow="Women" title={["Built to", "move"]} products={women} href="/women" hrefLabel="Shop women" />
      <TheMark />
    </>
  );
}
