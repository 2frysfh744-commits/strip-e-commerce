import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

export default function NewArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">

      <div className="flex items-end justify-between mb-14">

        <div>
          <p className="uppercase tracking-[0.35em] text-xs text-neutral-500">
            Latest Drop
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-light tracking-[0.15em]">
            NEW ARRIVALS
          </h2>
        </div>

        <Link
          href="/shop"
          className="hidden md:block uppercase tracking-[0.2em] text-sm border-b border-black hover:opacity-60 transition"
        >
          View All
        </Link>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>

      <div className="flex justify-center mt-14 md:hidden">
        <Link
          href="/shop"
          className="uppercase tracking-[0.2em] border-b border-black"
        >
          View All
        </Link>
      </div>

    </section>
  );
}