import Image from "next/image";
import { notFound } from "next/navigation";
import ProductInfo from "@/components/shop/ProductInfo";
import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-32">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16">

        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-contain p-8 md:p-12"
          />
        </div>

        <ProductInfo product={product} />

      </div>
    </main>
  );
}