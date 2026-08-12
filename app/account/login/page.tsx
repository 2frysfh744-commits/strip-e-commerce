import type { Metadata } from "next";
import Link from "next/link";

import AccountShell from "@/components/account/AccountShell";
import PasswordInput from "@/components/account/PasswordInput";
import SubmitButton from "@/components/account/SubmitButton";
import { loginAction } from "@/app/account/actions";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your STRIP customer account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

const inputClasses =
  "w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-neutral-950";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <AccountShell
      eyebrow="Welcome back"
      title="Sign in"
      intro="Access your account to follow orders placed while you are signed in."
      footer={
        <p>
          New to STRIP?{" "}
          <Link
            href="/account/register"
            className="font-semibold text-neutral-950 underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {message ? (
        <p
          role="status"
          className="mb-6 border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
        >
          {message}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mb-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      ) : null}

      <form action={loginAction} className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-sm font-medium text-neutral-800">
            <label htmlFor="customer-login-password">Password</label>
            <Link
              href="/account/forgot-password"
              className="text-xs font-normal text-neutral-500 underline underline-offset-4 transition hover:text-neutral-950"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="customer-login-password"
            name="password"
            autoComplete="current-password"
            required
            className={inputClasses}
            placeholder="Your password"
          />
        </div>

        <div className="pt-2">
          <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-xs leading-6 text-neutral-500">
        You can always continue shopping and check out as a guest.
      </p>
    </AccountShell>
  );
}
