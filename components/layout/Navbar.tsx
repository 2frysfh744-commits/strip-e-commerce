"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/store/cart";
import CartDrawer from "@/components/ui/CartDrawer";
import MobileMenu from "@/components/ui/MobileMenu";
import SearchOverlay from "@/components/ui/SearchOverlay";

export default function Navbar() {
  const items = useCart((state) => state.items);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function openSearchFromMenu() {
    setMobileMenuOpen(false);
    setSearchOpen(true);
  }

  function openCartFromMenu() {
    setMobileMenuOpen(false);
    setCartOpen(true);
  }

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-neutral-200 bg-white/95 text-neutral-950 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8 md:py-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.2em] md:flex">
            <Link href="/" className="transition hover:text-neutral-600">
              Home
            </Link>
            <Link href="/shop" className="transition hover:text-neutral-600">
              Shop
            </Link>
            <Link href="/new" className="transition hover:text-neutral-600">
              New
            </Link>
            <Link href="/about" className="transition hover:text-neutral-600">
              About
            </Link>
          </nav>

          <Link
            href="/"
            className="font-display absolute left-1/2 -translate-x-1/2 text-4xl font-semibold tracking-[0.24em] md:text-6xl md:tracking-[0.28em]"
          >
            STRIP
          </Link>

          <div className="ml-auto flex items-center gap-5 md:gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer transition hover:text-neutral-600"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
            <User
              size={20}
              className="hidden cursor-pointer transition hover:text-neutral-600 sm:block"
            />
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag
                size={20}
                className="transition hover:text-neutral-600"
              />
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={mobileMenuOpen}
        cartCount={items.length}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={openSearchFromMenu}
        onOpenCart={openCartFromMenu}
      />
    </>
  );
}
