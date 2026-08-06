"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

type OrderStatusSelectProps = {
  orderId: number;
  currentStatus: OrderStatus;
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] = useState("");

  async function updateStatus(
    newStatus: OrderStatus
  ) {
    const previousStatus = status;

    setStatus(newStatus);
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result: {
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to update the order."
        );
      }

      router.refresh();
    } catch (error) {
      setStatus(previousStatus);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update the order."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        disabled={isUpdating}
        onChange={(event) =>
          updateStatus(
            event.target.value as OrderStatus
          )
        }
        className="border border-neutral-400 bg-white px-4 py-2 text-sm font-medium text-neutral-900 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={`Change status for order ${orderId}`}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">
          Confirmed
        </option>
        <option value="shipped">Shipped</option>
        <option value="delivered">
          Delivered
        </option>
        <option value="cancelled">
          Cancelled
        </option>
      </select>

      {isUpdating && (
        <p className="mt-2 text-xs text-neutral-600">
          Updating...
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}