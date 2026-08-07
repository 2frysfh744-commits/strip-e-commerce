import { NextResponse } from "next/server";

import { createCustomerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/account";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createCustomerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  const loginUrl = new URL("/account/login", requestUrl.origin);
  loginUrl.searchParams.set(
    "error",
    "The confirmation link is invalid or has expired. Please try again."
  );

  return NextResponse.redirect(loginUrl);
}
