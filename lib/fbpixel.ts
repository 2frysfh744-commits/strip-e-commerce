export type MetaPixelEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

export type MetaPixelParams = Record<
  string,
  string | number | string[] | number[]
>;

type MetaPixelOptions = {
  eventID?: string;
};

type FacebookPixel = (
  command: "track",
  eventName: MetaPixelEvent,
  params?: MetaPixelParams,
  options?: MetaPixelOptions
) => void;

declare global {
  interface Window {
    fbq?: FacebookPixel;
  }
}

const pixelReadyEvent = "meta-pixel-ready";

export function trackMetaEvent(
  eventName: MetaPixelEvent,
  params?: MetaPixelParams,
  options?: MetaPixelOptions
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return false;
  }

  window.fbq("track", eventName, params, options);
  return true;
}

export function trackMetaEventWhenReady(
  eventName: MetaPixelEvent,
  params?: MetaPixelParams,
  options?: MetaPixelOptions,
  onTracked?: () => void
) {
  if (trackMetaEvent(eventName, params, options)) {
    onTracked?.();
    return () => {};
  }

  if (typeof window === "undefined") {
    return () => {};
  }

  const trackWhenReady = () => {
    if (trackMetaEvent(eventName, params, options)) {
      window.removeEventListener(pixelReadyEvent, trackWhenReady);
      onTracked?.();
    }
  };

  window.addEventListener(pixelReadyEvent, trackWhenReady);

  return () => window.removeEventListener(pixelReadyEvent, trackWhenReady);
}

export { pixelReadyEvent };
