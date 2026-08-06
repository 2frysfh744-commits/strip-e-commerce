import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-950">
      <Image
        src="/Hero.jpg"
        alt="STRIP new collection"
        fill
        priority
        className="motion-hero object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="motion-fade-up absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.5em] text-white/90">
          New Collection 2026
        </p>

        <h1 className="text-6xl font-medium tracking-[0.24em] md:text-8xl md:tracking-[0.3em]">
          STRIP
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/90">
          Timeless essentials designed for everyday confidence.
        </p>

        <div className="mt-10 flex gap-4 sm:gap-6">
          <Link
            href="/shop"
            className="bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition duration-300 ease-out hover:-translate-y-1 hover:bg-neutral-200 sm:px-8"
          >
            Shop Now
          </Link>

          <Link
            href="/new"
            className="border border-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:text-black sm:px-8"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
