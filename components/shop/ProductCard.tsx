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
    <Link href={`/shop/${slug}`} className="group block cursor-pointer">

      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="mt-5">
        <h3 className="uppercase tracking-[0.12em] text-sm">
          {name}
        </h3>

        <p className="mt-2 text-neutral-500 text-sm">
          {price} MAD
        </p>
      </div>

    </Link>
  );
}