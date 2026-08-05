import Link from "next/link";
import { Check } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
          <Check size={36} strokeWidth={1.5} />
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.3em] text-neutral-500">
          STRIP
        </p>

        <h1 className="mt-3 text-3xl font-semibold md:text-5xl">
          Order confirmed
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-neutral-600">
          Thank you for your order. We received your information and
          will contact you to confirm the delivery.
        </p>

        <div className="mt-8 border border-neutral-200 p-5 text-sm text-neutral-600">
          Payment will be collected when your order arrives.
        </div>

        <Link
          href="/shop"
          className="mt-8 inline-block bg-black px-10 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}