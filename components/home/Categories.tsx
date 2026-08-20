import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <Link
        href="/shop"
        className="group relative h-[58svh] min-h-[420px] touch-manipulation overflow-hidden bg-neutral-200 md:h-[70vh]"
      >
        <Image
          src="/products/model/black-half-zip-cargo.png"
          alt="Men wearing the STRIP collection"
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[1.025]"
        />

        <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl font-light tracking-[0.2em] sm:text-5xl sm:tracking-[0.25em]">
            MEN
          </h2>

          <span className="mt-5 border-b border-white pb-1 text-sm uppercase tracking-[0.2em] transition-transform duration-300 group-hover:translate-y-1 sm:mt-6">
            Shop Now
          </span>
        </div>
      </Link>

      <Link
        href="/shop"
        className="group relative h-[58svh] min-h-[420px] touch-manipulation overflow-hidden bg-neutral-200 md:h-[70vh]"
      >
        <Image
          src="/categories/women.jpg"
          alt="Women collection"
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[1.025]"
        />

        <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl font-light tracking-[0.2em] sm:text-5xl sm:tracking-[0.25em]">
            WOMEN
          </h2>

          <span className="mt-5 border-b border-white pb-1 text-sm uppercase tracking-[0.2em] transition-transform duration-300 group-hover:translate-y-1 sm:mt-6">
            Shop Now
          </span>
        </div>
      </Link>
    </section>
  );
}
