import { products } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6">

        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-[0.25em]">
            SHOP
          </h1>

          <p className="mt-4 text-gray-500 tracking-wide">
            Discover the latest STRIP collection.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

      </section>
    </main>
  );
}