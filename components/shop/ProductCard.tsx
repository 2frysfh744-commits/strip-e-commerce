import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";

type ProductCardProps = Product;

export default function ProductCard({
  slug,
  name,
  price,
  image,
}: ProductCardProps) {
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
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />
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
