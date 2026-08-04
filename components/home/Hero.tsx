export default function Hero() {
  return (
    <section
      className="relative h-[90vh] w-full bg-cover bg-center overflow-hidden"
     style={{
  backgroundImage: "url('/hero.jpg')",
  backgroundPosition: "50% 20%",
}}
    >
      {/* Dark overlay */}
    <section
  className="relative h-screen w-full bg-cover bg-center overflow-hidden"
  style={{
    backgroundImage: "url('/hero.jpg')",
    backgroundPosition: "50% 20%",
    animation: "zoomHero 18s ease-in-out infinite alternate",
  }}
></section>
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6 -mt-8">
        <p className="uppercase tracking-[0.5em] text-sm mb-6">
          New Collection 2026
        </p>

        <h1 className="text-6xl md:text-8xl font-light tracking-[0.25em] leading-none">
          STRIP
        </h1>

        <p className="mt-8 max-w-xl text-lg text-gray-200">
          Minimal. Timeless. Designed for everyday confidence.
        </p>

        <button
  className="mt-12 border border-white px-10 py-4 uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
>
  Shop Now
</button>
      </div>
    </section>
  );
}