"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createCustomerClient } from "@/lib/supabase/server";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function destination(path: string, type: "error" | "message", text: string) {
  const params = new URLSearchParams({ [type]: text });
  return `${path}?${params.toString()}`;
}

async function getRequestOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (productionHost) {
    return `https://${productionHost}`;
  }

  return "http://localhost:3000";
}

export async function loginAction(formData: FormData) {
  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");

  if (!email || !password) {
    redirect(
      destination("/account/login", "error", "Enter your email and password.")
    );
  }

  const supabase = await createCustomerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      destination(
        "/account/login",
        "error",
        "The email or password is incorrect, or the email is not confirmed yet."
      )
    );
  }

  redirect("/account");
}

export async function registerAction(formData: FormData) {
  const fullName = readField(formData, "fullName");
  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");
  const passwordConfirmation = readField(formData, "passwordConfirmation");

  if (fullName.length < 2 || fullName.length > 80) {
    redirect(
      destination("/account/register", "error", "Enter your full name.")
    );
  }

  if (!email || !email.includes("@")) {
    redirect(
      destination("/account/register", "error", "Enter a valid email address.")
    );
  }

  if (password.length < 8) {
    redirect(
      destination(
        "/account/register",
        "error",
        "Your password must contain at least 8 characters."
      )
    );
  }

  if (password !== passwordConfirmation) {
    redirect(
      destination("/account/register", "error", "The passwords do not match.")
    );
  }

  const supabase = await createCustomerClient();
  const origin = await getRequestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/account`,
    },
  });

  if (error) {
    redirect(
      destination(
        "/account/register",
        "error",
        "We could not create the account. Please wait a moment and try again."
      )
    );
  }

  if (data.session) {
    redirect("/account");
  }

  redirect(
    destination(
      "/account/login",
      "message",
      "Account created. Check your email and confirm it before signing in."
    )
  );
}

export async function forgotPasswordAction(formData: FormData) {
  const email = readField(formData, "email").toLowerCase();

  if (!email || !email.includes("@")) {
    redirect(
      destination(
        "/account/forgot-password",
        "error",
        "Enter a valid email address."
      )
    );
  }

  const supabase = await createCustomerClient();
  const origin = await getRequestOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/account/update-password`,
  });

  if (error) {
    redirect(
      destination(
        "/account/forgot-password",
        "error",
        "The reset email could not be sent right now. Please try again later."
      )
    );
  }

  redirect(
    destination(
      "/account/forgot-password",
      "message",
      "If an account uses that email, a password-reset link is on its way."
    )
  );
}

export async function updatePasswordAction(formData: FormData) {
  const password = readField(formData, "password");
  const passwordConfirmation = readField(formData, "passwordConfirmation");

  if (password.length < 8) {
    redirect(
      destination(
        "/account/update-password",
        "error",
        "Your new password must contain at least 8 characters."
      )
    );
  }

  if (password !== passwordConfirmation) {
    redirect(
      destination(
        "/account/update-password",
        "error",
        "The passwords do not match."
      )
    );
  }

  const supabase = await createCustomerClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect(
      destination(
        "/account/login",
        "error",
        "That password-reset link has expired. Please request a new one."
      )
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      destination(
        "/account/update-password",
        "error",
        "The password could not be updated. Please request a new reset link."
      )
    );
  }

  redirect(
    destination("/account", "message", "Your password has been updated.")
  );
}

export async function logoutAction() {
  const supabase = await createCustomerClient();
  await supabase.auth.signOut();
  redirect(
    destination("/account/login", "message", "You have been signed out.")
  );
}
