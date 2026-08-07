import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/admin/LogoutButton";
import ProductManager from "@/components/admin/ProductManager";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAdminProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products & stock",
};

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let products: Product[] | null = null;

  try {
    products = await getAdminProducts();
  } catch (error) {
    console.error("Unable to load product management:", error);
  }

  if (!products) {
    return (
      <main className="min-h-screen bg-neutral-100 px-5 pb-20 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-4xl border border-red-200 bg-red-50 p-8 text-red-800">
          <h1 className="text-2xl font-semibold">Products are not ready yet</h1>
          <p className="mt-3 leading-7">
            Run the product catalogue and inventory SQL file in Supabase, then
            refresh this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-5 pb-20 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              STRIP ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">
              Products & stock
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Add products, upload photos, publish collections, and keep the
              exact quantity for every size.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-neutral-950"
            >
              Customer orders
            </Link>
            <LogoutButton />
          </div>
        </header>

        <ProductManager products={products} />
      </div>
    </main>
  );
}
