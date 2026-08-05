import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/Hero.jpg"
        alt="STRIP Hero"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <p className="uppercase tracking-[0.5em] text-sm mb-6">
          New Collection 2026
        </p>

        <h1 className="text-6xl md:text-8xl font-light tracking-[0.3em]">
          STRIP
        </h1>

        <p className="mt-8 max-w-xl text-lg text-gray-200 leading-relaxed">
          Timeless essentials designed for everyday confidence.
        </p>

        <div className="mt-10 flex gap-6">
          <Link
            href="/shop"
            className="bg-white text-black px-8 py-3 uppercase tracking-[0.2em] text-sm hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>

          <Link
            href="/shop"
            className="border border-white px-8 py-3 uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}