import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type ProductInput = {
  name: string;
  price: number;
  description: string;
  category: string;
  sizes: string[];
  images: string[];
  featured: boolean;
  newArrival: boolean;
  active: boolean;
};

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSizes(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map((size) => readText(size).toUpperCase())
        .filter((size) => size.length > 0)
    ),
  ];
}

function normalizeImages(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map(readText)
        .filter(
          (image) =>
            image.startsWith("/") ||
            image.startsWith("https://") ||
            image.startsWith("http://")
        )
    ),
  ];
}

export function parseProductInput(
  body: unknown
): { product?: ProductInput; error?: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid product information." };
  }

  const input = body as Record<string, unknown>;
  const name = readText(input.name);
  const description = readText(input.description);
  const category = readText(input.category);
  const price = Number(input.price);
  const sizes = normalizeSizes(input.sizes);
  const images = normalizeImages(input.images);

  if (name.length < 2 || name.length > 100) {
    return { error: "Enter a product name between 2 and 100 characters." };
  }

  if (!Number.isSafeInteger(price) || price < 1 || price > 10_000_000) {
    return { error: "Enter a valid price in MAD using whole numbers." };
  }

  if (description.length < 5 || description.length > 1000) {
    return { error: "Enter a product description between 5 and 1000 characters." };
  }

  if (category.length < 2 || category.length > 60) {
    return { error: "Enter a product category." };
  }

  if (
    sizes.length < 1 ||
    sizes.length > 12 ||
    sizes.some((size) => size.length > 20)
  ) {
    return { error: "Add between 1 and 12 valid sizes." };
  }

  if (images.length < 1 || images.length > 8) {
    return { error: "Add between 1 and 8 product photos." };
  }

  return {
    product: {
      name,
      price,
      description,
      category,
      sizes,
      images,
      featured: input.featured === true,
      newArrival: input.newArrival === true,
      active: input.active !== false,
    },
  };
}

function slugify(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

export async function createUniqueProductSlug(name: string) {
  const baseSlug = slugify(name);

  for (let suffix = 1; suffix <= 1000; suffix += 1) {
    const candidate = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(`Unable to create product URL: ${error.message}`);
    }

    if (!data) {
      return candidate;
    }
  }

  throw new Error("Unable to create a unique product URL.");
}

export async function syncInventorySizes(productId: number, sizes: string[]) {
  const { data: existingData, error: existingError } = await supabaseAdmin
    .from("product_inventory")
    .select("size")
    .eq("product_id", productId);

  if (existingError) {
    throw new Error(`Unable to read product stock: ${existingError.message}`);
  }

  const currentSizes = (existingData ?? []).map((row) => String(row.size));
  const removedSizes = currentSizes.filter((size) => !sizes.includes(size));

  if (removedSizes.length > 0) {
    const { error: removeError } = await supabaseAdmin
      .from("product_inventory")
      .delete()
      .eq("product_id", productId)
      .in("size", removedSizes);

    if (removeError) {
      throw new Error(`Unable to remove old sizes: ${removeError.message}`);
    }
  }

  const { error: upsertError } = await supabaseAdmin
    .from("product_inventory")
    .upsert(
      sizes.map((size) => ({
        product_id: productId,
        size,
        quantity: 0,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "product_id,size", ignoreDuplicates: true }
    );

  if (upsertError) {
    throw new Error(`Unable to add product sizes: ${upsertError.message}`);
  }
}
