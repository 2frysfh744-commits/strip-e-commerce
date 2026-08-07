"use client";

import Image from "next/image";
import { useState } from "react";

import { isRemoteProductImage } from "@/types/product";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

function isModelImage(image: string) {
  return image.includes("/products/model/") || isRemoteProductImage(image);
}

export default function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const remoteSelectedImage = isRemoteProductImage(selectedImage);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Image
          key={selectedImage}
          src={selectedImage}
          alt={name}
          fill
          priority
          unoptimized={remoteSelectedImage}
          className={
            isModelImage(selectedImage)
              ? "motion-fade-in object-cover"
              : "motion-fade-in object-contain p-8 md:p-12"
          }
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => {
            const remoteImage = isRemoteProductImage(image);

            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden border transition duration-300 hover:-translate-y-1 ${
                  selectedImage === image
                    ? "border-black"
                    : "border-neutral-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${name} preview`}
                  fill
                  unoptimized={remoteImage}
                  className={
                    isModelImage(image) ? "object-cover" : "object-contain p-2"
                  }
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
