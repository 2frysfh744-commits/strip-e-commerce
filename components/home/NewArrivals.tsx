import Link from "next/link";

import ProductCard from "@/components/shop/ProductCard";
import { products } from "@/data/products";

export default function NewArrivals() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="motion-fade-up mb-14 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700">
            Latest Drop
          </p>

          <h2 className="mt-3 text-4xl font-medium tracking-[0.12em] md:text-5xl">
            NEW ARRIVALS
          </h2>
        </div>

        <Link
          href="/new"
          className="hidden border-b border-black pb-1 text-sm font-semibold uppercase tracking-[0.2em] transition duration-300 hover:-translate-y-1 hover:opacity-60 md:block"
        >
          View All
        </Link>
      </div>

      <div className="motion-stagger grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="mt-14 flex justify-center md:hidden">
        <Link
          href="/new"
          className="border-b border-black pb-1 font-semibold uppercase tracking-[0.2em]"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
