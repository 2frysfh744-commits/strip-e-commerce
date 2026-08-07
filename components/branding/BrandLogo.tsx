import Image from "next/image";

type BrandLogoProps = {
  tone?: "black" | "white";
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export default function BrandLogo({
  tone = "black",
  className = "",
  priority = false,
  decorative = false,
}: BrandLogoProps) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden ${className}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : "STRIP"}
    >
      <Image
        src={
          tone === "white"
            ? "/branding/strip-wordmark-white.png"
            : "/branding/strip-wordmark-black.png"
        }
        alt=""
        width={2000}
        height={2000}
        priority={priority}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[123%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
      />
    </span>
  );
}
