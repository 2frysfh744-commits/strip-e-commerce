import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  createUniqueProductSlug,
  parseProductInput,
  syncInventorySizes,
} from "@/lib/productAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const parsed = parseProductInput(await request.json());

    if (!parsed.product) {
      return NextResponse.json(
        { error: parsed.error ?? "Invalid product information." },
        { status: 400 }
      );
    }

    const product = parsed.product;
    const slug = await createUniqueProductSlug(product.name);
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        slug,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.images[0],
        images: product.images,
        category: product.category,
        sizes: product.sizes,
        featured: product.featured,
        new_arrival: product.newArrival,
        active: product.active,
        updated_at: new Date().toISOString(),
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("Unable to create product:", error);
      return NextResponse.json(
        { error: "The product could not be created." },
        { status: 500 }
      );
    }

    try {
      await syncInventorySizes(Number(data.id), product.sizes);
    } catch (inventoryError) {
      await supabaseAdmin.from("products").delete().eq("id", data.id);
      throw inventoryError;
    }

    return NextResponse.json(
      {
        message: "Product created. Add its stock quantities next.",
        product: { id: Number(data.id), slug: data.slug },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating the product." },
      { status: 500 }
    );
  }
}
