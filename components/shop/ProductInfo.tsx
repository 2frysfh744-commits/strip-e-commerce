"use client";

import { useCart } from "@/store/cart";
import { useState } from "react";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductInfo({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCart((state) => state.addItem);

  return (
    <div className="flex flex-col justify-center">

      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
        {product.category}
      </p>

     <h1 className="mt-4 text-4xl md:text-5xl font-light uppercase tracking-[0.12em] text-black">
        {product.name}
      </h1>

      <p className="mt-6 text-2xl font-medium text-black">
        {product.price} MAD
      </p>

      <p className="mt-8 text-neutral-600 leading-8">
        {product.description}
      </p>

      {/* Sizes */}
      <div className="mt-10">
        <p className="mb-4 uppercase tracking-[0.2em] text-sm">
          Size
        </p>

        <div className="flex gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-12 w-12 border transition ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-10">
        <p className="mb-4 uppercase tracking-[0.2em] text-sm text-black">
  Quantity
</p>

        <div className="flex w-fit items-center border">

          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-12 w-12 text-xl text-black hover:bg-gray-100 transition"
          >
            −
          </button>

          <span className="w-12 text-center text-black font-medium">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-12 w-12 text-xl hover:bg-gray-100"
          >
            +
          </button>

        </div>
      </div>

      <button
  onClick={() => addItem(product, selectedSize, quantity)}
  className="mt-12 bg-black text-white py-4 uppercase tracking-[0.25em] hover:bg-neutral-800 transition"
>
  Add To Cart
</button>
    </div>
  );
}