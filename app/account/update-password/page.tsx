import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountShell from "@/components/account/AccountShell";
import SubmitButton from "@/components/account/SubmitButton";
import { updatePasswordAction } from "@/app/account/actions";
import { createCustomerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Choose new password",
};

type UpdatePasswordPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const supabase = await createCustomerClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims) {
    redirect("/account/login");
  }

  const { error } = await searchParams;
  const inputClasses =
    "w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-neutral-950";

  return (
    <AccountShell
      eyebrow="Secure your account"
      title="Choose a new password"
      intro="Use at least eight characters and choose a password you do not use on another website."
    >
      {error ? (
        <p
          role="alert"
          className="mb-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      ) : null}

      <form action={updatePasswordAction} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-800">
            New password
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
            Confirm new password
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

        <div className="pt-2">
          <SubmitButton pendingLabel="Updating password...">
            Update password
          </SubmitButton>
        </div>
      </form>
    </AccountShell>
  );
}
