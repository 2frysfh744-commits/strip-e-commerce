"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import BrandLogo from "@/components/branding/BrandLogo";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/new", label: "New arrivals" },
  { href: "/about", label: "About" },
  { href: "/account", label: "My account" },
];

type MobileMenuProps = {
  open: boolean;
  cartCount: number;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
};

export default function MobileMenu({
  open,
  cartCount,
  onClose,
  onOpenSearch,
  onOpenCart,
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="motion-fade-in fixed inset-0 z-[60] flex flex-col bg-[#171717] text-white md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
        <Link
          href="/"
          onClick={onClose}
          aria-label="STRIP home"
        >
          <BrandLogo
            tone="white"
            decorative
            className="h-6 w-36"
          />
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 transition hover:bg-white hover:text-black"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center overflow-y-auto px-5 py-5">
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="motion-menu-item group flex min-h-16 items-center justify-between border-b border-white/20 py-2"
            style={{ animationDelay: `${100 + index * 70}ms` }}
          >
            <span className="font-display text-3xl font-medium transition group-hover:translate-x-2 sm:text-5xl">
              {link.label}
            </span>
            <span className="text-xs tracking-[0.2em] text-white/60">
              0{index + 1}
            </span>
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 border-t border-white/20 pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex min-h-16 items-center justify-center gap-3 border-r border-white/20 px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] active:bg-white active:text-black"
        >
          <Search size={18} />
          Search
        </button>

        <button
          type="button"
          onClick={onOpenCart}
          className="flex min-h-16 items-center justify-center gap-3 px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] active:bg-white active:text-black"
        >
          <ShoppingBag size={18} />
          Bag ({cartCount})
        </button>
      </div>
    </div>
  );
}
