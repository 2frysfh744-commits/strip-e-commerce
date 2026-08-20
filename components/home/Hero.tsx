import Image from "next/image";
import Link from "next/link";

import BrandLogo from "@/components/branding/BrandLogo";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-neutral-950 md:h-screen">
      <Image
        src="/Hero.jpg"
        alt="STRIP new collection"
        fill
        priority
        sizes="100vw"
        className="motion-hero object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="motion-fade-up absolute inset-0 flex flex-col items-center justify-center px-5 pt-14 text-center text-white md:px-6 md:pt-0">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-white/90 md:mb-6 md:text-sm md:tracking-[0.5em]">
          New Collection 2026
        </p>

        <h1 aria-label="STRIP">
          <BrandLogo
            tone="white"
            decorative
            priority
            className="h-10 w-56 sm:w-64 md:h-[4.5rem] md:w-[30rem]"
          />
        </h1>

        <p className="mt-6 max-w-xs text-sm leading-6 text-white/90 sm:max-w-md sm:text-base md:mt-8 md:max-w-xl md:text-lg md:leading-relaxed">
          Timeless essentials designed for everyday confidence.
        </p>

        <div className="mt-8 grid w-full max-w-xs grid-cols-2 gap-2 sm:max-w-sm sm:gap-4 md:mt-10 md:max-w-none md:flex md:w-auto md:gap-6">
          <Link
            href="/shop"
            className="flex min-h-12 items-center justify-center bg-white px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition duration-300 ease-out hover:-translate-y-1 hover:bg-neutral-200 sm:px-6 sm:text-sm sm:tracking-[0.2em] md:px-8"
          >
            Shop Now
          </Link>

          <Link
            href="/new"
            className="flex min-h-12 items-center justify-center border border-white px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:text-black sm:px-6 sm:text-sm sm:tracking-[0.2em] md:px-8"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
