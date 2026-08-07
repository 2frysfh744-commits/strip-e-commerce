import type { Metadata } from "next";
import { Cormorant_Garamond, Dorsa, Manrope } from "next/font/google";

import CartHydration from "@/components/ui/CartHydration";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getStoreProducts } from "@/lib/products";

import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const lookbookFont = Dorsa({
  variable: "--font-lookbook",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "STRIP",
    template: "%s | STRIP",
  },
  description:
    "Contemporary everyday essentials designed for confident movement.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await getStoreProducts();

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${lookbookFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartHydration />
        <Navbar products={products} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
