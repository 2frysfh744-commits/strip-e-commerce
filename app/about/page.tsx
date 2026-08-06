import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About",
};

const values = [
  {
    number: "01",
    title: "Easy silhouettes",
    text: "Relaxed shapes designed to move naturally and style without effort.",
  },
  {
    number: "02",
    title: "Everyday confidence",
    text: "A focused wardrobe of pieces that feel considered, never complicated.",
  },
  {
    number: "03",
    title: "Quiet expression",
    text: "Neutral tones and clean details that leave room for personal style.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white pt-24 text-neutral-950">
      <section className="grid min-h-[82vh] lg:grid-cols-2">
        <div className="flex items-center bg-[#eee9e1] px-8 py-20 md:px-16 lg:px-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-700">
              About STRIP
            </p>

            <h1 className="mt-6 text-6xl font-medium leading-[0.9] tracking-[0.02em] md:text-8xl">
              Made for everyday movement.
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-neutral-800">
              STRIP is a contemporary clothing label built around relaxed
              silhouettes, understated color, and the confidence of getting
              dressed without overthinking it.
            </p>

            <Link
              href="/shop"
              className="mt-10 inline-block border-b border-neutral-950 pb-1 text-sm font-semibold uppercase tracking-[0.22em]"
            >
              Explore the collection
            </Link>
          </div>
        </div>

        <div className="relative min-h-[68vh] lg:min-h-full">
          <Image
            src="/products/model/black-half-zip-cargo.png"
            alt="STRIP relaxed everyday styling"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 border-t border-neutral-300 pt-12 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.number}>
              <p className="text-xs font-semibold tracking-[0.25em] text-neutral-600">
                {value.number}
              </p>
              <h2 className="mt-5 text-3xl font-semibold">
                {value.title}
              </h2>
              <p className="mt-4 leading-7 text-neutral-700">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
