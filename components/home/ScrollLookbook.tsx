"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const looks = [
  {
    image: "/home/black-half-zip-seated.png",
    eyebrow: "The half-zip",
    title: "Structure without stiffness.",
    description: "A clean layer built for movement, contrast, and effortless repetition.",
    position: "object-center",
  },
  {
    image: "/home/grey-half-zip-seated.jpg",
    eyebrow: "Wide lines",
    title: "Denim that moves with you.",
    description: "Relaxed proportions create a confident silhouette from every angle.",
    position: "object-center",
  },
  {
    image: "/categories/women.jpg",
    eyebrow: "Quiet expression",
    title: "Presence in every step.",
    description: "A restrained palette lets shape, attitude, and personal style lead.",
    position: "object-center",
  },
  {
    image: "/products/model/brown-half-zip-light-jeans.jpg",
    eyebrow: "Earth tones",
    title: "Soft color. Strong form.",
    description: "Warm neutrals meet light denim for an effortless everyday uniform.",
    position: "object-top",
  },
  {
    image: "/home/black-half-zip-motion.jpg",
    eyebrow: "The essentials",
    title: "Nothing extra. Everything considered.",
    description: "Simple pieces with enough character to stand alone and wear on repeat.",
    position: "object-center",
  },
];

export default function ScrollLookbook() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextIndex = Number(
          (visibleEntry.target as HTMLElement).dataset.lookIndex
        );

        setActiveIndex(nextIndex);
      },
      {
        threshold: [0.35, 0.55, 0.75],
        rootMargin: "-15% 0px -15% 0px",
      }
    );

    const steps = stepRefs.current;

    steps.forEach((step) => {
      if (step) {
        observer.observe(step);
      }
    });

    return () => {
      steps.forEach((step) => {
        if (step) {
          observer.unobserve(step);
        }
      });
      observer.disconnect();
    };
  }, []);

  const activeLook = looks[activeIndex];
  const progress = ((activeIndex + 1) / looks.length) * 100;

  return (
    <section
      className="relative h-[500vh] bg-neutral-950 text-white"
      aria-label="STRIP collection lookbook"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {looks.map((look, index) => (
          <div
            key={look.image}
            className={`absolute inset-0 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activeIndex === index
                ? "scale-100 opacity-100"
                : "scale-[1.035] opacity-0"
            }`}
            aria-hidden={activeIndex !== index}
          >
            <Image
              src={look.image}
              alt={activeIndex === index ? look.eyebrow : ""}
              fill
              sizes="100vw"
              className={`object-cover ${look.position}`}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />

        <div className="absolute left-6 right-6 top-28 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80 md:left-12 md:right-12">
          <span>STRIP / Lookbook 2026</span>
          <span>Scroll to explore</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-12 md:pb-20">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-8">
            <div key={activeIndex} className="motion-fade-up max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/80">
                {String(activeIndex + 1).padStart(2, "0")} / {activeLook.eyebrow}
              </p>

              <h2
                className="mt-5 max-w-xl text-[5.5rem] font-normal leading-[0.82] tracking-[0.015em] sm:text-[6.5rem] md:text-[8rem] lg:text-[10rem]"
                style={{ fontFamily: "var(--font-lookbook)" }}
              >
                {activeLook.title}
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/85 md:text-base">
                {activeLook.description}
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-block border-b border-white pb-1 text-xs font-semibold uppercase tracking-[0.25em] transition duration-300 hover:-translate-y-1 hover:text-white/70"
              >
                Shop the collection
              </Link>
            </div>

            <div className="hidden items-end gap-4 md:flex">
              <span className="font-display text-4xl font-semibold">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="mb-3 h-px w-32 overflow-hidden bg-white/35 lg:w-48">
                <div
                  className="h-full bg-white transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="mb-1 text-xs text-white/65">
                {String(looks.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-12">
          {looks.map((look, index) => (
            <span
              key={look.image}
              className={`block rounded-full transition-all duration-500 ${
                activeIndex === index
                  ? "h-8 w-1 bg-white"
                  : "h-1 w-1 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        {looks.map((look, index) => (
          <div
            key={look.image}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
            data-look-index={index}
            className="h-screen"
          />
        ))}
      </div>

      <div className="sr-only">
        {looks.map((look) => (
          <div key={look.title}>
            <h2>{look.title}</h2>
            <p>{look.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
