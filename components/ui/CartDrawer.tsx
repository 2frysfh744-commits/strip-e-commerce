"use client";

import { Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/store/cart";
import { isRemoteProductImage } from "@/types/product";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
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
          className="motion-fade-in fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
          aria-label="Close shopping bag"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-black">
            Shopping Bag
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="text-black transition duration-300 hover:rotate-90 hover:text-neutral-600"
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <p className="text-neutral-700">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="motion-fade-up flex gap-4 border-b border-neutral-200 pb-6"
                >
                  <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized={isRemoteProductImage(item.image)}
                      className="object-contain p-2 transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-black">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        aria-label={`Remove ${item.name}`}
                        className="text-neutral-600 transition duration-300 hover:scale-110 hover:text-black"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-neutral-700">
                      Size: {item.selectedSize}
                    </p>
                    <p className="mt-1 text-sm text-neutral-700">
                      Quantity: {item.quantity}
                    </p>
                    <p className="mt-auto text-sm font-semibold text-black">
                      {item.price * item.quantity} MAD
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-6">
              <div className="flex items-center justify-between text-black">
                <span className="font-semibold uppercase tracking-[0.15em]">
                  Subtotal
                </span>
                <span className="font-semibold">{subtotal} MAD</span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="mt-6 block w-full bg-black px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:-translate-y-1 hover:bg-neutral-800"
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
