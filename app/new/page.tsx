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
    <main className="min-h-screen bg-[#f7f4ef] pb-16 pt-24 text-neutral-950 md:pb-24 md:pt-36">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="motion-fade-up max-w-3xl border-b border-neutral-300 pb-9 md:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-700">
            Latest drop
          </p>

          <h1 className="mt-4 text-5xl font-medium leading-none tracking-[0.04em] sm:text-6xl md:mt-5 md:text-8xl md:tracking-[0.06em]">
            New arrivals
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-700 sm:text-base sm:leading-8 md:mt-6">
            Fresh essentials, considered silhouettes, and easy layers for the
            season ahead.
          </p>
        </div>

        {newProducts.length > 0 ? (
          <div className="motion-stagger mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:mt-14 md:grid-cols-3 md:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
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
