import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
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

    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid stock data." }, { status: 400 });
    }

    const inventory = (body as { inventory?: unknown }).inventory;

    if (typeof inventory !== "object" || inventory === null) {
      return NextResponse.json({ error: "Invalid stock data." }, { status: 400 });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("sizes")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Unable to load product sizes:", productError);
      return NextResponse.json(
        { error: "The product stock could not be loaded." },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const sizes = product.sizes as string[];
    const stockRecord = inventory as Record<string, unknown>;
    const rows = [];

    for (const size of sizes) {
      const quantity = Number(stockRecord[size]);

      if (
        !Number.isSafeInteger(quantity) ||
        quantity < 0 ||
        quantity > 1_000_000
      ) {
        return NextResponse.json(
          { error: `Enter a valid stock quantity for size ${size}.` },
          { status: 400 }
        );
      }

      rows.push({
        product_id: productId,
        size,
        quantity,
        updated_at: new Date().toISOString(),
      });
    }

    const { error } = await supabaseAdmin
      .from("product_inventory")
      .upsert(rows, { onConflict: "product_id,size" });

    if (error) {
      console.error("Unable to save product stock:", error);
      return NextResponse.json(
        { error: "The stock quantities could not be saved." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Stock quantities saved." });
  } catch (error) {
    console.error("Stock update route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating stock." },
      { status: 500 }
    );
  }
}
