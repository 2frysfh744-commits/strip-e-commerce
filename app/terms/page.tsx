import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when browsing or ordering from the STRIP online store.",
};

const sections = [
  {
    title: "About these terms",
    paragraphs: [
      "These terms apply when you browse or place an order through the official STRIP online store. By submitting an order, you confirm that the information provided is accurate and that you are legally able to make the purchase.",
      "The legal business name, registration details, postal address, and final customer contact details will be added before the official commercial launch.",
    ],
  },
  {
    title: "Products",
    paragraphs: [
      "We aim to describe products, colors, sizes, materials, and images accurately. Screens and lighting can make colors appear slightly different, and handmade or production variations may occur where disclosed.",
      "Product availability is not guaranteed until the order is confirmed. STRIP may correct an obvious description or pricing error before confirmation and will inform you if this affects an order.",
    ],
  },
  {
    title: "Prices and delivery charges",
    paragraphs: [
      "Prices are shown in Moroccan dirhams (MAD). Applicable delivery charges are displayed in the order summary before submission. Unless clearly stated otherwise, promotional offers cannot be combined and may be limited by time or stock.",
    ],
  },
  {
    title: "Placing an order",
    paragraphs: [
      "Submitting the checkout form is a request to purchase. The on-screen order number confirms that we received the request; the order becomes accepted after STRIP verifies the details and confirms it for preparation or dispatch.",
      "We may refuse or cancel an order when an item is unavailable, customer information cannot be verified, delivery is unavailable, the price is clearly incorrect, or there is reasonable concern about fraud, abuse, or repeated refused deliveries.",
    ],
  },
  {
    title: "Payment",
    paragraphs: [
      "The current payment method is cash on delivery. The total shown at checkout is payable when the order arrives, unless STRIP agrees to another method with you in writing.",
      "Never share card passwords, one-time codes, or account credentials with a courier or anyone claiming to represent STRIP.",
    ],
  },
  {
    title: "Delivery",
    paragraphs: [
      "Delivery estimates are provided in good faith and may be affected by circumstances outside reasonable control. Customers are responsible for providing a complete address and remaining reachable during delivery.",
      "The detailed delivery fees, estimated timing, cancellation process, and coverage are set out on the Delivery & Returns page.",
    ],
  },
  {
    title: "Returns and refunds",
    paragraphs: [
      "Eligible returns may be requested within 7 calendar days after receipt, subject to the conditions on the Delivery & Returns page and rights provided by applicable law. Approved refunds are handled using an agreed method within the applicable period.",
    ],
  },
  {
    title: "Responsible website use",
    bullets: [
      "Do not attempt to access the admin area, other customers’ information, or restricted systems without authorization.",
      "Do not submit false, automated, abusive, or fraudulent orders.",
      "Do not interfere with website security, availability, or normal operation.",
      "Do not copy or commercially reuse STRIP branding, photography, designs, or website content without permission.",
    ],
  },
  {
    title: "Liability",
    paragraphs: [
      "STRIP is responsible for obligations that cannot legally be excluded. To the extent permitted by law, we are not responsible for indirect losses, failures caused by third-party networks or events outside reasonable control, or loss resulting from misuse of the website.",
      "Nothing in these terms limits mandatory consumer rights or liability that cannot be limited under applicable Moroccan law.",
    ],
  },
  {
    title: "Personal information",
    paragraphs: [
      "Personal information submitted through the store is handled as described in the Privacy Policy. Customers must provide accurate details and should not submit sensitive information that is not requested.",
    ],
  },
  {
    title: "Applicable law and disputes",
    paragraphs: [
      "These terms are governed by the laws of Morocco. If a concern arises, please contact STRIP first so we can try to resolve it fairly and promptly. If no amicable solution is reached, the matter may be referred to the competent Moroccan authorities or courts in accordance with applicable law.",
    ],
  },
  {
    title: "Changes to these terms",
    paragraphs: [
      "STRIP may update these terms to reflect changes in products, delivery, payments, services, or law. The version in effect when an order is placed will apply to that order unless a mandatory legal rule requires otherwise.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Store rules"
      title="Terms & conditions"
      intro="The practical terms that keep every STRIP order clear, fair, and easy to understand."
      sections={sections}
    />
  );
}
