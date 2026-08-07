"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import BrandLogo from "@/components/branding/BrandLogo";
import {
  getTotalStock,
  isRemoteProductImage,
  type Product,
} from "@/types/product";

type SearchOverlayProps = {
  products: Product[];
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({
  products,
  open,
  onClose,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products.filter((product) => product.newArrival).slice(0, 4);
    }

    return products.filter((product) =>
      [product.name, product.category, product.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [products, query]);

  function closeSearch() {
    setQuery("");
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="motion-fade-in fixed inset-0 z-[70] overflow-y-auto bg-[#f7f4ef]/98 text-neutral-950 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="mx-auto min-h-full max-w-6xl px-6 py-8 md:px-10 md:py-12">
        <div className="flex items-center justify-between">
          <BrandLogo className="h-7 w-44" />

          <button
            type="button"
            onClick={closeSearch}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-400 transition hover:border-black hover:bg-black hover:text-white"
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </div>

        <div className="motion-fade-up mx-auto mt-16 max-w-4xl md:mt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700">
            Find your piece
          </p>

          <div className="mt-5 flex items-center gap-4 border-b-2 border-neutral-950 pb-4">
            <Search size={26} strokeWidth={1.5} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search sweaters, jeans, T-shirts..."
              className="w-full bg-transparent font-display text-3xl font-medium outline-none placeholder:text-neutral-500 md:text-5xl"
            />
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-4">
              <h2 className="text-2xl font-semibold">
                {query.trim() ? "Search results" : "New arrivals"}
              </h2>
              <span className="text-sm font-medium text-neutral-700">
                {results.length} {results.length === 1 ? "item" : "items"}
              </span>
            </div>

            {results.length > 0 ? (
              <div className="divide-y divide-neutral-300">
                {results.map((product) => {
                  const soldOut = getTotalStock(product) === 0;
                  const remoteImage = isRemoteProductImage(product.image);

                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={closeSearch}
                      className="group grid grid-cols-[88px_1fr_auto] items-center gap-5 py-5 transition-transform duration-300 ease-out hover:translate-x-1 md:grid-cols-[112px_1fr_auto] md:gap-8"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-white">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          unoptimized={remoteImage}
                          className={`${
                            remoteImage ? "object-cover" : "object-contain p-2"
                          } transition duration-500 group-hover:scale-105`}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600">
                          {product.category}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold md:text-3xl">
                          {product.name}
                        </h3>
                        {soldOut ? (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-700">
                            Sold out
                          </p>
                        ) : null}
                      </div>

                      <p className="whitespace-nowrap text-sm font-semibold md:text-base">
                        {product.price} MAD
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <h3 className="text-3xl font-semibold">No pieces found</h3>
                <p className="mt-3 text-neutral-700">
                  Try another product name or category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
