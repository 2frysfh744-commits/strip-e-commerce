import Image from "next/image";
import Link from "next/link";

import {
  getTotalStock,
  isRemoteProductImage,
  type Product,
} from "@/types/product";

type ProductCardProps = Product;

export default function ProductCard(product: ProductCardProps) {
  const { slug, name, price, image } = product;
  const soldOut = getTotalStock(product) === 0;
  const remoteImage = isRemoteProductImage(image);

  return (
    <Link
      href={`/shop/${slug}`}
      className="group block cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Image
          src={image}
          alt={name}
          fill
          unoptimized={remoteImage}
          className={`${
            remoteImage ? "object-cover" : "object-cover"
          } transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]`}
        />
        {soldOut ? (
          <span className="absolute left-3 top-3 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">
          {name}
        </h3>
        <p className="mt-2 text-sm font-medium text-neutral-700">
          {price} MAD
        </p>
      </div>
    </Link>
  );
}
