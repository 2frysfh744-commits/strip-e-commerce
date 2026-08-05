"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo } from "react";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
const clearCart = useCart((state) => state.clearCart);
const router = useRouter();
  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const total = subtotal + deliveryFee;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  clearCart();
  router.replace("/order-confirmation");
}
  if (items.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Your cart is empty</h1>

          <p className="mt-3 text-neutral-600">
            Add a product before continuing to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block bg-black px-8 py-3 text-sm font-medium text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          STRIP
        </p>

        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-12 lg:grid-cols-[1fr_420px]"
      >
        <div className="space-y-12">
          <section>
            <h2 className="border-b border-neutral-200 pb-4 text-xl font-medium">
              Contact information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Full name</span>

                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Your full name"
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Phone number</span>

                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+212 6..."
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">
                  Email address
                </span>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="example@email.com"
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="border-b border-neutral-200 pb-4 text-xl font-medium">
              Delivery address
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">City</span>

                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Casablanca"
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Postal code</span>

                <input
                  type="text"
                  name="postalCode"
                  placeholder="Optional"
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">Address</span>

                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Street, building, apartment..."
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">
                  Delivery instructions
                </span>

                <textarea
                  name="instructions"
                  rows={4}
                  placeholder="Optional notes for the delivery driver"
                  className="w-full resize-none border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="border-b border-neutral-200 pb-4 text-xl font-medium">
              Payment
            </h2>

            <label className="mt-6 flex cursor-pointer items-center gap-4 border border-black p-5">
              <input
                type="radio"
                name="payment"
                value="cash-on-delivery"
                defaultChecked
              />

              <span>
                <span className="block font-medium">
                  Cash on delivery
                </span>

                <span className="mt-1 block text-sm text-neutral-600">
                  Pay when your order arrives.
                </span>
              </span>
            </label>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 border border-neutral-200 p-6">
            <h2 className="text-xl font-medium">Order summary</h2>

            <div className="mt-6 max-h-[420px] space-y-5 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        Size: {item.selectedSize}
                      </p>

                      <p className="text-sm text-neutral-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      {item.price * item.quantity} MAD
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>{subtotal} MAD</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Delivery</span>
                <span>
                  {deliveryFee === 0
                    ? "Free"
                    : `${deliveryFee} MAD`}
                </span>
              </div>

              <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{total} MAD</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-black px-6 py-4 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-neutral-800"
            >
              Place order
            </button>

            <p className="mt-4 text-center text-xs text-neutral-500">
              Free delivery on orders of 500 MAD or more.
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}