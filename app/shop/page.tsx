import ProductCard from "@/components/shop/ProductCard";
import { getStoreProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <main className="min-h-screen bg-white pb-16 pt-24 md:pb-20 md:pt-32">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center md:mb-16">
          <h1
            className="text-7xl font-normal leading-none tracking-[0.12em] sm:text-8xl md:text-9xl md:tracking-[0.16em]"
            style={{ fontFamily: "var(--font-lookbook)" }}
          >
            SHOP
          </h1>

          <p className="mt-4 tracking-wide text-gray-500">
            Discover the latest STRIP collection.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="border border-neutral-200 py-20 text-center text-neutral-600">
            The collection is being prepared.
          </div>
        )}
      </section>
    </main>
  );
}
