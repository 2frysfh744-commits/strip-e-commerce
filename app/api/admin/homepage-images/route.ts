import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isHomepageImageKey } from "@/types/homepage";

function isAllowedHomepageImage(imageUrl: string) {
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    return false;
  }

  try {
    const image = new URL(imageUrl);
    const supabase = new URL(supabaseUrl);

    return (
      image.protocol === "https:" &&
      image.host === supabase.host &&
      image.pathname.startsWith(
        "/storage/v1/object/public/product-images/homepage/"
      )
    );
  } catch {
    return false;
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid homepage image information." },
        { status: 400 }
      );
    }

    const { slot, imageUrl } = body as {
      slot?: unknown;
      imageUrl?: unknown;
    };

    if (typeof slot !== "string" || !isHomepageImageKey(slot)) {
      return NextResponse.json(
        { error: "Choose a valid homepage position." },
        { status: 400 }
      );
    }

    if (
      typeof imageUrl !== "string" ||
      imageUrl.length > 2048 ||
      !isAllowedHomepageImage(imageUrl)
    ) {
      return NextResponse.json(
        { error: "The uploaded image address is not valid." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("homepage_images").upsert(
      {
        slot,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slot" }
    );

    if (error) {
      console.error("Unable to save homepage image:", error);
      return NextResponse.json(
        { error: "The homepage image could not be saved." },
        { status: 500 }
      );
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage");

    return NextResponse.json({ message: "Homepage image updated." });
  } catch (error) {
    console.error("Homepage image update route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving the image." },
      { status: 500 }
    );
  }
}
