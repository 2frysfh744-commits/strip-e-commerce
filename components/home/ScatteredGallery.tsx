"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

const frames = [
  {
    image: "/products/model/black-half-zip-cargo.png",
    alt: "Black STRIP half-zip with beige cargo pants",
    label: "The black half-zip",
    position: "object-top",
  },
  {
    image: "/products/model/grey-half-zip-dark-jeans-walk.jpg",
    alt: "Grey STRIP half-zip with dark denim",
    label: "Grey in motion",
    position: "object-center",
  },
  {
    image: "/categories/women.jpg",
    alt: "STRIP women collection editorial",
    label: "Women’s edit",
    position: "object-center",
  },
  {
    image: "/products/model/brown-half-zip-light-jeans.jpg",
    alt: "Brown STRIP half-zip with light denim",
    label: "Earth tones",
    position: "object-top",
  },
  {
    image: "/products/model/white-tee-cargo.jpg",
    alt: "White STRIP tee with cargo pants",
    label: "The essentials",
    position: "object-top",
  },
];

type GalleryFrameProps = {
  activeIndex: number | null;
  className?: string;
  frame: (typeof frames)[number];
  index: number;
  onActivate: (index: number) => void;
  onPointerMove: (
    event: PointerEvent<HTMLAnchorElement>,
    index: number
  ) => void;
  sizes: string;
  style?: CSSProperties;
};

