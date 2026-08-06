import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <Link
        href="/shop"
        className="group relative h-[70vh] overflow-hidden bg-neutral-200"
      >
        <Image
          src="/products/model/black-half-zip-cargo.png"
          alt="Men wearing the STRIP collection"
          fill
          className="object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-5xl font-light tracking-[0.25em]">
            MEN
          </h2>

          <span className="mt-6 border-b border-white pb-1 uppercase tracking-[0.2em] transition-transform duration-300 group-hover:translate-y-1">
            Shop Now
          </span>
        </div>
      </Link>

      <Link
        href="/shop"
        className="group relative h-[70vh] overflow-hidden bg-neutral-200"
      >
        <Image
          src="/categories/women.jpg"
          alt="Women collection"
          fill
          className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-5xl font-light tracking-[0.25em]">
            WOMEN
          </h2>

          <span className="mt-6 border-b border-white pb-1 uppercase tracking-[0.2em] transition-transform duration-300 group-hover:translate-y-1">
            Shop Now
          </span>
        </div>
      </Link>
    </section>
  );
}
