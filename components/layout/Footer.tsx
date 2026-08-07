import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

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
  { label: "Instagram", icon: <InstagramMark /> },
  { label: "Phone", icon: <Phone aria-hidden="true" size={18} strokeWidth={1.5} /> },
  { label: "WhatsApp", icon: <MessageCircle aria-hidden="true" size={18} strokeWidth={1.5} /> },
  { label: "Email", icon: <Mail aria-hidden="true" size={18} strokeWidth={1.5} /> },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-14 border-b border-white/20 pb-16 lg:grid-cols-[1.35fr_0.65fr_0.65fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-block text-4xl font-semibold tracking-[0.32em]"
            >
              STRIP
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
                  <Link className="transition hover:text-neutral-400" href={link.href}>
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
                  <Link className="transition hover:text-neutral-400" href={link.href}>
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
              {contactItems.map(({ label, icon }) => (
                <li
                  key={label}
                  aria-label={`${label} details coming soon`}
                  className="flex min-h-24 flex-col justify-between border border-white/20 p-4 text-neutral-300"
                >
                  {icon}
                  <span className="mt-4 text-xs uppercase tracking-[0.16em]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-neutral-500">
              Contact details coming soon.
            </p>
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