function GalleryFrame({
  activeIndex,
  className = "",
  frame,
  index,
  onActivate,
  onPointerMove,
  sizes,
  style,
}: GalleryFrameProps) {
  const isActive = activeIndex === index;
  const isInactive = activeIndex !== null && !isActive;

  return (
    <Link
      href="/shop"
      aria-label={`Shop ${frame.label}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          onActivate(index);
        }
      }}
      onPointerMove={(event) => onPointerMove(event, index)}
      onFocus={() => onActivate(index)}
      className={`group relative block overflow-hidden bg-neutral-800 outline-none transition-[height,opacity,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:z-30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white motion-reduce:transition-none ${className} ${
        isInactive ? "opacity-55 grayscale-[25%]" : "opacity-100"
      }`}
      style={style}
    >
      <Image
        src={frame.image}
        alt={frame.alt}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none ${frame.position} ${
          isActive ? "scale-[1.12]" : "scale-100"
        }`}
        style={{
          transformOrigin: "var(--pointer-x, 50%) var(--pointer-y, 50%)",
        }}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10 transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-75"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white md:p-5">
        <div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/65">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs md:text-sm">
            {frame.label}
          </p>
        </div>
        <span
          className={`text-[9px] font-semibold uppercase tracking-[0.25em] transition-[transform,opacity] duration-700 ${
            isActive
              ? "translate-x-0 opacity-100"
              : "translate-x-3 opacity-0"
          }`}
        >
          View
        </span>
      </div>
    </Link>
  );
}

export default function ScatteredGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const leftWidth =
    activeIndex === 0
      ? "50%"
      : activeIndex === 1 || activeIndex === 4
        ? "26%"
        : activeIndex === 2 || activeIndex === 3
          ? "27%"
          : "36%";
  const middleWidth =
    activeIndex === 0
      ? "20%"
      : activeIndex === 1 || activeIndex === 4
        ? "47%"
        : activeIndex === 2 || activeIndex === 3
          ? "20%"
          : "25%";
  const rightWidth =
    activeIndex === 0
      ? "30%"
      : activeIndex === 1 || activeIndex === 4
        ? "27%"
        : activeIndex === 2 || activeIndex === 3
          ? "53%"
          : "39%";

  const middleTopHeight =
    activeIndex === 1 ? "70%" : activeIndex === 4 ? "30%" : "42%";
  const middleBottomHeight =
    activeIndex === 1 ? "30%" : activeIndex === 4 ? "70%" : "58%";
  const rightTopHeight =
    activeIndex === 2 ? "73%" : activeIndex === 3 ? "35%" : "62%";
  const rightBottomHeight =
    activeIndex === 2 ? "27%" : activeIndex === 3 ? "65%" : "38%";

  function handlePointerMove(
    event: PointerEvent<HTMLAnchorElement>,
    index: number
  ) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--pointer-x", `${pointerX}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${pointerY}%`);

    if (activeIndex !== index) {
      setActiveIndex(index);
    }
  }

  const sharedFrameProps = {
    activeIndex,
    onActivate: setActiveIndex,
    onPointerMove: handlePointerMove,
  };

  return (
    <section
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-neutral-950 text-white"
      aria-labelledby="editorial-gallery-title"
      onPointerLeave={() => setActiveIndex(null)}
    >
      <div className="grid h-full grid-cols-2 grid-rows-[repeat(7,minmax(0,1fr))] md:hidden">
        <GalleryFrame
          {...sharedFrameProps}
          frame={frames[0]}
          index={0}
          sizes="50vw"
          className="col-start-1 col-end-2 row-start-1 row-end-4"
        />
        <GalleryFrame
          {...sharedFrameProps}
          frame={frames[1]}
          index={1}
          sizes="50vw"
          className="col-start-2 col-end-3 row-start-1 row-end-3"
        />
        <GalleryFrame
          {...sharedFrameProps}
          frame={frames[2]}
          index={2}
          sizes="50vw"
          className="col-start-2 col-end-3 row-start-3 row-end-6"
        />
        <GalleryFrame
          {...sharedFrameProps}
          frame={frames[3]}
          index={3}
          sizes="50vw"
          className="col-start-1 col-end-2 row-start-4 row-end-6"
        />
        <GalleryFrame
          {...sharedFrameProps}
          frame={frames[4]}
          index={4}
          sizes="100vw"
          className="col-start-1 col-end-3 row-start-6 row-end-8"
        />
      </div>

      <div className="hidden h-full w-full md:flex">
        <div
          className="h-full shrink-0 transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] motion-reduce:transition-none"
          style={{ width: leftWidth }}
        >
          <GalleryFrame
            {...sharedFrameProps}
            frame={frames[0]}
            index={0}
            sizes="50vw"
            className="h-full w-full"
          />
        </div>

        <div
          className="flex h-full shrink-0 flex-col transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] motion-reduce:transition-none"
          style={{ width: middleWidth }}
        >
          <GalleryFrame
            {...sharedFrameProps}
            frame={frames[1]}
            index={1}
            sizes="47vw"
            className="w-full"
            style={{ height: middleTopHeight }}
          />
          <GalleryFrame
            {...sharedFrameProps}
            frame={frames[4]}
            index={4}
            sizes="47vw"
            className="w-full"
            style={{ height: middleBottomHeight }}
          />
        </div>

        <div
          className="flex h-full shrink-0 flex-col transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] motion-reduce:transition-none"
          style={{ width: rightWidth }}
        >
          <GalleryFrame
            {...sharedFrameProps}
            frame={frames[2]}
            index={2}
            sizes="53vw"
            className="w-full"
            style={{ height: rightTopHeight }}
          />
          <GalleryFrame
            {...sharedFrameProps}
            frame={frames[3]}
            index={3}
            sizes="53vw"
            className="w-full"
            style={{ height: rightBottomHeight }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-8 bg-gradient-to-b from-black/55 to-transparent px-5 pb-20 pt-6 md:px-10 md:pt-9">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-white/75 md:text-[10px]">
            STRIP / Selected frames
          </p>
          <h2
            id="editorial-gallery-title"
            className="mt-2 text-[4.5rem] font-normal leading-[0.8] tracking-[0.04em] md:text-[7rem] lg:text-[8.5rem]"
            style={{ fontFamily: "var(--font-lookbook)" }}
          >
            MOVE FREELY.
          </h2>
        </div>

        <p className="hidden max-w-[15rem] pt-1 text-right text-[10px] font-semibold uppercase leading-5 tracking-[0.18em] text-white/75 lg:block">
          Hover a frame and watch the collection make room.
        </p>
      </div>
    </section>
  );
}
