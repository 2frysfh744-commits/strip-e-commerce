"use client";

import { createClient } from "@supabase/supabase-js";
import { ImagePlus, PackagePlus, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getTotalStock,
  isRemoteProductImage,
  type Product,
} from "@/types/product";

type ProductManagerProps = {
  products: Product[];
};

type ProductPayload = {
  name: string;
  price: number;
  description: string;
  category: string;
  sizes: string[];
  images: string[];
  featured: boolean;
  newArrival: boolean;
  active: boolean;
};

type SignedUpload = {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
  supabaseUrl: string;
  publishableKey: string;
  error?: string;
};

const inputClasses =
  "w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950";
const buttonClasses =
  "inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50";

function parseSizes(value: FormDataEntryValue | null) {
  return [
    ...new Set(
      String(value ?? "")
        .split(",")
        .map((size) => size.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];
}

function readPayload(formData: FormData, images: string[]): ProductPayload {
  return {
    name: String(formData.get("name") ?? "").trim(),
    price: Number(formData.get("price")),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    sizes: parseSizes(formData.get("sizes")),
    images,
    featured: formData.get("featured") === "on",
    newArrival: formData.get("newArrival") === "on",
    active: formData.get("active") === "on",
  };
}

async function readResponse(response: Response) {
  const result = (await response.json()) as {
    error?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(result.error ?? "The request could not be completed.");
  }

  return result;
}

async function optimizeImage(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${file.name} must be a JPG, PNG, or WebP image.`);
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maximumSide = 1800;
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
      canvas.toBlob(resolve, "image/webp", 0.86)
    );

    if (blob) {
      const cleanName = file.name.replace(/\.[^.]+$/, "") || "product";
      return new File([blob], `${cleanName}.webp`, { type: "image/webp" });
    }
  } catch {
    if (file.size <= 6 * 1024 * 1024) {
      return file;
    }
  }

  if (file.size > 6 * 1024 * 1024) {
    throw new Error(`${file.name} is too large to upload.`);
  }

  return file;
}

async function uploadProductImages(
  files: File[],
  onProgress: (message: string) => void
) {
  if (files.length < 1 || files.length > 8) {
    throw new Error("Choose between 1 and 8 product photos.");
  }

  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    onProgress(`Preparing photo ${index + 1} of ${files.length}...`);
    const file = await optimizeImage(files[index]);
    const signResponse = await fetch("/api/admin/product-images/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: file.type,
        size: file.size,
      }),
    });
    const signed = (await signResponse.json()) as SignedUpload;

    if (!signResponse.ok) {
      throw new Error(signed.error ?? "The image upload could not be prepared.");
    }

    onProgress(`Uploading photo ${index + 1} of ${files.length}...`);
    const uploadClient = createClient(
      signed.supabaseUrl,
      signed.publishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
    const { error } = await uploadClient.storage
      .from(signed.bucket)
      .uploadToSignedUrl(signed.path, signed.token, file, {
        cacheControl: "31536000",
        contentType: file.type,
      });

    if (error) {
      throw new Error(`Photo ${index + 1} could not be uploaded.`);
    }

    urls.push(signed.publicUrl);
  }

  return urls;
}

function Checkbox({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-black"
      />
      {label}
    </label>
  );
}

function CreateProductForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = (formData.getAll("photos") as File[]).filter(
      (file) => file.size > 0
    );

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const images = await uploadProductImages(files, setMessage);
      setMessage("Creating product...");
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readPayload(formData, images)),
      });
      const result = await readResponse(response);
      form.reset();
      setMessage(result.message ?? "Product created.");
      router.refresh();
    } catch (submitError) {
      setMessage("");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The product could not be created."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <details open className="border border-neutral-300 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 border-b border-neutral-200 p-6 text-lg font-semibold">
        <PackagePlus size={20} />
        Add a new product
      </summary>

      <form onSubmit={handleSubmit} className="grid gap-5 p-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Product name</span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Black oversized hoodie"
            className={inputClasses}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Price (MAD)</span>
          <input
            type="number"
            name="price"
            required
            min={1}
            step={1}
            placeholder="299"
            className={inputClasses}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Category</span>
          <input
            name="category"
            required
            minLength={2}
            maxLength={60}
            placeholder="Sweaters"
            className={inputClasses}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Sizes, separated by commas</span>
          <input
            name="sizes"
            required
            placeholder="S, M, L, XL"
            className={inputClasses}
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            name="description"
            required
            minLength={5}
            maxLength={1000}
            rows={4}
            className={`${inputClasses} resize-y`}
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <ImagePlus size={17} /> Product photos
          </span>
          <input
            type="file"
            name="photos"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            className={`${inputClasses} file:mr-4 file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-xs file:font-semibold`}
          />
          <span className="block text-xs leading-5 text-neutral-500">
            Choose 1–8 photos. The first photo becomes the main shop image.
            New products start with zero stock until you enter quantities.
          </span>
        </label>

        <div className="flex flex-wrap gap-6 md:col-span-2">
          <Checkbox name="active" label="Published in shop" defaultChecked />
          <Checkbox name="newArrival" label="New arrival" defaultChecked />
          <Checkbox name="featured" label="Featured product" />
        </div>

        <div className="md:col-span-2">
          <button type="submit" disabled={busy} className={buttonClasses}>
            <PackagePlus size={17} />
            {busy ? "Working..." : "Create product"}
          </button>
          {message ? (
            <p role="status" className="mt-3 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </form>
    </details>
  );
}

function ProductEditor({ product }: { product: Product }) {
  const router = useRouter();
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [stockBusy, setStockBusy] = useState(false);
  const [detailsMessage, setDetailsMessage] = useState("");
  const [stockMessage, setStockMessage] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [stockError, setStockError] = useState("");
  const totalStock = getTotalStock(product);

  async function updateDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const files = (formData.getAll("photos") as File[]).filter(
      (file) => file.size > 0
    );

    setDetailsBusy(true);
    setDetailsError("");
    setDetailsMessage("");

    try {
      const images =
        files.length > 0
          ? await uploadProductImages(files, setDetailsMessage)
          : product.images;
      setDetailsMessage("Saving product details...");
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readPayload(formData, images)),
      });
      const result = await readResponse(response);
      setDetailsMessage(result.message ?? "Product updated.");
      router.refresh();
    } catch (submitError) {
      setDetailsMessage("");
      setDetailsError(
        submitError instanceof Error
          ? submitError.message
          : "The product could not be updated."
      );
    } finally {
      setDetailsBusy(false);
    }
  }

  async function updateStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inventory = Object.fromEntries(
      product.sizes.map((size) => [size, Number(formData.get(size))])
    );

    setStockBusy(true);
    setStockError("");
    setStockMessage("");

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inventory }),
        }
      );
      const result = await readResponse(response);
      setStockMessage(result.message ?? "Stock saved.");
      router.refresh();
    } catch (submitError) {
      setStockError(
        submitError instanceof Error
          ? submitError.message
          : "Stock could not be saved."
      );
    } finally {
      setStockBusy(false);
    }
  }

  return (
    <details className="border border-neutral-300 bg-white">
      <summary className="grid cursor-pointer list-none grid-cols-[72px_1fr_auto] items-center gap-4 p-4 md:grid-cols-[88px_1fr_auto] md:p-5">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={product.image}
            alt=""
            fill
            unoptimized={isRemoteProductImage(product.image)}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-neutral-950">{product.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-neutral-500">
            {product.category} · {product.price} MAD
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            {totalStock} total units · {product.active ? "Published" : "Hidden"}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Manage
        </span>
      </summary>

      <div className="grid border-t border-neutral-200 lg:grid-cols-[1.4fr_0.8fr]">
        <form
          onSubmit={updateDetails}
          className="grid gap-4 p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <Link
              href={`/shop/${product.slug}`}
              target="_blank"
              className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
            >
              View live product page
            </Link>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              required
              defaultValue={product.name}
              className={inputClasses}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Price (MAD)</span>
            <input
              type="number"
              name="price"
              required
              min={1}
              step={1}
              defaultValue={product.price}
              className={inputClasses}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Category</span>
            <input
              name="category"
              required
              defaultValue={product.category}
              className={inputClasses}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Sizes</span>
            <input
              name="sizes"
              required
              defaultValue={product.sizes.join(", ")}
              className={inputClasses}
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={product.description}
              className={`${inputClasses} resize-y`}
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">
              Replace all photos (optional)
            </span>
            <input
              type="file"
              name="photos"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className={`${inputClasses} file:mr-4 file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-xs file:font-semibold`}
            />
            <span className="block text-xs text-neutral-500">
              Leave empty to keep the current photos. Choosing files replaces
              the gallery; the first becomes the main image.
            </span>
          </label>

          <div className="flex flex-wrap gap-6 md:col-span-2">
            <Checkbox
              name="active"
              label="Published in shop"
              defaultChecked={product.active !== false}
            />
            <Checkbox
              name="newArrival"
              label="New arrival"
              defaultChecked={product.newArrival}
            />
            <Checkbox
              name="featured"
              label="Featured product"
              defaultChecked={product.featured}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={detailsBusy}
              className={buttonClasses}
            >
              <Save size={16} />
              {detailsBusy ? "Working..." : "Save product details"}
            </button>
            {detailsMessage ? (
              <p role="status" className="mt-3 text-sm text-emerald-700">
                {detailsMessage}
              </p>
            ) : null}
            {detailsError ? (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {detailsError}
              </p>
            ) : null}
          </div>
        </form>

        <form
          onSubmit={updateStock}
          className="border-t border-neutral-200 bg-neutral-50 p-6 lg:border-l lg:border-t-0"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Physical inventory
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Stock by size</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Enter the total units you physically have now. Zero marks a size as
            sold out.
          </p>

          <div className="mt-6 space-y-3">
            {product.sizes.map((size) => (
              <label
                key={size}
                className="grid grid-cols-[1fr_110px] items-center gap-4"
              >
                <span className="text-sm font-medium">Size {size}</span>
                <input
                  type="number"
                  name={size}
                  required
                  min={0}
                  step={1}
                  defaultValue={product.inventory?.[size] ?? 0}
                  className={inputClasses}
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={stockBusy}
            className={`${buttonClasses} mt-6 w-full`}
          >
            <Save size={16} />
            {stockBusy ? "Saving..." : "Save stock totals"}
          </button>
          {stockMessage ? (
            <p role="status" className="mt-3 text-sm text-emerald-700">
              {stockMessage}
            </p>
          ) : null}
          {stockError ? (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {stockError}
            </p>
          ) : null}
        </form>
      </div>
    </details>
  );
}

export default function ProductManager({ products }: ProductManagerProps) {
  const publishedCount = products.filter((product) => product.active).length;
  const totalUnits = products.reduce(
    (total, product) => total + getTotalStock(product),
    0
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-neutral-300 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Products
          </p>
          <p className="mt-2 text-3xl font-semibold">{products.length}</p>
        </div>
        <div className="border border-neutral-300 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Published
          </p>
          <p className="mt-2 text-3xl font-semibold">{publishedCount}</p>
        </div>
        <div className="border border-neutral-300 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Total units
          </p>
          <p className="mt-2 text-3xl font-semibold">{totalUnits}</p>
        </div>
      </div>

      <CreateProductForm />

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Catalogue
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Existing products</h2>
          </div>
          <p className="text-sm text-neutral-500">Click a product to manage it</p>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <ProductEditor key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
