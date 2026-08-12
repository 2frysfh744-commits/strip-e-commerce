import ProductCard from "@/components/shop/ProductCard";
import { getStoreProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <main className="min-h-screen bg-white pb-20 pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h1
            className="text-8xl font-normal leading-none tracking-[0.16em] md:text-9xl"
            style={{ fontFamily: "var(--font-lookbook)" }}
          >
            SHOP
          </h1>

          <p className="mt-4 tracking-wide text-gray-500">
            Discover the latest STRIP collection.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
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
