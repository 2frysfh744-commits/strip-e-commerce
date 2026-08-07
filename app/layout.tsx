import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import CartHydration from "@/components/ui/CartHydration";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

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

export const metadata: Metadata = {
  title: {
    default: "STRIP",
    template: "%s | STRIP",
  },
  description:
    "Contemporary everyday essentials designed for confident movement.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartHydration />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
