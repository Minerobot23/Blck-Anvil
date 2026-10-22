import { Suspense } from "react";
import { ShopView, type Preset } from "./ShopView";
import { ProductCardSkeleton } from "../ProductCard";

export function ShopPage(props: { title: string[]; intro?: string; preset?: Preset }) {
  return (
    <Suspense
      fallback={
        <div className="gutter pt-16 pb-24">
          <div className="skeleton mb-16 h-32 w-2/3 max-w-xl" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      }
    >
      <ShopView {...props} />
    </Suspense>
  );
}
