"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

import CartDrawer from "@/components/ui/CartDrawer";
import { useCart } from "@/store/cart";

export default function Navbar() {
  const items = useCart((state) => state.items);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          {/* Left */}
          <nav className="hidden gap-8 text-sm font-medium uppercase tracking-[0.2em] text-black md:flex">
            <Link
              href="/"
              className="transition-colors duration-300 hover:text-gray-500"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="transition-colors duration-300 hover:text-gray-500"
            >
              Shop
            </Link>

            <Link
              href="/new"
              className="transition-colors duration-300 hover:text-gray-500"
            >
              New
            </Link>

            <Link
              href="/about"
              className="transition-colors duration-300 hover:text-gray-500"
            >
              About
            </Link>
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-5xl font-semibold tracking-[0.35em] text-black md:text-6xl"
          >
            STRIP
          </Link>

          {/* Right */}
          <div className="flex items-center gap-6 text-black">
            <Search
              size={20}
              className="cursor-pointer transition-colors duration-300 hover:text-gray-500"
            />

            <User
              size={20}
              className="cursor-pointer transition-colors duration-300 hover:text-gray-500"
            />

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag
                size={20}
                className="transition-colors duration-300 hover:text-gray-500"
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

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}