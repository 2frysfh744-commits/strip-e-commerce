import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const allowedStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    allowedStatuses.includes(value as OrderStatus)
  );
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const isAuthenticated = await isAdminAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const orderId = Number(id);

    if (!Number.isSafeInteger(orderId) || orderId < 1) {
      return NextResponse.json(
        { error: "Invalid order number." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const { status } = body as { status?: unknown };

    if (!isOrderStatus(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("id, status")
      .maybeSingle();

    if (error) {
      console.error("Unable to update order status:", error);

      return NextResponse.json(
        { error: "Unable to update the order." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order status updated.",
      order: data,
    });
  } catch (error) {
    console.error("Order status route error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
