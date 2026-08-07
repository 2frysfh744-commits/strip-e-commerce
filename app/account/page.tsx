import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  logoutAction,
  updateProfileAction,
} from "@/app/account/actions";
import SubmitButton from "@/components/account/SubmitButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createCustomerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My account",
  description: "View your STRIP account, saved details, and order history.",
};

type AccountPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

type CustomerProfile = {
  full_name: string;
  phone: string;
  city: string;
  postal_code: string | null;
  address: string;
  delivery_instructions: string | null;
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

const inputClasses =
  "w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-950";

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

  const [ordersResult, profileResult] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("id, items, total, status, created_at")
      .eq("user_id", customerId)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("customer_profiles")
      .select(
        "full_name, phone, city, postal_code, address, delivery_instructions"
      )
      .eq("user_id", customerId)
      .maybeSingle(),
  ]);

  const orders = (ordersResult.data ?? []) as AccountOrder[];
  const profile = profileResult.data as CustomerProfile | null;
  const metadataFullName =
    typeof userData.user.user_metadata.full_name === "string"
      ? userData.user.user_metadata.full_name
      : "STRIP customer";
  const fullName = profile?.full_name ?? metadataFullName;
  const { error, message } = await searchParams;

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

        {error ? (
          <p
            role="alert"
            className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
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
              Keep delivery details ready and follow every order.
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

        <section className="motion-fade-up mt-10 border border-neutral-300 bg-white [animation-delay:100ms]">
          <div className="border-b border-neutral-200 p-7 md:flex md:items-end md:justify-between md:gap-10 md:p-9">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Saved information
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
                Delivery details
              </h2>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-500 md:mt-0 md:text-right">
              These details fill checkout automatically. A signed-in checkout
              also keeps them up to date.
            </p>
          </div>

          {profileResult.error ? (
            <p className="mx-7 mt-7 border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:mx-9">
              Saved details could not be loaded right now.
            </p>
          ) : null}

          <form
            action={updateProfileAction}
            className="grid gap-5 p-7 md:grid-cols-2 md:p-9"
          >
            <label className="space-y-2">
              <span className="text-sm font-medium">Full name</span>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                required
                defaultValue={fullName}
                className={inputClasses}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Email address</span>
              <input
                type="email"
                value={userData.user.email ?? ""}
                readOnly
                className={`${inputClasses} cursor-not-allowed bg-neutral-100 text-neutral-500`}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Phone number</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                minLength={6}
                maxLength={30}
                required
                defaultValue={profile?.phone ?? ""}
                placeholder="+212 6..."
                className={inputClasses}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">City</span>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                minLength={2}
                maxLength={80}
                required
                defaultValue={profile?.city ?? ""}
                placeholder="Casablanca"
                className={inputClasses}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Postal code</span>
              <input
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                maxLength={20}
                defaultValue={profile?.postal_code ?? ""}
                placeholder="Optional"
                className={inputClasses}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Delivery address</span>
              <input
                type="text"
                name="address"
                autoComplete="street-address"
                minLength={5}
                maxLength={250}
                required
                defaultValue={profile?.address ?? ""}
                placeholder="Street, building, apartment..."
                className={inputClasses}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">
                Delivery instructions
              </span>
              <textarea
                name="deliveryInstructions"
                rows={3}
                maxLength={500}
                defaultValue={profile?.delivery_instructions ?? ""}
                placeholder="Optional notes for the delivery driver"
                className={`${inputClasses} resize-none`}
              />
            </label>

            <div className="md:col-span-2 md:ml-auto md:w-72">
              <SubmitButton pendingLabel="Saving details...">
                Save delivery details
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="motion-fade-up mt-12 [animation-delay:180ms]">
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

          {ordersResult.error ? (
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
    </main>
  );
}
