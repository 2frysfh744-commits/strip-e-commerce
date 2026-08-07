import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Delivery & Returns",
  description:
    "STRIP delivery, exchange, return, and refund information for customers in Morocco.",
};

const sections = [
  {
    title: "Where we deliver",
    paragraphs: [
      "STRIP currently delivers within Morocco only. Orders must include a complete Moroccan delivery address and a reachable Moroccan phone number.",
      "Some remote locations may require additional delivery time or may not be served by every carrier. If we cannot deliver to the address provided, we will contact you before dispatch.",
    ],
  },
  {
    title: "Timing and confirmation",
    paragraphs: [
      "Our normal delivery estimate is 2–5 business days after the order is confirmed. Weekends, public holidays, high-demand periods, weather, and remote destinations may cause delays.",
      "We may contact you by phone, WhatsApp, or email to confirm the order and address. An order that cannot be confirmed may be placed on hold or cancelled.",
    ],
  },
  {
    title: "Delivery fees",
    bullets: [
      "30 MAD for orders below 500 MAD.",
      "Free standard delivery for orders of 500 MAD or more.",
      "The final delivery fee is shown in the order summary before the order is placed.",
    ],
  },
  {
    title: "Payment and receipt",
    paragraphs: [
      "Payment is currently collected in cash when the order arrives. Please prepare the exact amount where possible and inspect the external condition of the parcel when it is delivered.",
      "If the parcel arrives visibly damaged, note this with the courier where possible and contact STRIP promptly.",
    ],
  },
  {
    title: "Changes and cancellations",
    paragraphs: [
      "Contact us as soon as possible if you need to change the size, address, or phone number, or cancel an order. We will try to help before dispatch, but changes cannot be guaranteed once the parcel has been handed to the courier.",
    ],
  },
  {
    title: "Seven-day return window",
    paragraphs: [
      "You may request an eligible return within 7 calendar days from the date you receive the order. Contact STRIP before sending anything back so we can provide return instructions.",
    ],
    bullets: [
      "Items must be unworn, unused, unwashed, clean, and free from odors or damage.",
      "Original tags and packaging must be present where supplied.",
      "Proof of purchase or the STRIP order number is required.",
    ],
  },
  {
    title: "Exchanges",
    paragraphs: [
      "Size exchanges are subject to availability. If the requested replacement is unavailable, you may choose another available item or request a refund where applicable.",
      "For a change of mind or size, return delivery costs are normally paid by the customer. Any price difference for an exchanged product must be settled before the replacement is dispatched.",
    ],
  },
  {
    title: "Incorrect or defective items",
    paragraphs: [
      "If STRIP sends the wrong item, or an item arrives defective, contact us within 48 hours of delivery with the order number and clear photos. After verification, STRIP will arrange the return and cover the reasonable return or replacement delivery cost.",
      "Normal wear, accidental damage, misuse, incorrect washing, or damage occurring after delivery is not considered a manufacturing defect.",
    ],
  },
  {
    title: "Refunds",
    paragraphs: [
      "Once an eligible return is received and inspected, we will confirm whether it is accepted. Approved refunds will be issued using an agreed method as soon as possible and no later than 15 days after the valid withdrawal request, subject to applicable law.",
      "Because current orders are paid in cash, we may request secure payment details only when needed to complete a refund. Never send card passwords or one-time security codes.",
    ],
  },
  {
    title: "How to contact us",
    paragraphs: [
      "For order help, contact STRIP on WhatsApp or by telephone at 07 86 76 71 57, email yourstripbrand@gmail.com, or message @stripstore.ma on Instagram or TikTok. Include your order number and the phone number used at checkout.",
    ],
  },
];

export default function DeliveryReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Customer care"
      title="Delivery & returns"
      intro="Clear expectations from checkout to delivery, with a straightforward process if something is not right."
      sections={sections}
    />
  );
}
