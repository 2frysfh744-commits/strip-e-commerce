import type { Metadata } from "next";
import Link from "next/link";

import AccountShell from "@/components/account/AccountShell";
import SubmitButton from "@/components/account/SubmitButton";
import { registerAction } from "@/app/account/actions";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a STRIP customer account to follow your orders.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const inputClasses =
  "w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-neutral-950";

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <AccountShell
      eyebrow="Join STRIP"
      title="Create account"
      intro="Register once, then see the status and details of every new order you place while signed in."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="font-semibold text-neutral-950 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {error ? (
        <p
          role="alert"
          className="mb-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      ) : null}

      <form action={registerAction} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-800">Full name</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
            className={inputClasses}
            placeholder="Your full name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-800">
            Email address
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className={inputClasses}
            placeholder="you@example.com"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-800">
              Password
            </span>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
              className={inputClasses}
              placeholder="8+ characters"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-800">
              Confirm password
            </span>
            <input
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              minLength={8}
              required
              className={inputClasses}
              placeholder="Repeat password"
            />
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton pendingLabel="Creating account...">
            Create account
          </SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-xs leading-6 text-neutral-500">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          terms
        </Link>{" "}
        and acknowledge our{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    </AccountShell>
  );
}
