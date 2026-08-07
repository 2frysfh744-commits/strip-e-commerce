import { NextResponse } from "next/server";

import { products } from "@/data/products";
import { getAuthenticatedCustomerId } from "@/lib/customerAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RequestedItem = {
  id: number;
  selectedSize: string;
  quantity: number;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRequestedItem(value: unknown): value is RequestedItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    Number.isInteger(item.id) &&
    isNonEmptyString(item.selectedSize) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 10
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid order information." },
        { status: 400 }
      );
    }

    const order = body as Record<string, unknown>;

    if (
      !isNonEmptyString(order.fullName) ||
      !isNonEmptyString(order.phone) ||
      !isNonEmptyString(order.email) ||
      !isNonEmptyString(order.city) ||
      !isNonEmptyString(order.address)
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(order.items) ||
      order.items.length === 0 ||
      !order.items.every(isRequestedItem)
    ) {
      return NextResponse.json(
        { error: "Your cart is invalid or empty." },
        { status: 400 }
      );
    }

    const savedItems = [];
    let subtotal = 0;

    for (const requestedItem of order.items) {
      const product = products.find(
        (currentProduct) => currentProduct.id === requestedItem.id
      );

      if (!product) {
        return NextResponse.json(
          { error: "One of the selected products no longer exists." },
          { status: 400 }
        );
      }

      if (!product.sizes.includes(requestedItem.selectedSize)) {
        return NextResponse.json(
          { error: `Invalid size selected for ${product.name}.` },
          { status: 400 }
        );
      }

      const lineTotal = product.price * requestedItem.quantity;

      subtotal += lineTotal;

      savedItems.push({
        product_id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        selected_size: requestedItem.selectedSize,
        quantity: requestedItem.quantity,
        line_total: lineTotal,
      });
    }

    const deliveryFee = subtotal >= 500 ? 0 : 30;
    const total = subtotal + deliveryFee;

    const postalCode = isNonEmptyString(order.postalCode)
      ? order.postalCode.trim()
      : null;

    const deliveryInstructions = isNonEmptyString(order.deliveryInstructions)
      ? order.deliveryInstructions.trim()
      : null;

    // A valid signed-in session attaches the order to that customer. If there
    // is no session, checkout remains a normal guest checkout.
    const customerId = await getAuthenticatedCustomerId();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: customerId,
        full_name: order.fullName.trim(),
        phone: order.phone.trim(),
        email: order.email.trim().toLowerCase(),
        city: order.city.trim(),
        postal_code: postalCode,
        address: order.address.trim(),
        delivery_instructions: deliveryInstructions,
        payment_method: "cash_on_delivery",
        items: savedItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase order error:", error);

      return NextResponse.json(
        { error: "The order could not be saved." },
        { status: 500 }
      );
    }

    // Keep the signed-in customer's saved delivery details current after a
    // successful checkout. A profile update problem must never undo the order.
    if (customerId) {
      const { error: profileError } = await supabaseAdmin
        .from("customer_profiles")
        .upsert(
          {
            user_id: customerId,
            full_name: order.fullName.trim(),
            phone: order.phone.trim(),
            city: order.city.trim(),
            postal_code: postalCode,
            address: order.address.trim(),
            delivery_instructions: deliveryInstructions,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (profileError) {
        console.error(
          "Unable to refresh customer profile from checkout:",
          profileError
        );
      }
    }

    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order route error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
