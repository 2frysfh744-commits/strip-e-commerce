import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How STRIP collects, uses, stores, and protects customer information.",
};

const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "When you place an order, STRIP collects the information needed to serve you: name, phone number, email address, city, postal code where provided, delivery address, delivery instructions, purchased items, sizes, quantities, and order history.",
      "If you create an account, we also process your name, email address, authentication identifier, and account activity. Passwords are handled securely by our authentication provider; STRIP does not receive or store your password in readable form.",
      "Our hosting and security providers may also process limited technical information such as IP address, browser type, device information, request logs, and timestamps to operate and protect the website.",
    ],
  },
  {
    title: "Why we use it",
    bullets: [
      "To create and secure your customer account and show your private order history.",
      "To validate, prepare, deliver, and support your order.",
      "To contact you about confirmation, delivery, exchanges, returns, or refunds.",
      "To maintain order and accounting records and resolve disputes.",
      "To prevent fraud, abuse, and security incidents.",
      "To improve store reliability without using your order details for unrelated purposes.",
    ],
  },
  {
    title: "Who receives it",
    paragraphs: [
      "Access is limited to STRIP personnel and service providers who need the information to perform their role. This may include our website host, database and authentication provider, courier or delivery partner, and technical support providers.",
      "We do not sell customer information. We may disclose information when required by law, to protect legal rights, or to investigate fraud or security threats.",
    ],
  },
  {
    title: "Storage and international providers",
    paragraphs: [
      "The store currently uses third-party hosting, database, and authentication infrastructure. Some information may therefore be hosted or processed outside Morocco, subject to the safeguards and formalities required by Moroccan law.",
      "STRIP will complete the applicable CNDP notification or authorization steps before the official commercial launch and will update this policy with the responsible business identity and reference details when available.",
    ],
  },
  {
    title: "How long we keep it",
    paragraphs: [
      "Customer and account information is kept only for as long as reasonably necessary to provide the account, complete orders, provide support, handle returns or disputes, meet accounting and legal obligations, and protect against fraud. When it is no longer required, it will be deleted or anonymized where reasonably possible.",
    ],
  },
  {
    title: "Your choices and rights",
    paragraphs: [
      "In accordance with applicable Moroccan data-protection rules, you may request access to or correction of personal information concerning you, and you may object to certain processing for legitimate reasons. You may also ask us to close your customer account, subject to records we must retain for legal or operational reasons.",
      "Send privacy requests to yourstripbrand@gmail.com. We may need to verify your identity before responding so that information is not disclosed to the wrong person.",
    ],
  },
  {
    title: "Cart storage and cookies",
    paragraphs: [
      "The website stores cart information in your browser so products remain in your bag while you shop. If you sign in, essential secure cookies keep you authenticated and protect access to your account. These technologies are necessary for the features you request.",
      "STRIP does not currently use advertising cookies. If analytics, advertising, or non-essential cookies are introduced, this policy and the consent experience will be updated before they are used where consent is required.",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We use reasonable technical and organizational measures to protect account and order data, including restricted administrative access, secure authentication, and encrypted website connections. No online system can be guaranteed completely secure, so customers should use a unique password and keep their credentials confidential.",
    ],
  },
  {
    title: "Children",
    paragraphs: [
      "The store is not intended to knowingly collect personal information from children without the involvement of a parent or legal guardian. If you believe a child submitted information improperly, contact us so it can be reviewed and removed where appropriate.",
    ],
  },
  {
    title: "Contact and updates",
    paragraphs: [
      "For privacy questions, email yourstripbrand@gmail.com. For general help, use the telephone, WhatsApp, Instagram, TikTok, or email links in the website footer. We may update this policy when services or legal requirements change; the date at the top will show the latest version.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Your information"
      title="Privacy policy"
      intro="We collect only the information needed to provide accounts, fulfill orders, support customers, and operate the store safely."
      sections={sections}
    />
  );
}
