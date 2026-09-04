"use client";

import { createClient } from "@supabase/supabase-js";
import { ImagePlus, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import {
  homepageImageSlots,
  isRemoteImage,
  type HomepageImageKey,
  type HomepageImages,
} from "@/types/homepage";

type SignedUpload = {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
  supabaseUrl: string;
  publishableKey: string;
  error?: string;
};

const maximumFileSize = 6 * 1024 * 1024;
const inputClasses =
  "w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-950 file:mr-4 file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-xs file:font-semibold";
const buttonClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50";

async function optimizeHomepageImage(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maximumSide = 2560;
    const scale = Math.min(
      1,
      maximumSide / Math.max(bitmap.width, bitmap.height)
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");

    if (!context) {
      bitmap.close();
      throw new Error("The image could not be prepared.");
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.9)
    );

    if (blob && blob.size <= maximumFileSize) {
      const cleanName = file.name.replace(/\.[^.]+$/, "") || "homepage";
      return new File([blob], `${cleanName}.webp`, { type: "image/webp" });
    }
  } catch {
    // Keep the original file when this browser cannot prepare an optimized copy.
  }

  if (file.size > maximumFileSize) {
    throw new Error("This image is too large. Choose an image smaller than 6 MB.");
  }

  return file;
}

async function uploadHomepageImage(file: File, slot: HomepageImageKey) {
  const preparedFile = await optimizeHomepageImage(file);
  const signResponse = await fetch("/api/admin/homepage-images/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slot,
      contentType: preparedFile.type,
      size: preparedFile.size,
    }),
  });
  const signed = (await signResponse.json()) as SignedUpload;

  if (!signResponse.ok) {
    throw new Error(signed.error ?? "The image upload could not be prepared.");
  }

  const uploadClient = createClient(signed.supabaseUrl, signed.publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { error } = await uploadClient.storage
    .from(signed.bucket)
    .uploadToSignedUrl(signed.path, signed.token, preparedFile, {
      cacheControl: "31536000",
      contentType: preparedFile.type,
    });

  if (error) {
    throw new Error("The image could not be uploaded.");
  }

  return signed.publicUrl;
}

function HomepageImageEditor({
  image,
  slot,
}: {
  image: string;
  slot: (typeof homepageImageSlots)[number];
}) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(image);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("photo");

    if (!(file instanceof File) || file.size < 1) {
      setError("Choose a picture first.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("Preparing image...");

    try {
      const imageUrl = await uploadHomepageImage(file, slot.key);
      setMessage("Saving homepage...");
      const response = await fetch("/api/admin/homepage-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: slot.key, imageUrl }),
      });
      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "The homepage image could not be saved.");
      }

      setCurrentImage(imageUrl);
      setMessage(result.message ?? "Homepage image updated.");
      form.reset();
      router.refresh();
    } catch (submitError) {
      setMessage("");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The homepage image could not be updated."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="overflow-hidden border border-neutral-300 bg-white">
      <div className="relative aspect-[16/10] bg-neutral-200">
        <Image
          src={currentImage}
          alt={`Current ${slot.label.toLowerCase()}`}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          unoptimized={isRemoteImage(currentImage)}
          className="object-cover"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">{slot.label}</h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {slot.description}
          </p>
        </div>

        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <ImagePlus size={17} /> Choose replacement
          </span>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            required
            disabled={busy}
            className={inputClasses}
          />
        </label>

        <button type="submit" disabled={busy} className={buttonClasses}>
          <Save size={16} />
          {busy ? "Working..." : "Replace image"}
        </button>

        {message ? (
          <p role="status" className="text-sm text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </form>
    </article>
  );
}

export default function HomepageImageManager({ images }: { images: HomepageImages }) {
  return (
    <div>
      <div className="mb-6 border border-neutral-300 bg-white p-5 text-sm leading-6 text-neutral-600">
        Replace one picture at a time. Changes appear on the live homepage as
        soon as the upload finishes. For the clearest result, use images at
        least 1600 pixels wide.
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {homepageImageSlots.map((slot) => (
          <HomepageImageEditor key={slot.key} slot={slot} image={images[slot.key]} />
        ))}
      </div>
    </div>
  );
}
