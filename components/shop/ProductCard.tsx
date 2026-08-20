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
      className="group block touch-manipulation cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:scale-[0.985]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Image
          src={image}
          alt={name}
          fill
          unoptimized={remoteImage}
          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 31vw, 23vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-active:scale-[1.025]"
        />
        {soldOut ? (
          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-950 sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.16em]">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="mt-3 sm:mt-5">
        <h3 className="text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] sm:text-sm sm:leading-normal sm:tracking-[0.1em]">
          {name}
        </h3>
        <p className="mt-1.5 text-xs font-medium text-neutral-700 sm:mt-2 sm:text-sm">
          {price} MAD
        </p>
      </div>
    </Link>
  );
}
