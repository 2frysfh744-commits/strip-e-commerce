"use client";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";

import { useCart } from "@/store/cart";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
          aria-label="Close shopping bag"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-medium uppercase tracking-[0.2em] text-black">
            Shopping Bag
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="text-black transition hover:text-neutral-500"
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <p className="text-neutral-500">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 border-b border-neutral-200 pb-6"
                >
                  <div className="relative h-32 w-24 shrink-0 bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <h3 className="text-sm font-medium uppercase tracking-[0.1em] text-black">
                        {item.name}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id, item.selectedSize)
                        }
                        aria-label={`Remove ${item.name}`}
                        className="text-neutral-500 transition hover:text-black"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-neutral-600">
                      Size: {item.selectedSize}
                    </p>

                    <p className="mt-1 text-sm text-neutral-600">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-auto text-sm font-medium text-black">
                      {item.price * item.quantity} MAD
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-6">
              <div className="flex items-center justify-between text-black">
                <span className="uppercase tracking-[0.15em]">
                  Subtotal
                </span>

                <span className="font-medium">
                  {subtotal} MAD
                </span>
              </div>

              <Link
  href="/checkout"
  onClick={onClose}
  className="mt-6 block w-full bg-black px-6 py-4 text-center text-sm uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800"
>
  Checkout
</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}