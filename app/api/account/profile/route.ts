import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createCustomerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createCustomerClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const customerId = claimsData?.claims?.sub;

  if (claimsError || typeof customerId !== "string") {
    return NextResponse.json(
      { authenticated: false, profile: null },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const [userResult, profileResult] = await Promise.all([
    supabase.auth.getUser(),
    supabaseAdmin
      .from("customer_profiles")
      .select(
        "full_name, phone, city, postal_code, address, delivery_instructions"
      )
      .eq("user_id", customerId)
      .maybeSingle(),
  ]);

  const { data: userData } = userResult;
  const { data: profileData, error: profileError } = profileResult;

  if (profileError) {
    console.error("Unable to load customer checkout profile:", profileError);
  }

  const metadataName = userData?.user?.user_metadata.full_name;

  return NextResponse.json(
    {
      authenticated: true,
      profile: {
        fullName:
          profileData?.full_name ??
          (typeof metadataName === "string" ? metadataName : ""),
        email: userData?.user?.email ?? "",
        phone: profileData?.phone ?? "",
        city: profileData?.city ?? "",
        postalCode: profileData?.postal_code ?? "",
        address: profileData?.address ?? "",
        deliveryInstructions: profileData?.delivery_instructions ?? "",
      },
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
