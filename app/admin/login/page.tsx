"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = String(
      formData.get("username") ?? ""
    ).trim();

    const password = String(
      formData.get("password") ?? ""
    );

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result: {
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to log in."
        );
      }

      router.replace("/admin/orders");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to log in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-5 py-20">
      <div className="w-full max-w-md bg-white p-8 shadow-sm md:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
            <LockKeyhole size={24} />
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            STRIP
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Admin login
          </h1>

          <p className="mt-3 text-sm text-neutral-600">
            Sign in to manage customer orders.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium">
              Username
            </span>

            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">
              Password
            </span>

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}