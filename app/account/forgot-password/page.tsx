import type { Metadata } from "next";
import Link from "next/link";

import AccountShell from "@/components/account/AccountShell";
import SubmitButton from "@/components/account/SubmitButton";
import { forgotPasswordAction } from "@/app/account/actions";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset for your STRIP account.",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, message } = await searchParams;

  return (
    <AccountShell
      eyebrow="Account recovery"
      title="Reset password"
      intro="Enter your account email. We will send a secure link so you can choose a new password."
      footer={
        <Link
          href="/account/login"
          className="font-semibold text-neutral-950 underline underline-offset-4"
        >
          Return to sign in
        </Link>
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

      <form action={forgotPasswordAction} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-800">
            Email address
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-neutral-950"
            placeholder="you@example.com"
          />
        </label>

        <div className="pt-2">
          <SubmitButton pendingLabel="Sending link...">
            Send reset link
          </SubmitButton>
        </div>
      </form>
    </AccountShell>
  );
}
