import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/account/actions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createCustomerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My account",
  description: "View your STRIP account and order history.",
};

type AccountPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

type AccountOrderItem = {
  product_id: number;
  name: string;
  selected_size: string;
  quantity: number;
  line_total: number;
};

type AccountOrder = {
  id: number;
  items: AccountOrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

const statusStyles: Record<AccountOrder["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-violet-100 text-violet-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const supabase = await createCustomerClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const customerId = claimsData?.claims?.sub;

  if (claimsError || typeof customerId !== "string") {
    redirect("/account/login");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/account/login");
  }

  const { data: orderData, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, items, total, status, created_at")
    .eq("user_id", customerId)
    .order("created_at", { ascending: false });

  const orders = (orderData ?? []) as AccountOrder[];
  const fullName =
    typeof userData.user.user_metadata.full_name === "string"
      ? userData.user.user_metadata.full_name
      : "STRIP customer";
  const { message } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f2efe9] px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      <div className="mx-auto w-full max-w-6xl">
        {message ? (
          <p
            role="status"
            className="mb-6 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            {message}
          </p>
        ) : null}

        <header className="motion-fade-up flex flex-col justify-between gap-8 border-b border-neutral-300 pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Customer account
            </p>
            <h1 className="mt-4 text-5xl font-semibold text-neutral-950 md:text-7xl">
              Welcome, {fullName.split(" ")[0]}
            </h1>
            <p className="mt-4 text-sm text-neutral-600">
              Follow your orders from confirmation to delivery.
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="border border-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-neutral-950 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="motion-fade-up h-fit border border-neutral-300 bg-white p-7 [animation-delay:100ms]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Profile
            </p>
            <p className="mt-6 text-lg font-semibold text-neutral-950">
              {fullName}
            </p>
            <p className="mt-1 break-all text-sm leading-6 text-neutral-600">
              {userData.user.email}
            </p>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <p className="text-xs leading-6 text-neutral-500">
                Orders placed as a guest are not added automatically. Sign in
                before checkout to save a new order here.
              </p>
            </div>

            <Link
              href="/shop"
              className="mt-7 block bg-neutral-950 px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-700"
            >
              Continue shopping
            </Link>
          </aside>

          <section className="motion-fade-up [animation-delay:180ms]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Order history
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
                  Your orders
                </h2>
              </div>
              <p className="text-sm text-neutral-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            {orderError ? (
              <div className="mt-7 border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-700">
                Your order history could not be loaded right now. Please try
                again shortly.
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-7 border border-neutral-300 bg-white p-10 text-center md:p-14">
                <p className="font-display text-3xl font-semibold">
                  No saved orders yet
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-600">
                  Stay signed in when you place your next order and it will
                  appear here with its latest status.
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-block border-b border-neutral-950 pb-1 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Explore the collection
                </Link>
              </div>
            ) : (
              <div className="mt-7 space-y-5">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="border border-neutral-300 bg-white"
                  >
                    <header className="flex flex-col justify-between gap-4 border-b border-neutral-200 p-6 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                          Order #{order.id}
                        </p>
                        <p className="mt-2 text-sm text-neutral-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-lg font-semibold">
                          {order.total} MAD
                        </span>
                      </div>
                    </header>

                    <div className="space-y-4 p-6">
                      {order.items.map((item) => (
                        <div
                          key={`${item.product_id}-${item.selected_size}`}
                          className="flex justify-between gap-6 text-sm"
                        >
                          <div>
                            <p className="font-medium text-neutral-950">
                              {item.name}
                            </p>
                            <p className="mt-1 text-neutral-500">
                              Size {item.selected_size} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="shrink-0 font-medium">
                            {item.line_total} MAD
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
