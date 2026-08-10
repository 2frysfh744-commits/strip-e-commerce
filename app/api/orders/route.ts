import { after, NextResponse } from "next/server";

import { getAuthenticatedCustomerId } from "@/lib/customerAuth";
import { sendNewOrderNotification } from "@/lib/orderNotification";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RequestedItem = {
  id: number;
  selectedSize: string;
  quantity: number;
};

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
};

type SavedOrderItem = {
  product_id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  selected_size: string;
  quantity: number;
  line_total: number;
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

function readStockError(error: { message: string; details?: string }) {
  if (error.message !== "OUT_OF_STOCK") {
    return null;
  }

  try {
    const details = JSON.parse(error.details ?? "{}") as {
      name?: unknown;
      size?: unknown;
    };

    return {
      name: typeof details.name === "string" ? details.name : "That item",
      size: typeof details.size === "string" ? details.size : "selected",
    };
  } catch {
    return { name: "That item", size: "selected" };
  }
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

    const requestedItems = order.items as RequestedItem[];
    const productIds = [...new Set(requestedItems.map((item) => item.id))];
    const { data: productData, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, price, image, sizes")
      .in("id", productIds)
      .eq("active", true);

    if (productError) {
      console.error("Unable to validate order products:", productError);
      return NextResponse.json(
        { error: "The product catalogue is temporarily unavailable." },
        { status: 503 }
      );
    }

    const productMap = new Map(
      ((productData ?? []) as ProductRow[]).map((product) => [
        product.id,
        product,
      ])
    );
    const savedItems: SavedOrderItem[] = [];
    let subtotal = 0;

    for (const requestedItem of requestedItems) {
      const product = productMap.get(requestedItem.id);

      if (!product) {
        return NextResponse.json(
          { error: "One of the selected products is no longer available." },
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
    const customerId = await getAuthenticatedCustomerId();

    const { data: orderId, error: orderError } = await supabaseAdmin.rpc(
      "create_order_with_inventory",
      {
        p_user_id: customerId,
        p_full_name: order.fullName.trim(),
        p_phone: order.phone.trim(),
        p_email: order.email.trim().toLowerCase(),
        p_city: order.city.trim(),
        p_postal_code: postalCode,
        p_address: order.address.trim(),
        p_delivery_instructions: deliveryInstructions,
        p_payment_method: "cash_on_delivery",
        p_items: savedItems,
        p_subtotal: subtotal,
        p_delivery_fee: deliveryFee,
        p_total: total,
      }
    );

    if (orderError) {
      const stockError = readStockError(orderError);

      if (stockError) {
        return NextResponse.json(
          {
            error: `${stockError.name} in size ${stockError.size} is sold out or no longer has enough stock. Please update your bag.`,
          },
          { status: 409 }
        );
      }

      console.error("Supabase inventory order error:", orderError);
      return NextResponse.json(
        { error: "The order could not be saved." },
        { status: 500 }
      );
    }

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

    const createdOrderId = Number(orderId);
    const notificationCustomer = {
      fullName: order.fullName.trim(),
      phone: order.phone.trim(),
      email: order.email.trim().toLowerCase(),
      city: order.city.trim(),
      address: order.address.trim(),
    };

    after(async () => {
      await sendNewOrderNotification({
        orderId: createdOrderId,
        fullName: notificationCustomer.fullName,
        phone: notificationCustomer.phone,
        email: notificationCustomer.email,
        city: notificationCustomer.city,
        postalCode,
        address: notificationCustomer.address,
        deliveryInstructions,
        items: savedItems.map((item) => ({
          name: item.name,
          size: item.selected_size,
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal: item.line_total,
        })),
        subtotal,
        deliveryFee,
        total,
      });
    });

    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: createdOrderId,
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
