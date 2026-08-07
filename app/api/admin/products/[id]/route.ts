import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { parseProductInput, syncInventorySizes } from "@/lib/productAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId < 1) {
      return NextResponse.json(
        { error: "Invalid product number." },
        { status: 400 }
      );
    }

    const parsed = parseProductInput(await request.json());

    if (!parsed.product) {
      return NextResponse.json(
        { error: parsed.error ?? "Invalid product information." },
        { status: 400 }
      );
    }

    const product = parsed.product;
    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
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
      .eq("id", productId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Unable to update product:", error);
      return NextResponse.json(
        { error: "The product could not be updated." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await syncInventorySizes(productId, product.sizes);

    return NextResponse.json({
      message: "Product details updated.",
      product: { id: productId },
    });
  } catch (error) {
    console.error("Product update route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the product." },
      { status: 500 }
    );
  }
}
