"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/store/cart";
import { isRemoteProductImage } from "@/types/product";

type CheckoutProfile = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
  deliveryInstructions: string;
};

type ProfileResponse = {
  authenticated: boolean;
  profile: CheckoutProfile | null;
};

function fillEmptyField(
  form: HTMLFormElement,
  name: string,
  value: string
) {
  const field = form.elements.namedItem(name);

  if (
    (field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement) &&
    !field.value.trim()
  ) {
    field.value = value;
  }
}

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedDetailsLoaded, setSavedDetailsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedDetails() {
      try {
        const response = await fetch("/api/account/profile", {
          cache: "no-store",
        });

        if (!response.ok || cancelled) {
          return;
        }

        const result = (await response.json()) as ProfileResponse;
        const form = formRef.current;

        if (!result.authenticated || !result.profile || !form || cancelled) {
          return;
        }

        fillEmptyField(form, "fullName", result.profile.fullName);
        fillEmptyField(form, "phone", result.profile.phone);
        fillEmptyField(form, "email", result.profile.email);
        fillEmptyField(form, "city", result.profile.city);
        fillEmptyField(form, "postalCode", result.profile.postalCode);
        fillEmptyField(form, "address", result.profile.address);
        fillEmptyField(
          form,
          "instructions",
          result.profile.deliveryInstructions
        );
        setSavedDetailsLoaded(true);
      } catch {
        // Checkout remains fully available if saved details cannot be loaded.
      }
    }

    void loadSavedDetails();

    return () => {
      cancelled = true;
    };
  }, []);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const getValue = (name: string) =>
      String(formData.get(name) ?? "").trim();

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: getValue("fullName"),
          phone: getValue("phone"),
          email: getValue("email"),
          city: getValue("city"),
          postalCode: getValue("postalCode"),
          address: getValue("address"),
          deliveryInstructions: getValue("instructions"),
          items: items.map((item) => ({
            id: item.id,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
          })),
        }),
      });

      const result: {
        error?: string;
        orderId?: number;
      } = await response.json();

      if (!response.ok || !result.orderId) {
        throw new Error(result.error ?? "Your order could not be placed.");
      }

      clearCart();
      router.replace(`/order-confirmation?orderId=${result.orderId}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-24 sm:px-5 md:px-8 md:pb-20 md:pt-40">
      <div className="mb-8 md:mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          STRIP
        </p>

        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Checkout</h1>

        {savedDetailsLoaded ? (
          <p className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Your saved account details were added. You can change anything
            before placing the order.
          </p>
        ) : null}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-12"
      >
        <div className="space-y-10 md:space-y-12">
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
                  autoComplete="name"
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
                  autoComplete="tel"
                  required
                  placeholder="+212 6..."
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">Email address</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
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
                  autoComplete="address-level2"
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
                  autoComplete="postal-code"
                  placeholder="Optional"
                  className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">Address</span>
                <input
                  type="text"
                  name="address"
                  autoComplete="street-address"
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
                <span className="block font-medium">Cash on delivery</span>
                <span className="mt-1 block text-sm text-neutral-600">
                  Pay when your order arrives.
                </span>
              </span>
            </label>
          </section>
        </div>

        <aside>
          <div className="border border-neutral-200 p-4 sm:p-6 lg:sticky lg:top-24">
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
                      unoptimized={isRemoteProductImage(item.image)}
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
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
                  {deliveryFee === 0 ? "Free" : `${deliveryFee} MAD`}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{total} MAD</span>
              </div>
            </div>

            {submitError ? (
              <p
                role="alert"
                className="mt-6 border border-red-300 bg-red-50 p-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-black px-6 py-4 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Placing order..." : "Place order"}
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
