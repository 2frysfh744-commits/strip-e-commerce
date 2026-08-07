import ProductCard from "@/components/shop/ProductCard";
import { getStoreProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Arrivals",
};

export default async function NewArrivalsPage() {
  const products = await getStoreProducts();
  const newProducts = products.filter((product) => product.newArrival);

  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-24 pt-36 text-neutral-950">
      <section className="mx-auto max-w-7xl px-6">
        <div className="motion-fade-up max-w-3xl border-b border-neutral-300 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-700">
            Latest drop
          </p>

          <h1 className="mt-5 text-6xl font-medium tracking-[0.06em] md:text-8xl">
            New arrivals
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-700">
            Fresh essentials, considered silhouettes, and easy layers for the
            season ahead.
          </p>
        </div>

        {newProducts.length > 0 ? (
          <div className="motion-stagger mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-neutral-300 bg-white p-12 text-center text-neutral-600">
            The next collection is being prepared.
          </div>
        )}
      </section>
    </main>
  );
}
