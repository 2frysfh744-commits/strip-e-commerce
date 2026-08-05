import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Men */}
      <Link
        href="/shop"
        className="group relative h-[70vh] overflow-hidden"
      >
        <Image
          src="/Hero.jpg"
          alt="Men Collection"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-5xl font-light tracking-[0.25em]">
            MEN
          </h2>

          <span className="mt-6 border-b border-white uppercase tracking-[0.2em]">
            Shop Now
          </span>
        </div>
      </Link>

      {/* Women */}
      <Link
        href="/shop"
        className="group relative h-[70vh] overflow-hidden"
      >
        <Image
          src="/Hero.jpg"
          alt="Women Collection"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-5xl font-light tracking-[0.25em]">
            WOMEN
          </h2>

          <span className="mt-6 border-b border-white uppercase tracking-[0.2em]">
            Shop Now
          </span>
        </div>
      </Link>
    </section>
  );
}