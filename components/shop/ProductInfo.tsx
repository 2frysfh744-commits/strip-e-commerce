"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/store/cart";
import {
  getAvailableStock,
  getTotalStock,
  type Product,
} from "@/types/product";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const availableSizes = useMemo(
    () => product.sizes.filter((size) => getAvailableStock(product, size) > 0),
    [product]
  );
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);
  const totalStock = getTotalStock(product);
  const selectedStock = selectedSize
    ? getAvailableStock(product, selectedSize)
    : 0;
  const maximumQuantity = Math.min(10, selectedStock);

  return (
    <div className="flex flex-col justify-center">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
        {product.category}
      </p>

      <h1 className="mt-3 text-3xl font-light uppercase leading-tight tracking-[0.1em] text-black sm:text-4xl md:mt-4 md:text-5xl md:tracking-[0.12em]">
        {product.name}
      </h1>

      <p className="mt-4 text-xl font-medium text-black sm:text-2xl md:mt-6">
        {product.price} MAD
      </p>

      <p className="mt-5 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8 md:mt-8">
        {product.description}
      </p>

      <div className="mt-8 md:mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.2em]">Size</p>
          {selectedStock > 0 && selectedStock <= 3 ? (
            <p className="text-xs font-medium text-amber-700">
              Only {selectedStock} left
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => {
            const stock = getAvailableStock(product, size);
            const soldOut = stock === 0;

            return (
              <button
                key={size}
                type="button"
                disabled={soldOut}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity((current) =>
                    Math.max(1, Math.min(current, Math.min(10, stock)))
                  );
                }}
                aria-label={`${size}${soldOut ? ", sold out" : ""}`}
                className={`relative h-12 min-w-12 touch-manipulation border px-3 text-sm transition active:scale-95 ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : soldOut
                      ? "cursor-not-allowed border-neutral-200 text-neutral-300 line-through"
                      : "border-gray-300 hover:border-black"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {totalStock > 0 ? (
        <div className="mt-8 md:mt-10">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-black">
            Quantity
          </p>

          <div className="flex w-fit items-center border">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-12 w-12 text-xl text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="w-12 text-center font-medium text-black">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(Math.min(maximumQuantity, quantity + 1))}
              disabled={quantity >= maximumQuantity}
              className="h-12 w-12 text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-10 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          This product is currently sold out.
        </p>
      )}

      <button
        type="button"
        disabled={!selectedSize || selectedStock === 0}
        onClick={() => addItem(product, selectedSize, quantity)}
        className="mt-9 min-h-14 touch-manipulation bg-black px-4 py-4 text-sm uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-300 md:mt-12 md:tracking-[0.25em]"
      >
        {totalStock === 0 ? "Sold Out" : "Add To Cart"}
      </button>
    </div>
  );
}
