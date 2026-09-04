import Link from "next/link";
import { redirect } from "next/navigation";

import HomepageImageManager from "@/components/admin/HomepageImageManager";
import LogoutButton from "@/components/admin/LogoutButton";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAdminHomepageImageState } from "@/lib/homepage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Homepage images",
};

export default async function AdminHomepagePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { images, ready } = await getAdminHomepageImageState();

  return (
    <main className="min-h-screen bg-neutral-100 px-5 pb-20 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              STRIP ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">
              Homepage images
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Upload the pictures used in the hero, moving gallery, and category
              panels without changing the website code.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-neutral-950"
            >
              View homepage
            </Link>
            <Link
              href="/admin/products"
              className="border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-neutral-950"
            >
              Products & stock
            </Link>
            <Link
              href="/admin/orders"
              className="border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-neutral-950"
            >
              Customer orders
            </Link>
            <LogoutButton />
          </div>
        </header>

        {ready ? (
          <HomepageImageManager images={images} />
        ) : (
          <div className="border border-amber-300 bg-amber-50 p-7 text-amber-950">
            <h2 className="text-xl font-semibold">One setup step is required</h2>
            <p className="mt-3 leading-7">
              Run <strong>database/homepage-images.sql</strong> in the Supabase
              SQL Editor, then refresh this page. The public homepage will keep
              using its current pictures until that is done.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
