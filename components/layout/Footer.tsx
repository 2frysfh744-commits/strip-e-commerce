import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import BrandLogo from "@/components/branding/BrandLogo";

function InstagramMark() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4v10.2a4.2 4.2 0 1 1-3.2-4.08" />
      <path d="M14 4c.7 2.4 2.2 3.9 4.5 4.5" />
    </svg>
  );
}

const shopLinks = [
  { label: "Shop all", href: "/shop" },
  { label: "New arrivals", href: "/new" },
  { label: "About STRIP", href: "/about" },
];

const careLinks = [
  { label: "Delivery & returns", href: "/delivery-returns" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms & conditions", href: "/terms" },
];

const contactItems = [
  {
    label: "Instagram",
    detail: "@stripstore.ma",
    href: "https://www.instagram.com/stripstore.ma/",
    icon: <InstagramMark />,
    external: true,
  },
  {
    label: "TikTok",
    detail: "@stripstore.ma",
    href: "https://www.tiktok.com/@stripstore.ma",
    icon: <TikTokMark />,
    external: true,
  },
  {
    label: "WhatsApp",
    detail: "07 86 76 71 57",
    href: "https://wa.me/212786767157",
    icon: <MessageCircle aria-hidden="true" size={18} strokeWidth={1.5} />,
    external: true,
  },
  {
    label: "Phone",
    detail: "07 86 76 71 57",
    href: "tel:+212786767157",
    icon: <Phone aria-hidden="true" size={18} strokeWidth={1.5} />,
    external: false,
  },
  {
    label: "Email",
    detail: "yourstripbrand@gmail.com",
    href: "mailto:yourstripbrand@gmail.com",
    icon: <Mail aria-hidden="true" size={18} strokeWidth={1.5} />,
    external: false,
    wide: true,
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-14 border-b border-white/20 pb-16 lg:grid-cols-[1.35fr_0.65fr_0.65fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="STRIP home"
              className="inline-block"
            >
              <BrandLogo
                tone="white"
                decorative
                className="h-7 w-44"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-400">
              Contemporary essentials built around confident movement,
              understated color, and everyday ease.
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.24em] text-neutral-500">
              Designed in Morocco · Delivery across Morocco
            </p>
          </div>

          <nav aria-label="Footer shop links">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Collection
            </h2>
            <ul className="mt-6 space-y-4 text-sm">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="transition hover:text-neutral-400"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer customer care links">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Customer care
            </h2>
            <ul className="mt-6 space-y-4 text-sm">
              {careLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="transition hover:text-neutral-400"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Connect
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {contactItems.map(
                ({ label, detail, href, icon, external, wide }) => (
                  <li key={label} className={wide ? "col-span-2" : ""}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      aria-label={`${label}: ${detail}`}
                      className="group flex min-h-28 h-full flex-col justify-between border border-white/20 p-4 text-neutral-300 transition duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white hover:text-neutral-950"
                    >
                      {icon}
                      <span className="mt-5">
                        <span className="block text-xs uppercase tracking-[0.16em]">
                          {label}
                        </span>
                        <span className="mt-1.5 block break-all text-[11px] leading-4 text-neutral-500 transition group-hover:text-neutral-600">
                          {detail}
                        </span>
                      </span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} STRIP. All rights reserved.</p>
          <p>Prices are displayed in Moroccan dirhams (MAD).</p>
        </div>
      </div>
    </footer>
  );
}
