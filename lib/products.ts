import "server-only";

import { cache } from "react";

import { products as staticProducts } from "@/data/products";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Product } from "@/types/product";

type InventoryRow = {
  size: string;
  quantity: number;
};

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  featured: boolean;
  new_arrival: boolean;
  active: boolean;
  product_inventory: InventoryRow[] | null;
};

const productSelection = `
  id,
  slug,
  name,
  price,
  description,
  image,
  images,
  category,
  sizes,
  featured,
  new_arrival,
  active,
  product_inventory (
    size,
    quantity
  )
`;

function mapProduct(row: ProductRow): Product {
  const inventory = Object.fromEntries(
    (row.product_inventory ?? []).map((stock) => [
      stock.size,
      stock.quantity,
    ])
  );

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    description: row.description,
    image: row.image,
    images: row.images,
    category: row.category,
    sizes: row.sizes,
    featured: row.featured,
    newArrival: row.new_arrival,
    active: row.active,
    inventory,
  };
}

function getStaticFallbackProducts(): Product[] {
  return staticProducts.map((product) => ({
    ...product,
    active: true,
    inventory: Object.fromEntries(product.sizes.map((size) => [size, 10])),
  }));
}

export const getStoreProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(productSelection)
    .eq("active", true)
    .order("id", { ascending: true });

  if (error) {
    const logDatabaseFallback =
      process.env.NODE_ENV === "production" ? console.error : console.warn;

    logDatabaseFallback(
      "Unable to load database products; using fallback:",
      error
    );
    return getStaticFallbackProducts();
  }

  return ((data ?? []) as ProductRow[]).map(mapProduct);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const products = await getStoreProducts();
    return products.find((product) => product.slug === slug);
  }
);

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(productSelection)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Unable to load product management: ${error.message}`);
  }

  return ((data ?? []) as ProductRow[]).map(mapProduct);
}
