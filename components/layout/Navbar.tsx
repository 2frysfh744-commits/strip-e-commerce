"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* Left */}
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-[0.2em]">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/new">New</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Logo */}
        <Link
          href="/"
          className="text-5xl md:text-6xl font-light tracking-[0.45em] absolute left-1/2 -translate-x-1/2"
        >
          STRIP
        </Link>

        {/* Right */}
        <div className="flex items-center gap-6">
          <Search size={20} />
          <User size={20} />
          <ShoppingBag size={20} />
        </div>

      </div>
    </header>
  );
}