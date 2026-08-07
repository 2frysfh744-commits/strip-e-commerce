import "server-only";

import {
  createCustomerClient,
  hasCustomerAuthConfig,
} from "@/lib/supabase/server";

export async function getAuthenticatedCustomerId() {
  if (!hasCustomerAuthConfig()) {
    return null;
  }

  try {
    const supabase = await createCustomerClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || typeof data?.claims?.sub !== "string") {
      return null;
    }

    return data.claims.sub;
  } catch (error) {
    console.error("Unable to read customer session:", error);
    return null;
  }
}
