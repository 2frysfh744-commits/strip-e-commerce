import Image from "next/image";

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({
  name,
  price,
  image,
}: ProductCardProps) {
  return (
  <div className="group cursor-pointer">
      <div className="relative overflow-hidden bg-[transition-all duration-500] aspect-[3/4]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <h3 className="text-sm tracking-wide uppercase">
          {name}
        </h3>

        <span className="text-sm text-gray-600">
          ${price}
        </span>
      </div>
    </div>
  );
}