import Image from "next/image";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "@/components/admin/LogoutButton";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

type OrderItem = {
  product_id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  selected_size: string;
  quantity: number;
  line_total: number;
};

type Order = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  postal_code: string | null;
  address: string;
  delivery_instructions: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status:
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
  created_at: string;
};

function getStatusClasses(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "shipped":
      return "bg-purple-100 text-purple-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function AdminOrdersPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
        id,
        full_name,
        phone,
        email,
        city,
        postal_code,
        address,
        delivery_instructions,
        items,
        subtotal,
        delivery_fee,
        total,
        status,
        created_at
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Unable to load admin orders:", error);

    return (
      <main className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
        <div className="border border-red-300 bg-red-50 p-6 text-red-700">
          Unable to load orders. Check the terminal for details.
        </div>
      </main>
    );
  }

  const orders = (data ?? []) as Order[];

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              STRIP ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Customer orders
            </h1>

            <p className="mt-3 text-neutral-600">
              View orders placed through your store.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
  <div className="border border-neutral-200 bg-white px-5 py-3">
    <span className="text-sm text-neutral-500">
      Total orders:
    </span>{" "}
    <span className="font-semibold">{orders.length}</span>
  </div>

  <LogoutButton />
</div>
        </div>

        {orders.length === 0 ? (
          <div className="border border-neutral-200 bg-white p-12 text-center">
            <h2 className="text-xl font-medium">
              No orders yet
            </h2>

            <p className="mt-2 text-neutral-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden border border-neutral-200 bg-white"
              >
                <header className="flex flex-col justify-between gap-5 border-b border-neutral-200 p-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Order
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                      #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
  <span
    className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider ${getStatusClasses(
      order.status
    )}`}
  >
    {order.status}
  </span>

  <OrderStatusSelect
    orderId={order.id}
    currentStatus={order.status}
  />

  <span className="text-xl font-semibold text-neutral-900">
    {order.total} MAD
  </span>
</div>
                </header>

                <div className="grid lg:grid-cols-[1fr_340px]">
                  <section className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                      Items
                    </h3>

                    <div className="mt-5 space-y-5">
                      {order.items.map((item) => (
                        <div
                          key={`${item.product_id}-${item.selected_size}`}
                          className="flex gap-4 border-b border-neutral-200 pb-5 last:border-b-0"
                        >
                          <div className="relative h-28 w-24 shrink-0 bg-neutral-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="flex flex-1 justify-between gap-4">
                            <div>
                              <h4 className="font-medium">
                                {item.name}
                              </h4>

                              <p className="mt-2 text-sm text-neutral-500">
                                Size: {item.selected_size}
                              </p>

                              <p className="text-sm text-neutral-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="text-sm text-neutral-500">
                                Unit price: {item.price} MAD
                              </p>
                            </div>

                            <p className="font-medium">
                              {item.line_total} MAD
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="ml-auto mt-6 max-w-sm space-y-3 border-t border-neutral-200 pt-5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">
                          Subtotal
                        </span>

                        <span>{order.subtotal} MAD</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-500">
                          Delivery
                        </span>

                        <span>
                          {order.delivery_fee === 0
                            ? "Free"
                            : `${order.delivery_fee} MAD`}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                        <span>Total</span>
                        <span>{order.total} MAD</span>
                      </div>
                    </div>
                  </section>

                  <aside className="border-t border-neutral-200 bg-neutral-50 p-6 lg:border-l lg:border-t-0">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                      Customer
                    </h3>

                    <div className="mt-5 space-y-4 text-sm">
                      <div>
                        <p className="text-neutral-500">Name</p>
                        <p className="mt-1 font-medium">
                          {order.full_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-500">Phone</p>
                        <p className="mt-1">{order.phone}</p>
                      </div>

                      <div>
                        <p className="text-neutral-500">Email</p>
                        <p className="mt-1 break-words">
                          {order.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-500">Address</p>

                        <p className="mt-1 leading-6">
                          {order.address}
                          <br />
                          {order.city}
                          {order.postal_code
                            ? `, ${order.postal_code}`
                            : ""}
                        </p>
                      </div>

                      {order.delivery_instructions && (
                        <div>
                          <p className="text-neutral-500">
                            Delivery instructions
                          </p>

                          <p className="mt-1 leading-6">
                            {order.delivery_instructions}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-neutral-500">
                          Payment
                        </p>

                        <p className="mt-1">
                          Cash on delivery
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}