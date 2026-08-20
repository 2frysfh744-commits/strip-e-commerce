import { notFound } from "next/navigation";

import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-24 sm:px-6 md:pb-20 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>
    </main>
  );
}
