"use client";

import { useEffect } from "react";

import { trackMetaEvent, pixelReadyEvent } from "@/lib/fbpixel";

type MetaPixelPurchaseProps = {
  orderId: number;
  total: number;
  contentIds: string[];
};

export default function MetaPixelPurchase({
  orderId,
  total,
  contentIds,
}: MetaPixelPurchaseProps) {
  useEffect(() => {
    const storageKey = `meta-pixel-purchase-${orderId}`;
    let active = true;

    const tryTrackPurchase = () => {
      if (!active) {
        return true;
      }

      try {
        if (window.localStorage.getItem(storageKey)) {
          active = false;
          return true;
        }

        const eventId = crypto.randomUUID();
        window.localStorage.setItem(storageKey, eventId);

        if (
          !trackMetaEvent(
            "Purchase",
            {
              value: total,
              currency: "MAD",
              content_ids: contentIds,
              content_type: "product",
            },
            { eventID: eventId }
          )
        ) {
          window.localStorage.removeItem(storageKey);
          return false;
        }

        active = false;
        return true;
      } catch (error) {
        console.error("Unable to record the Meta Pixel purchase event:", error);
        active = false;
        return true;
      }
    };

    const handlePixelReady = () => {
      if (tryTrackPurchase()) {
        window.removeEventListener(pixelReadyEvent, handlePixelReady);
      }
    };

    if (!tryTrackPurchase()) {
      window.addEventListener(pixelReadyEvent, handlePixelReady);
    }

    return () => {
      active = false;
      window.removeEventListener(pixelReadyEvent, handlePixelReady);
    };
  }, [contentIds, orderId, total]);

  return null;
}
